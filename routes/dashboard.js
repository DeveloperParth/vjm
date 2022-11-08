const router = require("express").Router();
const { Op } = require("sequelize");
const { models } = require("./../config/db");
const checkStaff = require("./../middlewares/checkStaff");

router.get("/", async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const ugCurrentData = await models.ug.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lte]: new Date(year, 11, 31),
        },
      },
      group: ["stream"],
    });
    const pgCurrentData = await models.pg.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lte]: new Date(year, 11, 31),
        },
      },
      group: ["stream"],
    });
    const ugData = await models.ug.count({ group: ["stream"] });
    const pgData = await models.pg.count({ group: ["stream"] });
    const staff = await models.user.count({ where: { role: "STAFF" } });
    const ug = { count: 0 };
    const pg = { count: 0 };

    ugData.map((d) => {
      ug[d.stream.toLowerCase()] ??= {};
      ug[d.stream.toLowerCase()].all = d.count;
      ug.count += d.count;
    });
    ugCurrentData.map((d) => {
      ug[d.stream.toLowerCase()].current = d.count;
    });

    pgData.map((d) => {
      ug[d.stream.toLowerCase()] ??= {};
      pg[d.stream.toLowerCase()] = d.count;
      pg.count += d.count;
    });
    pgCurrentData.map((d) => {
      pg[d.stream.toLowerCase()].current = d.count;
    });
    return res.status(200).json({ data: { ug, pg, staff } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
