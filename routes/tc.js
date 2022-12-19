const router = require("express").Router();

const { models } = require("../config/db");
const checkStaff = require("./../middlewares/checkStaff");

const { tcSchema } = require("../utils/Validation");

router.post("/:type/:id", checkStaff, async (req, res, next) => {
  try {
    await tcSchema.validateAsync(req.body);
    const idName = req.params.type === "ug" ? "ugId" : "pgId";

    
    const id = await GetAvailableId();

    const tc = await models.tc.create({
      id,
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

const GetAvailableId = async (id = 1) => {
  const isExists = await models.tc.findByPk(id);
  if (isExists) {
    return GetAvailableId(id + 1);
  }
  return id;
};

module.exports = router;
