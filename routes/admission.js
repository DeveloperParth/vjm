const router = require("express").Router();
const upload = require("../middlewares/Upload");
const BaseError = require("../utils/BaseError");
const connection = require("./../config/db");
const checkAdmin = require("./../middlewares/checkAdmin");
const fs = require("fs");
const { models } = require("../config/db");

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
      const {
        name,
        surname,
        semester,
        stream,
        father_name,
        mother_name,
        address,
        city,
        pincode,
        state,
        whatsapp_mobile,
        father_mobile,
        home_mobile,
        dob,
        gender,
        birth_place,
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
        hsc_year,
        hsc_month,
        hsc_attempt,
        hsc_total,
        hsc_obtained,
        hsc_percentage,
        hsc_percentile,
        hsc_grade,
        hsc_board,
        hsc_center,
        hsc_school,
      } = req.body;
      const isRequestValid = validateRequest(req);
      if (!isRequestValid) {
        deleteFileFromTemp(req.files);
        throw new BaseError(400, "Plese fill all required field");
      }
      const response = await models.ug.create({
        name,
        surname,
        semester,
        stream,
        father_name,
        mother_name,
        address,
        city,
        pincode,
        state,
        whatsapp_mobile,
        father_mobile,
        home_mobile,
        dob: Date(dob),
        gender,
        birth_place,
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
        hsc_year,
        hsc_month,
        hsc_attempt,
        hsc_total,
        hsc_obtained,
        hsc_percentage,
        hsc_percentile,
        hsc_grade,
        hsc_board,
        hsc_center,
        hsc_school,
      });
      handleFiles(req, response.id);

      res.json({ data: response, message: "Submitted" });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/ug", async (req, res, next) => {
  try {
    const data = await models.ug.findAll({
      // include: "ugPhotos",
      // group: "ugPhotos.type",
    });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/ug/:id", async (req, res, next) => {
  try {
    const { dataValues: data } = await models.ug.findByPk(req.params.id, {
      include: [{ model: models.ugPhotos }],
    });
    const obj = {};
    console.log(data);
    data.ugPhotos.map((photo) => {
      if (obj[photo.type]) {
        obj[photo.type].push(photo);
      } else {
        obj[photo.type] = [photo];
      }
    });
    delete data.ugPhotos;
    res.status(200).json({ data: { ...data, photos: obj } });
  } catch (error) {
    next(error);
  }
});

router.delete("/ug", async (req, res, next) => {
  try {
    // await models.ug
  } catch (error) {
    next(error);
  }
});

function validateRequest(req) {
  const caste_array = ["ST", "SC", "SEBC", "EBC"];
  if (!req.files.photo) return false;
  if (!req.files.hsc) return false;
  if (!req.files.ssc) return false;
  if (!req.files.aadhar) return false;
  if (!req.files.thalassemia) return false;

  if (!(caste_array.includes(req.body.category) && req.files.caste_certificate))
    return false;
  return true;
}
function deleteFileFromTemp(files) {
  for (const fileFieldName in files) {
    const file = files[fileFieldName][0];
    fs.unlinkSync(file.path);
  }
}
async function handleFiles(req, ugId) {
  const userDirName = `${req.body.stream}${req.body.semester}-${req.body.name} ${req.body.surname}`;
  const userDirPath = `./uploads/${userDirName}`;

  if (!fs.existsSync(userDirPath)) {
    fs.mkdirSync(userDirPath);
  }
  for (const fileFieldName in req.files) {
    const file = req.files[fileFieldName][0];
    const oldpath = file.path;
    const path = `${userDirPath}/${file.fieldname}.jpg`;
    fs.renameSync(oldpath, path);
    await models.ugPhotos.create({
      type: file.fieldname,
      path,
      ugId,
    });
  }
}
function checkIfExists(userDir, fieldname, iteration = 0) {
  const path = `${userDir}/${fieldname}${iteration || ""}.jpg`;
  if (fs.existsSync("./uploads" + path)) {
    return checkIfExists(userDir, fieldname, iteration + 1);
  }
  return path;
}
module.exports = router;
