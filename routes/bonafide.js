const router = require("express").Router();

const { models, fn, col } = require("./../config/db");

const checkStaff = require("./../middlewares/checkStaff");

const BaseError = require("./../utils/BaseError");

router.get("/:type/", async (req, res, next) => {
  try {
    if (!(req.params.type === "ug" || req.params.type === "pg"))
      throw new BaseError(400, `Invalid type '${req.params.type}'`);
    const data = await models.bonafide.findAll({
      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "email"],
        },
        {
          model: models[req.params.type],
        },
      ],
      group: [`${req.params.type}Id`],
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
    await models.bonafide.create({
      [idName]: req.params.id,
      addedById: res.locals.user.id,
      type: req.params.type,
    });
    return res.status(200).json({ message: "Bonafide created successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
