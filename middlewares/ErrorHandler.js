const { sendErrorEmail } = require("../utils/Mail");
const BaseError = require("./../utils/BaseError");
const { models } = require("../config/db");
module.exports = async (error, req, res, next) => {
  if (error instanceof Error) {
    sendErrorEmail("parmarparth996@gmail.com", error);
    await models.log.create({
      message: error.message,
      stack: error.stack,
      path: req.path,
    });
    return res
      .status(error.status || 500)
      .json({ message: process.env.NODE_ENV === "production" ? "Something went wrong" : error.message });
  }

  return res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong" });
};
