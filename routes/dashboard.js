const router = require("express").Router();
const { models } = require("./../config/db");
const checkStaff = require("./../middlewares/checkStaff");

router.get("/", checkStaff, async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const ug = await models.ug.count();
    const pg = await models.pg.count();
    const staff = await models.user.count({
      where: {
        role: "STAFF",
      },
    });
    const ugCurrentData = await models.stream.count({
      where: {
        type: "UG",
      },
      include: [
        {
          model: models.ug,
          where: {
            year,
          },
        },
      ],
      group: ["name"],
    });
    const ugAllData = await models.stream.count({
      where: {
        type: "UG",
      },
      include: ["ugs"],
      group: ["name"],
    });

    const pgCurrentData = await models.stream.count({
      where: {
        type: "PG",
      },
      include: [
        {
          model: models.pg,
          where: {
            year,
          },
        },
      ],
      group: ["name"],
    });
    const pgAllData = await models.stream.count({
      where: {
        type: "PG",
      },
      include: ["pgs"],
      group: ["name"],
    });
    const streams = [];
    ugAllData.map((stream) => {
      streams.push({
        name: stream.name,
        all: stream.count,
        current: ugCurrentData.find((s) => s.name === stream.name)?.count ?? 0,
      });
    });
    pgAllData.map((stream) => {
      streams.push({
        all: pgCurrentData.find((s) => s.name === stream.name)?.count ?? 0,
        current: stream.count,
      });
    });

    res.status(200).json({ data: { ug, pg, staff, streams } });
  } catch (error) {
    next(error);
  }
});

// const attributes = ["name", "id", "type"];

// const currentData = await models.stream.count({
//   // attributes,

//   include: [
//     {
//       model: models.ug,
//       required: false,
//       where: {
//         year,
//       },
//     },
//     {

//       model: models.pg,
//       required: false,
//       where: {
//         year,
//       },
//     },
//   ],
//   group: ["name"],
// });

// const oldData = await models.stream.count({
//   attributes,
//   include: [
//     {
//       model: models.ug,
//       required: false,
//     },
//     {
//       model: models.pg,
//       required: false,
//     },
//   ],
//   group: ["name"],
// });
// console.log(currentData);
// oldData.map((item) => {
//   // item.all = item.count;
//   item.current = currentData.find((i) => i.id === item.id)?.count ?? 0;
//   return item;
// });

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
