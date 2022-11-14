const router = require("express").Router();
const { models } = require("../config/db");
const Op = require("sequelize").Op;

const BaseError = require("../utils/BaseError");

router.get("/:type", async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!(type === "pg" || type === "ug"))
      throw new BaseError(400, "Invalid type of course");
    const data = await models[type].findAll({
      where: {
        deletedAt: { [Op.not]: null },
      },
      paranoid: false,
    });
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post("/:type/restore", async (req, res, next) => {
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

router.post("/:type/restore/:id", async (req, res, next) => {
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
router.delete("/:type", async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!(type === "pg" || type === "ug"))
      throw new BaseError(400, "Invalid type of course");
    await models[type].destroy({
      where: {
        deletedAt: { [Op.not]: null },
      },
      force: true,
    });
    return res.status(200).json({ message: "Successfully cleared the bin" });
  } catch (error) {
    next(error);
  }
});
router.delete("/:type/:id", async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!(type === "pg" || type === "ug"))
      throw new BaseError(400, "Invalid type of course");
    const data = await models[type].destroy({
      where: {
        id: req.params.id,
      },
      force: true,
    });
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
