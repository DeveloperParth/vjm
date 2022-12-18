const router = require("express").Router();

const { models } = require("../config/db");
const checkStaff = require("./../middlewares/checkStaff");

const BaseError = require("../utils/BaseError");
const { tcSchema } = require("../utils/Validation");

router.post("/:type/:id", checkStaff, async (req, res, next) => {
  try {
    await tcSchema.validateAsync(req.body);
    const idName = req.params.type === "ug" ? "ugId" : "pgId";
    const tc = await models.tc.create({
      [idName]: req.params.id,
      seatNo: req.body.seatNo,
      examDate: req.body.examDate,
      addedById: res.locals.user.id,
      universityName: req.body.universityName,
      specialNote: req.body.specialNote,
    });
    await models[req.params.type].destroy({
      where: {
        id: req.params.id,
      },
    });
    return res
      .status(200)
      .json({ data: tc, message: "TC created successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
