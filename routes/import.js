const router = require("express").Router();
const { models } = require("../config/db");

router.post("/import/ug", async (req, res, next) => {
  try {
    const data = req.body.data;
    data.map((record) => {
      record.addedBy = res.locals.user.id;
      return record;
    });
    const response = await models.ug.bulkCreate(data);
    return res.status(200).json({ data: response });
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
