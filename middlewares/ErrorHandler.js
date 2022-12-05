const { sendErrorEmail } = require("../utils/Mail");
const BaseError = require("./../utils/BaseError");
module.exports = (error, req, res, next) => {
  console.error(error);
  if (!error instanceof BaseError) {
    sendErrorEmail("parmarparth996@gmail.com", error);
  }
  return res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong" });
};
