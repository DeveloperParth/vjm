const router = require("express").Router();
const BaseError = require("./../utils/BaseError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendPasswordMail } = require("./../utils/Mail");
const { models } = require("../config/db");
const GeneratePassword = require("./../utils/GeneratePassword");

const checkAdmin = require("./../middlewares/checkAdmin");
const checkStaff = require("./../middlewares/checkStaff");

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
router.post("/auth/student/login", async (req, res, next) => {
  try {
    const { email: sid, password } = req.body;
    let type = "ug";
    12;

    if (!(sid && password))
      throw new BaseError(400, "Student ID and password are required");

    let user = await models.ug.findOne({
      where: {
        sid,
        password,
      },
    });
    if (!user) {
      user = await models.pg.findOne({
        where: {
          sid,
          password,
        },
      });
      type = "pg";
    }
    if (!user) throw new BaseError(401, "Student ID or password is wrong");
    const { password: _, ...restUser } = user.dataValues;
    const token = jwt.sign(
      { id: user.id, type, role: "STUDENT" },
      process.env.JWT_SECRET
    );
    return res
      .status(200)
      .json({ user: { ...restUser, type, role: "STUDENT" }, token });
  } catch (error) {
    next(error);
  }
});
router.post("/user/create", checkAdmin, async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    if (!email || !name || !role)
      throw new BaseError(400, "Email, name and role is required");

    const password = GeneratePassword();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const isExists = await models.user.findOne({
      raw: true,
      where: {
        email,
      },
    });
    if (isExists) throw new BaseError(401, "User already exist");
    const insertResult = await models.user.create({
      name,
      email,
      role: role.toUpperCase(),
      password: hashedPassword,
    });
    if (!insertResult.id) throw new BaseError();
    const user = await models.user.findByPk(insertResult.id);
    const token = jwt.sign({ id: insertResult.id }, process.env.JWT_VERIFY, {
      expiresIn: "60m",
    });
    user.forgotToken = token;
    await user.save();
    const link = `${process.env.FRONTEND_URL}/forgot/${token}`;

    sendPasswordMail(email, password, link);

    return res.status(200).json({
      message: "The account has been created and an email has been sent",
    });
  } catch (error) {
    next(error);
  }
});
router.get("/user/staff", async (req, res, next) => {
  try {
    const staff = await models.user.findAll({
      where: {
        role: "staff",
      },
      attributes: ["id", "name", "email", "role"],
    });
    return res.status(200).json({ data: staff });
  } catch (error) {
    next(error);
  }
});
router.delete("/user/:id", checkAdmin, async (req, res, next) => {
  try {
    const user = await models.user.findByPk(req.params.id);
    if (!user) throw new BaseError(404);
    await models.user.destroy({
      where: { id: req.params.id },
    });
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
});
router.post("/auth/change-password", checkStaff, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await models.user.findByPk(res.locals.user.id);

    if (!user) throw new BaseError(404);
    const isSame = bcrypt.compareSync(oldPassword, user.password);
    if (!isSame) throw new BaseError(403, "Old password is incorrect");
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    return res.status(200).json({
      message: "Password has been changed successfully",
    });
  } catch (error) {
    next(error);
  }
});
router.post("/forgot", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await models.user.findOne({ where: { email } });
    if (!user) return res.status(404);
    const token = jwt.sign({ id: user.id }, process.env.JWT_VERIFY, {
      expiresIn: "60m",
    });
    user.forgotToken = token;
    await user.save();
    const link = `${process.env.FRONTEND_URL}/forgot/verify/${token}`;

    return res.status(200).json({
      message:
        "Please verify your account, An email has been sent to your mail",
    });
  } catch (error) {
    next(error);
  }
});
router.post("/forgot/:token", async (req, res, next) => {
  try {
    const { password } = req.body;
    const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY);

    const user = await models.user.findByPk(decoded.id);
    if (!user) throw new BaseError();
    if (user.forgotToken !== req.params.token) throw new BaseError();
    user.password = bcrypt.hashSync(password, 10);
    user.forgotToken = null;
    const updatedUser = await user.save();
    const {
      password: _,
      __v,
      updatedAt,
      createdAt,
      ...restUser
    } = updatedUser.dataValues;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    res
      .status(200)
      .json({ message: "Password updated", user: { ...restUser }, token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
