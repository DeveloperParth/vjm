const router = require("express").Router();
const { models } = require("../config/db");
router.get("/:stream", async (req, res, next) => {
  try {
    PG_STREAMS = ["MCOM_GUJ", "MCOM_ENG", "MSC_CHE", "MSC_IT"];
    UG_STREAMS = ["BBA", "BCA", "BSC", "BCOM_GUJ", "BCOM_ENG", "BSW"];
    let data = [];
    if (UG_STREAMS.includes(req.params.stream.toUpperCase())) {
      data = await models.ug.findAll({
        where: {
          stream: req.params.stream,
        },
        include: [
          {
            model: models.user,
            as: "addedBy",
            attributes: ["id", "name", "role"],
          },
        ],
      });
    } else if (PG_STREAMS.includes(req.params.stream)) {
      data = await models.pg.findAll({
        where: {
          stream: req.params.stream,
        },
        include: [
          {
            model: models.user,
            as: "addedBy",
            attributes: ["id", "name", "role"],
          },
        ],
      });
    } else {
      throw new BaseError("Invalid Stream", 400);
    }
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
