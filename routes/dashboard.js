const router = require("express").Router();
const { models } = require("./../config/db");

router.get("/", async (req, res, next) => {
  try {
    const ug = await models.ug.count();
    const pg = await models.ug.count();
    const staff = await models.user.count({ where: { role: "STAFF" } });
    return res.status(200).json({ ug, pg, staff });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
