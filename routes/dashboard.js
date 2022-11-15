const router = require("express").Router();
const { Op } = require("sequelize");
const { models } = require("./../config/db");
const sequelize = require("./../config/db");
const checkStaff = require("./../middlewares/checkStaff");

router.get("/", async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const ug = await models.ug.count();
    const pg = await models.pg.count();
    const staff = await models.user.count({
      where: {
        role: "STAFF",
      },
    });
    const attributes = ["name", "id", "type"];
    const currentData = await models.stream.count({
      attributes,
      include: [
        {
          model: models["stream.type"],
          where: {
            year: 2021,
          },
        },
      ],
      group: ["stream.name"],
    });

    const oldData = await models.stream.count({
      attributes,
      include: [
        {
          model: models.ug,
          required: false,
        },
        {
          model: models.pg,
          required: false,
        },
      ],
      group: ["stream.name"],
    });
    console.log(currentData);
    oldData.map((item) => {
      // item.all = item.count;
      item.current = currentData.find((i) => i.id === item.id)?.count ?? 0;
      return item;
    });
    res.status(200).json({ data: { ug, pg, staff, streams: currentData } });

    // return res.status(200).json({ data: { ug, pg, staff } });
  } catch (error) {
    next(error);
  }
});

// const options = {
//   include: [
//     {
//       model: models.stream,
//       attributes: ["name"],
//     },
//   ],
//   group: ["stream.name"],
// };
// const ugCurrentData = await models.ug.count({
//   where: {
//     year,
//   },
//   ...options,
// });
// const pgCurrentData = await models.pg.count({
//   where: {
//     year,
//   },
//   ...options,
// });
// const ugData = await models.ug.count(options);
// const pgData = await models.pg.count(options);
// const staff = await models.user.count({ where: { role: "STAFF" } });
// const ug = { count: 0 };
// const pg = { count: 0 };

// ugData.map((d) => {
//   ug[d.stream.toLowerCase()] ??= {};
//   ug[d.stream.toLowerCase()].all = d.count;
//   ug.count += d.count;
// });
// ugCurrentData.map((d) => {
//   ug[d.stream.toLowerCase()].current = d.count;
// });

// pgData.map((d) => {
//   ug[d.stream.toLowerCase()] ??= {};
//   pg[d.stream.toLowerCase()] = d.count;
//   pg.count += d.count;
// });
// pgCurrentData.map((d) => {
//   pg[d.stream.toLowerCase()].current = d.count;
// });

module.exports = router;
