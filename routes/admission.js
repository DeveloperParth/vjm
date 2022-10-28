const router = require("express").Router();
const upload = require("../middlewares/Upload");
const BaseError = require("../utils/BaseError");
const checkStaff = require("./../middlewares/checkStaff");
const fs = require("fs");
const { models } = require("../config/db");
const jwt = require("jsonwebtoken");
const { sendDataVerificationMail } = require("../utils/Mail");

router.post(
  "/ug",
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
      console.log(req.body);
      const {
        name,
        surname,
        semester,
        stream,
        year,
        father_name,
        mother_name,
        address,
        taluka,
        district,
        city,
        pincode,
        state,
        whatsapp_mobile,
        father_mobile,
        home_mobile,
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
      function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }
      const response = await models.ug.create({
        name,
        surname,
        semester,
        stream,
        year,
        father_name,
        mother_name,
        address,
        taluka,
        district,
        city,
        pincode,
        state,
        whatsapp_mobile,
        father_mobile,
        home_mobile,
        dob: convert(dob),
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
      });
      handleFiles(req, response.id);
      const link = jwt.sign({ id: response.id }, process.env.JWT_VERIFY, {
        expiresIn: "15m",
      });
      sendDataVerificationMail(req.body.email, link);
      res.json({ data: response, message: "Submitted" });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const options = {};
    // const data = [];
    // switch (req.query.admission_type) {
    //   case "ug":
    //     data.concat(await models.ug.findAll(options));
    //     break;
    //   case "pg":
    //     data.concat(await models.pg.findAll(options));
    //     break;
    //   default:
    //     console.log("case");
    //     data.concat(await models.ug.findAll(options));
    //     data.concat(await models.pg.findAll(options));
    //     break;
    // }
    const data = await models.ug.findAll();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/ug/:id", async (req, res, next) => {
  try {
    const response = await models.ug.findByPk(req.params.id, {
      include: [{ model: models.ugPhotos, where: { isLatest: true } }],
      // paranoid: res.locals.user.role === "ADMIN",
    });
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
      await models.ug.update(
        {
          ...req.body,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      console.time("file");
      handleFiles(req, req.params.id);
      console.timeEnd("file");

      res.status(200).json({ message: "Successfully updated" });
    } catch (error) {
      next(error);
    }
  }
);
async function handleFiles(req, ugId) {
  const userDirName = `${req.body.stream}${req.body.semester}-${req.body.name} ${req.body.surname}-${ugId}`;
  const userDirPath = `./uploads/${userDirName}`;
  function checkIfExists(userDir, fieldname, iteration = 0) {
    const path = `${userDir}/${fieldname}${iteration || ""}.jpg`;
    if (fs.existsSync(path)) {
      return checkIfExists(userDir, fieldname, iteration + 1);
    }
    return path;
  }

  if (!fs.existsSync(userDirPath)) {
    fs.mkdirSync(userDirPath);
  }
  for (const fileFieldName in req.files) {
    const file = req.files[fileFieldName][0];
    const oldpath = file.path;
    // const path = `${userDirPath}/${file.fieldname}.jpg`;
    const path = checkIfExists(userDirPath, fileFieldName);
    fs.renameSync(oldpath, path);
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
