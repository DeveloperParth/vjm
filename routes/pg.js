const router = require("express").Router();
const upload = require("../middlewares/Upload");
const BaseError = require("../utils/BaseError");
const checkStaff = require("./../middlewares/checkStaff");
const fs = require("fs");
const { where: Where, fn, col } = require("sequelize");
const { models } = require("../config/db");
const jwt = require("jsonwebtoken");
const {
  sendDataVerificationMail,
  sendStudentCreatedMail,
} = require("../utils/Mail");
const { resolve, join } = require("path");
const { pgSchema } = require("../utils/Validation");
const { generateStudentPassword } = require("../utils/GeneratePassword");
const { MulterError } = require("multer");


const MULTER_FIELDS = [
  { name: "photo", maxCount: 1 },
  { name: "lc", maxCount: 1 },
  { name: "ssc", maxCount: 1 },
  { name: "hsc", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "thalassemia", maxCount: 1 },
  { name: "caste_certificate", maxCount: 1 },
  { name: "ph_certificate", maxCount: 1 },
  { name: "year_certificate", maxCount: 1 },
  { name: "all_marksheets", maxCount: 10 },
]

router.post(
  "/",
  checkStaff,
  upload.fields(MULTER_FIELDS),
  async (req, res, next) => {
    try {
      await pgSchema.validateAsync(req.body, { abortEarly: true });
      const isAadharExist = await models.ug.findOne({
        where: {
          aadhar_number: req.body.aadhar_number,
        },
      });
      if (isAadharExist)
        throw new BaseError(400, "Aadhar Number already exist");
      const { address, email, password } = req.body;

      const response = await models.pg.create({
        address: address?.replaceAll('"', ""),
        password: password || generateStudentPassword(req.body),
        addedById: res.locals.user?.id,
        ...req.body,
      });
      await handleFiles(req, response.id);
      const token = jwt.sign({ id: response.id }, process.env.JWT_VERIFY, {
        expiresIn: "1d",
      });
      const link = `${process.env.FRONTEND_URL}/pg/verify/${token}`;
      if (email) {
        sendDataVerificationMail(req.body.email, response.dataValues, link);
      }
      res.json({ data: response, message: "Submitted" });
    } catch (error) {
      if (error.isJoi)
        return next(new BaseError(400, error.message.replace(/"/g, "'")));
      if (error instanceof MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new BaseError(400, "Only 10 maximum files are allowed"))
      }
      next(error);
    }
  }
);

router.get("/", checkStaff, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, field } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (search && field && field !== "stream") {
      where[field] = Where(
        fn("LOWER", col(`pg.${field}`)),
        "LIKE",
        `%${search.toLowerCase()}%`
      );
    }
    const data = await models.pg.findAndCountAll({
      where,
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
        {
          model: models.stream,
          as: "stream",
        },
      ],

      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/all", checkStaff, async (req, res, next) => {
  try {
    const data = await models.pg.findAll({
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
        {
          model: models.stream,
          as: "stream",
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", checkStaff, async (req, res, next) => {
  try {
    const response = await models.pg.findByPk(req.params.id, {
      include: [
        { model: models.pgPhotos, required: false, where: { isLatest: true } },
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
        {
          model: models.stream,
          as: "stream",
        },
      ],
    });
    if (!response) throw new BaseError(404, "Not found");
    const data = response.dataValues;
    data.pgPhotos.map((photo) => {
      if (photo.type === "ALL_MARKSHEETS") {
        // create array if not exists and push the photo or push the photo if array exists

        data.all_marksheets = data.all_marksheets
          ? [...data.all_marksheets, photo.dataValues]
          : [photo.dataValues];
      } else {
        data[photo.type.toLowerCase()] = photo;
      }
    });
    delete data.pgPhotos;
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", checkStaff, async (req, res, next) => {
  try {
    await models.pg.update(
      { addedById: res.locals.user?.id },
      {
        where: {
          id: req.params.id,
        },
      }
    );
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
  upload.fields(MULTER_FIELDS),
  async (req, res, next) => {
    try {
      const isExists = await models.pg.findByPk(req.params.id, { include: [{ model: models.stream, as: "stream" }] });
      if (!isExists) throw new BaseError(404, "Not found");
      if (isExists.stream.id !== req.body.streamId) {
        const newStreamToUpdate = await models.stream.findByPk(req.body.streamId);
        if (!newStreamToUpdate) throw new BaseError(404, "The stream to update not found");
        if (newStreamToUpdate.type !== isExists.stream.type) throw new BaseError(400, "Stream type cannot be changed")
      }
      if (
        isExists.semester !== req.body.semester ||
        isExists.name !== req.body.name ||
        isExists.surname !== req.body.surname ||
        isExists.aadhar_number !== req.body.aadhar_number
      ) {
        const newpath = join(
          __dirname,
          `../uploads/${req.body.stream}-${req.body.semester}-${req.body.name} ${req.body.surname}-${req.body.aaadhar_number}`
        );
        const oldpath = join(
          __dirname,
          `../uploads/${isExists.stream}-${isExists.semester}-${isExists.name} ${isExists.surname}-${isExists.aadhar_number}`
        );
        fs.existsSync(oldpath) && fs.renameSync(oldpath, newpath);
      }
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] === "") req.body[key] = null;
        if (key === "address")
          req.body[key] = req.body[key]?.replaceAll('"', "");
        if (req.body[key] === "null") req.body[key] = null;
        if (req.body[key] === "undefined") req.body[key] = null;
      });
      await handleFiles(req, req.params.id);
      await models.pg.update(
        {
          ...req.body,
          address: req.body.address.replaceAll('"', ""),
          hsc_attempt:
            req.body.hsc_attempt === "null" ? null : req.body.hsc_attempt,
          addedBy: res.locals.user.id,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).json({ message: "Successfully updated" });
    } catch (error) {
      if (error instanceof MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new BaseError(400, "Only 10 maximum files are allowed"))
      }
      next(error);
    }
  }
);
router.get("/verify/pg/:token", async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY);
    const data = await models.pg.update(
      {
        isVerified: true,
      },
      {
        where: {
          id: decoded.id,
        },
      }
    );
    sendStudentCreatedMail(data.email);
    res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    next(error);
  }
});
async function handleFiles(req, pgId) {
  const stream = await models.stream.findByPk(req.body.streamId);
  if (!stream) throw new BaseError(404, "Stream not found");
  const userDirName = `${stream.name}${req.body.semester}-${req.body.name} ${req.body.surname}-${req.body.whatsapp_mobile}`;
  const userDirPath = `./uploads/${userDirName}`;


  if (!fs.existsSync(resolve(userDirPath))) {
    fs.mkdirSync(resolve(userDirPath));
  }
  if (req.body.deletePhotosArray) {
    const deletePhotosArray = JSON.parse(req.body.deletePhotosArray);

    await Promise.all(
      deletePhotosArray.map(async (fieldnameToDelete) => {
        await models.pgPhotos.update({
          isLatest: false,
        }, {
          where: {
            type: fieldnameToDelete,
            pgId,
          }
        })
      })
    )
  }
  if (req.body.deleteAllMarksheetsArray) {
    const all_marksheets = JSON.parse(req.body.deleteAllMarksheetsArray);
    console.log("🚀 ~ file: pg.js:283 ~ handleFiles ~ all_marksheets", all_marksheets)
    await Promise.all(
      all_marksheets.map(async (idToDelete) => {
        await models.pgPhotos.destroy({
          where: {
            id: idToDelete,
            type: "ALL_MARKSHEETS",
            pgId,
          }
        }
        )
      })
    )

  }
  if (req.files.all_marksheets) {
    await models.pgPhotos.update(
      { isLatest: false },
      { where: { pgId, type: "ALL_MARKSHEETS" } }
    );
    req.files.all_marksheets.forEach(async (file, index) => {
      const path = checkIfExists(userDirPath, `all_marksheet[${index + 1}]`);
      if (fs.existsSync(resolve(file.path))) {
        fs.renameSync(resolve(file.path), resolve(path));

      }
      await models.pgPhotos.create({
        pgId,
        type: "ALL_MARKSHEETS",
        path,
        isLatest: true,
      });
    });
  }
  delete req.files.all_marksheets;
  for (const fileFieldName in req.files) {
    console.log(fileFieldName);
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
function checkIfExists(userDir, fieldname, iteration = 0) {
  const path = `${userDir}/${fieldname}${iteration || ""}.jpg`;
  if (fs.existsSync(resolve(path))) {
    return checkIfExists(userDir, fieldname, iteration + 1);
  }
  return path;
}

module.exports = router;
