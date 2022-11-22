const router = require("express").Router();
const { models } = require("../config/db");
const checkStaff = require("./../middlewares/checkStaff");

const BaseError = require("../utils/BaseError");

router.post("/import/ug", checkStaff, async (req, res, next) => {
  try {
    const data = req.body.data;
    const streams = await models.stream.findAll();
    data.map((record, i) => {
      record.addedById = res.locals.user.id;
      const streamNameToCheckAgainst = (
        record.medium
          ? `${record.stream.replaceAll(".", "")}_${record.medium}`
          : record.stream.replaceAll(".", "")
      ).toUpperCase();
      const stream = streams.find(
        (stream) => stream.name === streamNameToCheckAgainst
      );
      if (!stream)
        throw new BaseError(
          400,
          `Invalid Stream '${streamNameToCheckAgainst}', please create the stream first`
        );
      record.streamId = stream.id;
      record.physcal_disability = convertYandN(record.physcal_disability, {
        Y: "YES",
        N: "NO",
      });
      record.gender = convertYandN(record.gender, {
        M: "MALE",
        F: "FEMALE",
        m: "MALE",
        f: "FEMALE",
      });
      record.isVerified = record.isVerified ?? true;
      console.log(i);
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
      record.addedById = res.locals.user.id;
      return record;
    });
    const response = await models.pg.bulkCreate(data, {
      updateOnDuplicate: Object.keys(models.pg.rawAttributes),
    });
    return res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});
function convertYandN(value, valuesToMap) {
  Object.keys(valuesToMap).map((key) => {
    if (value === key) {
      value = valuesToMap[key];
    }
  });
  return value;
}
module.exports = router;
