const router = require("express").Router();
const BaseError = require("./../utils/BaseError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendPasswordMail } = require("./../utils/Mail");
const { models } = require("../config/db");
const GeneratePassword = require("./../utils/GeneratePassword");

router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BaseError(400, "Email and password are required");
    const user = await models.user.findOne({
      raw: true,
      where: {
        email,
      },
    });
    if (!user) throw new BaseError(401, "Email or password is wrong");
    const isSame = bcrypt.compareSync(password, user.password);
    if (!isSame) throw new BaseError(401, "Email or password is wrong");
    const { password: _, ...restUser } = user;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ user: { ...restUser }, token });
  } catch (error) {
    next(error);
  }
});
router.post("/createuser", async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    if (!email || !name || !role)
      throw new BaseError(400, "Email, name and role is required");
    const hashedPassword = bcrypt.hashSync(GeneratePassword(), 10);
    const user = await models.user.findOne({
      raw: true,
      where: {
        email,
      },
    });
    if (user) return res.status(401).json({ message: "Email already exists" });
    const insertResult = await models.user.create({
      name,
      email,
      role,
      password: hashedPassword,
    });
    if (!insertResult.id) throw new BaseError();
    sendPasswordMail(email, password);
    return res.status(200).json({ message: "User created" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
