const router = require("express").Router();
const { models } = require("../config/db");
const BaseError = require("../utils/BaseError");

const checkAdmin = require("../middlewares/checkAdmin");

router.get("/all", async (req, res, next) => {
  try {
    const data = await models.stream.findAll();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
// router.get("/:stream", async (req, res, next) => {
//   try {
//     PG_STREAMS = ["MCOM_GUJ", "MCOM_ENG", "MSC_CHE", "MSC_IT"];
//     UG_STREAMS = ["BBA", "BCA", "BSC", "BCOM_GUJ", "BCOM_ENG", "BSW"];
//     let data = [];
//     if (UG_STREAMS.includes(req.params.stream.toUpperCase())) {
//       data = await models.ug.findAll({
//         where: {
//           stream: req.params.stream,
//         },
//         include: [
//           {
//             model: models.user,
//             as: "addedBy",
//             attributes: ["id", "name", "role"],
//           },
//         ],
//       });
//     } else if (PG_STREAMS.includes(req.params.stream)) {
//       data = await models.pg.findAll({
//         where: {
//           stream: req.params.stream,
//         },
//         include: [
//           {
//             model: models.user,
//             as: "addedBy",
//             attributes: ["id", "name", "role"],
//           },
//         ],
//       });
//     } else {
//       throw new BaseError("Invalid Stream", 400);
//     }
//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// });
router.get("/:id", async (req, res, next) => {
  try {
    const data = await models.stream.findByPk(req.params.id);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
router.post("/", checkAdmin, async (req, res, next) => {
  try {
    const { name, type } = req.body;
    await models.stream.create({ name: name.toUpperCase(), type });

    res.status(200).json({ message: "Stream Added" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", checkAdmin, async (req, res, next) => {
  try {
    const { name, type } = req.body;
    await models.stream.update(
      { name: name.toUpperCase(), type },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: "Stream Updated" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
