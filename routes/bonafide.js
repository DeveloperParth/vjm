const router = require("express").Router();

const { Op } = require("sequelize");
const checkStudent = require("../middlewares/checkStudent");
const { models, fn, col } = require("./../config/db");

const checkStaff = require("./../middlewares/checkStaff");

const BaseError = require("./../utils/BaseError");

router.get("/:type/", checkStaff, async (req, res, next) => {
  try {
    const type = req.params.type.toUpperCase();
    if (!(type === "ug" || type === "pg"))
      throw new BaseError(400, `Invalid type '${type}'`);

    const query = req.query.search;
    const data = await models.bonafide.findAll({
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "email"],
        },
        {
          model: models[type],
          where: query
            ? {
                name: {
                  [Op.like]: `%${query}%`,
                },
              }
            : {},
        },
      ],
    });
    if (!data) throw new BaseError(404, "Not found");
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post("/:type/:id", checkStaff, async (req, res, next) => {
  try {
    const idName = req.params.type.toLowerCase() === "ug" ? "ugId" : "pgId";
    const isExists = await models.bonafide.findOne({
      where: {
        [idName]: req.params.id,
        type: req.params.type.toUpperCase(),
      },
    });
    if (isExists) {
      isExists.count = isExists.count + 1;
      isExists.purpose = req.body.purpose;
      await isExists.save();
      return res.status(200).json({ message: "Bonafide created successfully" });
    }
    await models.bonafide.create({
      [idName]: req.params.id,
      addedById: res.locals.user.id,
      type: req.params.type,
      purpose: req.body.purpose,
      count: 1,
    });
    return res.status(200).json({ message: "Bonafide created successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
