const router = require("express").Router();

const { models } = require("./../config/db");

router.get("/", async (req, res, next) => {
  const bcrypt = require("bcrypt");
  const hashedPassword = bcrypt.hashSync("12345678", 10);
  await models.user.create({
    email: "admin@gmail.com",
    password: hashedPassword,
    name: "Admin",
    role: "ADMIN",
  });
  await models.user.create({
    email: "staff@gmail.com",
    password: hashedPassword,
    name: "Staff",
    role: "STAFF",
  });
  return res.status(200).send("ok");
});

module.exports = router;
