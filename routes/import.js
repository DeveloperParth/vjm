const router = require("express").Router();
const { models } = require("../config/db");
const checkStaff = require("./../middlewares/checkStaff");

const BaseError = require("../utils/BaseError");

router.post("/import/ug", checkStaff, async (req, res, next) => {
  try {
    const data = req.body.data;
    const streams = await models.stream.findAll();
    data.map((record) => {
      record.addedBy = res.locals.user.id;
      const stream = streams.find(
        (stream) => stream.name === record.stream.toUpperCase()
      );
      if (!stream)
        throw new BaseError(
          400,
          `Invalid Stream '${record.stream}', please create the stream first`
        );
      record.streamId = stream.id;
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
