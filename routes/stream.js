const router = require("express").Router();
const { models } = require("../config/db");
const BaseError = require("../utils/BaseError");

const checkStaff = require("../middlewares/checkStaff");
const checkAdmin = require("../middlewares/checkAdmin");
const { Op, DatabaseError } = require("sequelize");

router.get("/all", checkStaff, async (req, res, next) => {
  try {
    const data = await models.stream.findAll();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", checkStaff, async (req, res, next) => {
  try {
    const data = await models.stream.findByPk(req.params.id);
    if (!data) throw new BaseError("Stream not found", 404);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.get("/:id/data", async (req, res, next) => {
  try {
    const stream = await models.stream.findByPk(req.params.id);
    if (!stream) throw new BaseError(400, "Invalid Stream");
    const { page = 1, limit = 10, search, field } = req.query;
    const offset = (page - 1) * limit;
    const where = {
      streamId: req.params.id,
    };
    if (search && field) {
      where[field] = {
        [Op.like]: `%${search}%`,
      };
    }
    const data = await models[stream.type.toLowerCase()].findAndCountAll({
      where,
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
        {
          model: models.stream,
          attributes: ["name"],
        },
      ],
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data });
  } catch (error) {
    if (error instanceof DatabaseError) {
      error = new BaseError(400, "Invalid field",);
    }
    next(error);
  }
});
router.post("/", checkAdmin, async (req, res, next) => {
  try {
    const { name, type } = req.body;
    await models.stream.create({ name: name.toUpperCase(), type });

    res.status(200).json({ message: "Stream Added" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", checkAdmin, async (req, res, next) => {
  try {
    const { name, type } = req.body;
    await models.stream.update(
      { name: name.toUpperCase(), type },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: "Stream Updated" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
