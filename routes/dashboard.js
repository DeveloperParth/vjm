const router = require("express").Router();
const { models } = require("./../config/db");
const checkStaff = require("./../middlewares/checkStaff");

router.get("/", async (req, res, next) => {
  try {
    const ugData = await models.ug.count({ group: ["stream"] });
    console.log(ugData);
    const pgData = await models.pg.count({ group: ["stream"] });
    const staff = await models.user.count({ where: { role: "STAFF" } });
    const ug = { count: 0 };
    ugData.map((d) => {
      ug[d.stream.toLowerCase()] = d.count;
      ug.count += d.count;
    });
    const pg = { count: 0 };
    pgData.map((d) => {
      pg[d.stream.toLowerCase()] = d.count;
      pg.count += d.count;
    });
    return res.status(200).json({ data: { ug, pg, staff } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
