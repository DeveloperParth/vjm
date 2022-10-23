const jwt = require("jsonwebtoken");
const BaseError = require("./../utils/BaseError");

const ALLOWED_ROLES = ["STAFF", "ADMIN"];
module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log(token);
    if (!token) throw new BaseError(401, "Token not provided");
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && ALLOWED_ROLES.includes(decoded.role)) {
      res.locals.user = decoded;
      next();
    } else {
      throw new BaseError(401, "Invalid");
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      next(new BaseError(401, "Session expired"));
    next(error);
  }
};
