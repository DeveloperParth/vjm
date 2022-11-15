const router = require("express").Router();
const upload = require("../middlewares/Upload");
const BaseError = require("../utils/BaseError");
const checkStaff = require("./../middlewares/checkStaff");
const fs = require("fs");
const { models } = require("../config/db");
const jwt = require("jsonwebtoken");
const { sendDataVerificationMail } = require("../utils/Mail");
const { resolve } = require("path");
const { pgSchema } = require("../utils/Validation");

router.post(
  "/",
  checkStaff,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "lc", maxCount: 1 },
    { name: "ssc", maxCount: 1 },
    { name: "hsc", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "thalassemia", maxCount: 1 },
    { name: "caste_certificate", maxCount: 1 },
    { name: "all_marksheets", maxCount: 6 },
  ]),
  async (req, res, next) => {
    try {
      console.log(req.body.ug_seat);
      await pgSchema.validateAsync(req.body, { abortEarly: true });
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

        ug_degree,
        ug_stream,
        ug_seat,
        ug_passing_year,
        ug_month,
        ug_attempt,
        ug_total,
        ug_obtained,
        ug_percentage,
        ug_college_name,
        ug_university,

        pg_degree,
        pg_stream,
        pg_seat,
        pg_passing_year,
        pg_month,
        pg_attempt,
        pg_total,
        pg_obtained,
        pg_percentage,
        pg_college_name,
        pg_university,
      } = req.body;

      const response = await models.pg.create({
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

        ug_degree,
        ug_stream,
        ug_seat,
        ug_passing_year,
        ug_month,
        ug_attempt,
        ug_total,
        ug_obtained,
        ug_percentage,
        ug_college_name,
        ug_university,

        pg_degree,
        pg_stream,
        pg_seat,
        pg_passing_year,
        pg_month,
        pg_attempt,
        pg_total,
        pg_obtained,
        pg_percentage,
        pg_college_name,
        pg_university,
      });
      handleFiles(req, response.id);
      const token = jwt.sign({ id: response.id }, process.env.JWT_VERIFY, {
        expiresIn: "15m",
      });
      const link = `${process.env.FRONTEND_URL}/pg/verify/${token}`;
      sendDataVerificationMail(req.body.email, response.dataValues, link);
      res.json({ data: response, message: "Submitted" });
    } catch (error) {
      if (error.isJoi)
        return next(new BaseError(400, error.message.replace(/"/g, "'")));
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const data = await models.pg.findAll({
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
      ],
    });
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const response = await models.pg.findByPk(req.params.id, {
      include: [
        { model: models.pgPhotos, required: false, where: { isLatest: true } },
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
      ],
    });
    if (!response) throw new BaseError(404, "Not found");
    const data = response.dataValues;
    data.pgPhotos.map((photo) => {
      data[photo.type.toLowerCase()] = photo;
    });
    delete data.pgPhotos;
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    await models.pg.destroy({
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
  "/:id",
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
        const newpath = path.join(
          __dirname,
          `../uploads/${req.body.stream}${req.body.semester}-${req.body.name} ${req.body.surname}-${req.body.whatsapp_mobile}`
        );
        const oldpath = path.join(
          __dirname,
          `../uploads/${isExists.stream}${isExists.semester}-${isExists.name} ${isExists.surname}-${isExists.whatsapp_mobile}`
        );
        fs.renameSync(oldpath, newpath);
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
router.get("/verify/ug/:token", async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY);
    await models.ug.update(
      {
        isVerified: true,
      },
      {
        where: {
          id: decoded.id,
        },
      }
    );
  } catch (error) {
    next(error);
  }
});
async function handleFiles(req, pgId) {
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
    await models.pgPhotos.update(
      {
        isLatest: false,
      },
      {
        where: {
          type: file.fieldname,
          pgId,
        },
      }
    );
    await models.pgPhotos.create({
      type: file.fieldname,
      path,
      pgId,
    });
  }
}
module.exports = router;
