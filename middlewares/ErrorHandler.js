const { sendErrorEmail } = require("../utils/Mail");
const BaseError = require("./../utils/BaseError");
const { models } = require("../config/db");
module.exports = async (error, req, res, next) => {
  console.log(error);
  if (!(error instanceof BaseError || error.isJoi)) {
    sendErrorEmail("parmarparth996@gmail.com", error);
    sendErrorEmail("rutvik.sanathara1109@gmail.com", error);
    await models.log.create({
      message:
        error.message.length > 255
          ? error.message.slice(0, 255)
          : error.message,
      stack: error.stack,
      path: req.path,
    });
    return res.status(error.status || 500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : error.message,
    });
  }

  return res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong" });
};
