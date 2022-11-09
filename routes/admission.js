const router = require("express").Router();
const upload = require("../middlewares/Upload");
const BaseError = require("../utils/BaseError");
const checkStaff = require("./../middlewares/checkStaff");
const fs = require("fs");
const { models } = require("../config/db");
const jwt = require("jsonwebtoken");
const { sendDataVerificationMail } = require("../utils/Mail");
const { resolve } = require("path");
const { ugSchema } = require("../utils/Validation");
const Joi = require("joi");

router.post(
  "/ug",
  checkStaff,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "lc", maxCount: 1 },
    { name: "ssc", maxCount: 1 },
    { name: "hsc", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "thalassemia", maxCount: 1 },
    { name: "caste_certificate", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      await ugSchema.validateAsync(req.body, { abortEarly: true });
      const {
        name,
        surname,
        semester,
        stream,
        year,
        father_name,
        mother_name,
        address,
        district,
        city,
        pincode,
        state,
        whatsapp_mobile,
        father_mobile,
        dob,
        gender,
        birth_place,
        disease,
        physical_disability,
        category,
        minority,
        religion,
        caste,
        aadhar_number,
        blood_group,
        email,

        hsc_stream,
        hsc_seat,
        hsc_passing_year,
        hsc_month,
        hsc_attempt,
        hsc_total,
        hsc_obtained,
        hsc_percentage,
        hsc_percentile,
        hsc_grade,
        hsc_board,
        hsc_center,
        hsc_school_name,
        hsc_school_number,
      } = req.body;
      const parsedDob = dob.split("/").reverse().join("/");

      const response = await models.ug.create({
        name,
        surname,
        semester,
        stream,
        year,
        father_name,
        mother_name,
        address,
        district,
        city,
        pincode,
        state,
        whatsapp_mobile,
        father_mobile,
        dob: parsedDob,
        gender,
        birth_place,
        disease,
        physical_disability,
        category,
        minority,
        religion,
        caste,
        aadhar_number,
        blood_group,
        email,
        addedById: res.locals.user?.id,
        hsc_stream,
        hsc_seat,
        hsc_passing_year,
        hsc_month,
        hsc_attempt,
        hsc_total,
        hsc_obtained,
        hsc_percentage,
        hsc_percentile,
        hsc_grade,
        hsc_board,
        hsc_center,
        hsc_school_name,
        hsc_school_number,
      });
      handleFiles(req, response.id);
      const token = jwt.sign({ id: response.id }, process.env.JWT_VERIFY, {
        expiresIn: "15m",
      });
      const link = `${process.env.CLIENT_URL}/verify/${token}`;
      sendDataVerificationMail(req.body.email, response.dataValues, link);
      res.json({ data: response, message: "Submitted" });
    } catch (error) {
      if (error.isJoi)
        return next(new BaseError(400, error.message.replace(/"/g, "'")));
      next(error);
    }
  }
);

router.get("/ug", async (req, res, next) => {
  try {
    const data = await models.ug.findAll({
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
      ],
    });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/stream/:stream", async (req, res, next) => {
  try {
    PG_STREAMS = ["MCOM_GUJ", "MCOM_ENG", "MSC_CHE", "MSC_IT"];
    UG_STREAMS = ["BBA", "BCA", "BSC", "BCOM_GUJ", "BCOM_ENG", "BSW"];
    let data = [];
    if (UG_STREAMS.includes(req.params.stream.toUpperCase())) {
      data = await models.ug.findAll({
        where: {
          stream: req.params.stream,
        },
        include: [
          {
            model: models.user,
            as: "addedBy",
            attributes: ["id", "name", "role"],
          },
        ],
      });
    } else if (PG_STREAMS.includes(req.params.stream)) {
      data = await models.pg.findAll({
        where: {
          stream: req.params.stream,
        },
        include: [
          {
            model: models.user,
            as: "addedBy",
            attributes: ["id", "name", "role"],
          },
        ],
      });
    } else {
      throw new BaseError("Invalid Stream", 400);
    }
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/ug/:id", async (req, res, next) => {
  try {
    const response = await models.ug.findByPk(req.params.id, {
      include: [
        { model: models.ugPhotos, required: false, where: { isLatest: true } },
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
      ],
      // paranoid: res.locals.user.role === "ADMIN",
    });
    console.log(response);
    if (!response) throw new BaseError(404, "Not found");
    // if (response.isSoftDeleted() && res.locals.user.role === "STAFF")
    //   throw new BaseError(403, "Unauthorized");
    const data = response.dataValues;
    data.ugPhotos.map((photo) => {
      data[photo.type.toLowerCase()] = photo;
    });
    delete data.ugPhotos;
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.delete("/ug/:id", async (req, res, next) => {
  try {
    await models.ug.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});
router.put(
  "/ug/:id",
  checkStaff,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "lc", maxCount: 1 },
    { name: "ssc", maxCount: 1 },
    { name: "hsc", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "thalassemia", maxCount: 1 },
    { name: "caste_certificate", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const isExists = await models.ug.findByPk(req.params.id);
      if (!isExists) throw new BaseError(404, "Not found");
      if (isExists.stream !== req.body.stream) {
        const oldpath = path.join(
          __dirname,
          `../uploads/${req.body.stream}${req.body.semester}-${req.body.name} ${req.body.surname}-${req.body.whatsapp_mobile}`
        );
        fs.renameSync();
      }
      await models.ug.update(
        {
          ...req.body,
          addedBy: res.locals.user.id,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      handleFiles(req, req.params.id);

      res.status(200).json({ message: "Successfully updated" });
    } catch (error) {
      next(error);
    }
  }
);
async function handleFiles(req, ugId) {
  const userDirName = `${req.body.stream}${req.body.semester}-${req.body.name} ${req.body.surname}-${req.body.whatsapp_mobile}`;
  const userDirPath = `./uploads/${userDirName}`;
  function checkIfExists(userDir, fieldname, iteration = 0) {
    const path = `${userDir}/${fieldname}${iteration || ""}.jpg`;
    if (fs.existsSync(resolve(path))) {
      return checkIfExists(userDir, fieldname, iteration + 1);
    }
    return path;
  }

  if (!fs.existsSync(resolve(userDirPath))) {
    fs.mkdirSync(resolve(userDirPath));
  }
  for (const fileFieldName in req.files) {
    const file = req.files[fileFieldName][0];
    const oldpath = file.path;
    const path = checkIfExists(userDirPath, fileFieldName);
    fs.renameSync(resolve(oldpath), resolve(path));
    // fs.unlinkSync(resolve(oldpath));
    await models.ugPhotos.update(
      {
        isLatest: false,
      },
      {
        where: {
          type: file.fieldname,
          ugId,
        },
      }
    );
    await models.ugPhotos.create({
      type: file.fieldname,
      path,
      ugId,
    });
  }
}
module.exports = router;
