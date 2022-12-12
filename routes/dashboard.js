const router = require("express").Router();
const { models } = require("./../config/db");
const checkStaff = require("./../middlewares/checkStaff");

router.get("/", checkStaff, async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const ug = await models.ug.count();
    const pg = await models.pg.count();
    const staff = await models.user.count();
    const streams = [];
    const response = await models.stream.findAll();
    await Promise.all(
      response.map(async (stream) => {
        console.log(stream.name);
        const currentCount = await models[stream.type.toLowerCase()].count({
          where: {
            streamId: stream.id,
            year,
          },
        });
        const previousCount = await models[stream.type.toLowerCase()].count({
          where: {
            streamId: stream.id,
          },
        });
        streams.push({
          ...stream.dataValues,
          current: currentCount,
          all: previousCount,
        });
      })
    );

    res.status(200).json({ data: { ug, pg, staff, streams } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
