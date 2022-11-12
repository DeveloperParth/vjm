const router = require("express").Router();
const { models } = require("../config/db");
const checkStaff = require("./../middlewares/checkStaff");

router.post("/import/ug", checkStaff, async (req, res, next) => {
  try {
    const data = req.body.data;
    console.log(req.body.data[0].dob);
    data.map((record) => {
      record.addedBy = res.locals.user.id;
      record.dob = record.dob.split("T")[0].split("-").reverse().join("-");
      return record;
    });
    const response = await models.ug.bulkCreate(data, {
      updateOnDuplicate: Object.keys(models.ug.rawAttributes),
    });
    return res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});
router.post("/import/ug/:stream", checkStaff, async (req, res, next) => {
  try {
    const data = req.body.data;
    data.map((record) => {
      record.addedBy = res.locals.user.id;
      return record;
    });
    const response = await models.ug.bulkCreate(data, {
      updateOnDuplicate: Object.keys(models.ug.rawAttributes),
    });
    return res
      .status(200)
      .json({ data: response, message: "Improted successfully" });
  } catch (error) {
    next(error);
  }
});
router.post("/import/pg", async (req, res, next) => {
  try {
    const data = req.body.data;
    data.map((record) => {
      record.addedBy = res.locals.user.id;
      return record;
    });
    const response = await models.pg.bulkCreate(data);
    return res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
