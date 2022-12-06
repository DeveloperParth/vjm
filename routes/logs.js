const router = require("express").Router();
const { models } = require("./../config/db");

router.get("/", async (req, res, next) => {
    try {
        const logs = await models.log.findAll();
        return res.status(200).json(logs);
    } catch (error) {
        next(error);
    }
});

module.exports = router;