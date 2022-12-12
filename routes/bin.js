const router = require("express").Router();
const { models } = require("../config/db");
const { Op, where: Where, fn, col } = require("sequelize");
const checkAdmin = require("../middlewares/checkAdmin");
const BaseError = require("../utils/BaseError");

router.get("/:type", checkAdmin, async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!(type === "pg" || type === "ug"))
      throw new BaseError(400, "Invalid type of course");

    const { search, field, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const where = {
      deletedAt: { [Op.not]: null },
    };
    if (search && field && field !== "stream") {
      where[field] = Where(
        fn("LOWER", col(`${type}.${field}`)),
        "LIKE",
        `%${search.toLowerCase()}%`
      );
    }

    const data = await models[type].findAndCountAll({
      include: [
        {
          model: models.stream,
          as: "stream",
          where:
            search && field === "stream"
              ? { name: { [Op.like]: `%${search.toUpperCase()}%` } }
              : {},
        },
        {
          model: models.tc,
          required: false,
        },
      ],
      where,
      paranoid: false,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post("/:type/restore", checkAdmin, async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!(type === "pg" || type === "ug"))
      throw new BaseError(400, "Invalid type of course");
    const data = await models[type].restore();
    return res.status(200).json({ message: "Successfully restored" });
  } catch (error) {
    next(error);
  }
});

router.post("/:type/restore/:id", checkAdmin, async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!(type === "pg" || type === "ug"))
      throw new BaseError(400, "Invalid type of course");
    await models[type].restore({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({ message: "Successfully restored" });
  } catch (error) {
    next(error);
  }
});

// router.delete("/:type", checkAdmin, async (req, res, next) => {
//   try {
//     const type = req.params.type;
//     if (!(type === "pg" || type === "ug"))
//       throw new BaseError(400, "Invalid type of course");
//     await models[type].destroy({
//       where: {
//         deletedAt: { [Op.not]: null },
//       },
//       force: true,
//     });
//     return res.status(200).json({ message: "Successfully cleared the bin" });
//   } catch (error) {
//     next(error);
//   }
// });
// router.delete("/:type/:id", checkAdmin, async (req, res, next) => {
//   try {
//     const type = req.params.type;
//     if (!(type === "pg" || type === "ug"))
//       throw new BaseError(400, "Invalid type of course");
//     const data = await models[type].destroy({
//       where: {
//         id: req.params.id,
//       },
//       force: true,
//     });
//     return res.status(200).json({ message: "Successfully deleted" });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
