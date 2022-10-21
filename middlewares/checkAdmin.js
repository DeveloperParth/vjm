const jwt = require('jsonwebtoken');
const BaseError = require('./../utils/BaseError')


module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) throw new BaseError(401, "Unauthenticated")
        if (token.startsWith('Bearer')) {
            token = token.split(" ")[1];
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.role === "ADMIN") {
            res.locals.user = decoded;
            next();
        } else {
            throw BaseError(401, "Unauthenticated")
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) next(new BaseError(401, "Session expired"))
        next(error)
    }
}