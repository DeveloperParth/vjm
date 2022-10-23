module.exports = (error, req, res, next) => {
  console.error(error);
  return res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong" });
};
