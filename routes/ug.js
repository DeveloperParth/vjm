const router = require("express").Router();
const upload = require("../middlewares/Upload");
const BaseError = require("../utils/BaseError");
const checkStaff = require("../middlewares/checkStaff");
const fs = require("fs");
const { models } = require("../config/db");
const jwt = require("jsonwebtoken");
const {
  sendDataVerificationMail,
  sendStudentCreatedMail,
} = require("../utils/Mail");
const { resolve } = require("path");
const { ugSchema } = require("../utils/Validation");
const path = require("path");
const { Op, where: Where, fn, col } = require("sequelize");
const { generateStudentPassword } = require("../utils/GeneratePassword");


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
]

router.post(
  "/",
  checkStaff,
  upload.fields(MULTER_FIELDS),
  async (req, res, next) => {
    try {
      await ugSchema.validateAsync(req.body, { abortEarly: true });
      const isAadharExist = await models.ug.findOne({
        where: {
          aadhar_number: req.body.aadhar_number,
        },
      });
      if (isAadharExist)
        throw new BaseError(400, "Aadhar Number already exist");
      const { address, email, password, } = req.body;
      const response = await models.ug.create({
        password: password || generateStudentPassword(req.body),
        addedById: res.locals.user?.id,
        address: address?.replaceAll('"', ""),
        ...req.body,
      });
      await handleFiles(req, response.id).catch(async (err) => {
        await models.ug.destroy(
          { where: { id: response.id } },
          { paranoid: false }
        );
        throw err;
      });
      const token = jwt.sign({ id: response.id }, process.env.JWT_VERIFY, {
        expiresIn: "15m",
      });

      const link = `${process.env.FRONTEND_URl}/ug/verify/${token}`;
      if (email) {
        sendDataVerificationMail(req.body.email, response.dataValues, link);
      }
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
    const { page = 1, limit = 10, search, field } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (search && field && field !== "stream") {
      where[field] = Where(
        fn("LOWER", col(`ug.${field}`)),
        "LIKE",
        `%${search.toLowerCase()}%`
      );
    }
    const data = await models.ug.findAndCountAll({
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
        {
          model: models.stream,
          as: "stream",
          where:
            search && field === "stream"
              ? { name: { [Op.like]: `%${search.toUpperCase()}%` } }
              : {},
        },
      ],
      where,
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
    const data = await models.ug.findAll({
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
    const response = await models.ug.findByPk(req.params.id, {
      include: [
        { model: models.ugPhotos, required: false, where: { isLatest: true } },
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
        {
          model: models.stream,
          as: "stream",
        },
        {
          model: models.stream,
          as: "stream",
        },
      ],
    });
    if (!response) throw new BaseError(404, "Not found");
    const data = response.dataValues;
    data.dob = data.dob;
    data.ugPhotos.map((photo) => {
      data[photo.type.toLowerCase()] = photo;
    });
    delete data.ugPhotos;
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", checkStaff, async (req, res, next) => {
  try {
    await models.ug.update(
      {
        addedById: res.locals.user?.id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
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
  "/:id",
  checkStaff,
  upload.fields(MULTER_FIELDS),
  async (req, res, next) => {
    try {
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] === "") req.body[key] = null;
        if (key === "address")
          req.body[key] = req.body[key]?.replaceAll('"', "");
        if (req.body[key] === "null") req.body[key] = null;
        if (req.body[key] === "undefined") req.body[key] = null;
      });
      const isExists = await models.ug.findByPk(req.params.id, { include: [{ model: models.stream, as: "stream" }] });
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
        const newpath = path.join(
          __dirname,
          `../uploads/${req.body.stream}-${req.body.semester}-${req.body.name} ${req.body.surname}-${req.body.aaadhar_number}`
        );
        const oldpath = path.join(
          __dirname,
          `../uploads/${isExists.stream}-${isExists.semester}-${isExists.name} ${isExists.surname}-${isExists.aadhar_number}`
        );
        fs.existsSync(oldpath) && fs.renameSync(oldpath, newpath);
      }
      await handleFiles(req, req.params.id);
      await models.ug.update(
        {
          ...req.body,
          addedById: res.locals.user.id,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).json({ message: "Successfully updated" });
    } catch (error) {
      next(error);
    }
  }
);
router.get("/verify/:token", async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY);
    const data = await models.ug.update(
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
    return res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    next(error);
  }
});
async function handleFiles(req, ugId) {
  const stream = await models.stream.findByPk(req.body.streamId);
  if (!stream) throw new BaseError(404, "Stream not found");
  const userDirName = `${stream.name}-${req.body.semester}-${req.body.name} ${req.body.surname}-${req.body.aadhar_number}`;
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
