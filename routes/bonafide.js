const router = require("express").Router();

const { models } = require("./../config/db");

const checkStaff = require("./../middlewares/checkStaff");

const BaseError = require("./../utils/BaseError");

router.get("/:type/:id", async (req, res, next) => {
  try {
    const data = await models.bonafide.findAll({
      where: {
        [req.params.type + "Id"]: req.params.id,
      },

      include: [
        {
          model: models.user,
          as: "addedBy",
          attributes: ["id", "name", "role"],
        },
        // {
        //   model: models[req.params.type],
        // },
      ],
    });
    if (!data) throw new BaseError(404, "Not found");
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post("/:id", checkStaff, async (req, res, next) => {
  try {
    await models.bonafide.create({
      ugId: req.params.id,
      addedById: res.locals.user.id,
    });
    return res.status(200).json({ message: "Bonafide created successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
