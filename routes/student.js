const router = require("express").Router();

const checkStudent = require("../middlewares/checkStudent");
const { models } = require("./../config/db");

const BaseError = require("./../utils/BaseError");
router.get("/", checkStudent, async (req, res, next) => {
  try {
    const type = res.locals.user.type.toLowerCase();
    // if (type !== "ug" || type !== "pg") throw new BaseError();
    const id = res.locals.user.id;
    const user = await models[type].findByPk(id, {
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name"],
        },
        {
          model: models.stream,
          as: "stream",
        },
        {
          model: models[type === "ug" ? "ugPhotos" : "phPhotos"],

        }
      ],
    });

    if (!user) throw new BaseError();
    const data = user.dataValues;
    data.dob = user.dob;
    data.ugPhotos.map((photo) => {
      data[photo.type.toLowerCase()] = photo;
    });
    delete data.ugPhotos;
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post("/bonafide", checkStudent, async (req, res, next) => {
  try {
    const idName =
      res.locals.user.type.toLowerCase() === "ug" ? "ugId" : "pgId";
    const isExists = await models.bonafide.findOne({
      where: {
        [idName]: res.locals.user.id,
        type: res.locals.user.type.toUpperCase(),
      },
    });
    if (isExists) {
      isExists.count = isExists.count + 1;
      isExists.purpose = req.body.purpose;
      await isExists.save();
      return res.status(200).json({ message: "Bonafide created successfully" });
    }
    await models.bonafide.create({
      [idName]: res.locals.user.id,
      addedById: res.locals.user.id,
      type: res.locals.user.type,
      purpose: req.body.purpose,
      count: 1,
    });
    return res.status(200).json({ message: "Bonafide created successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
