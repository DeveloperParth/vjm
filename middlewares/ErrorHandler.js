const { sendErrorEmail } = require("../utils/Mail");

module.exports = (error, req, res, next) => {
  console.error(error);
  if (!error.status) {
    sendErrorEmail("parmarparth996@gmail.com", error);
  }
  return res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong" });
};
