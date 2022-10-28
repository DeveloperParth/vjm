const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
});
const modelDefiners = [
  require("../models/Ug"),
  require("../models/Pg"),
  require("../models/UgPhotos"),
  require("../models/PgPhotos"),
  require("../models/User"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}
function applyExtraSetup(sequelize) {
  const { ug, ugPhotos, pg, pgPhotos, user } = sequelize.models;
  ug.hasMany(ugPhotos);
  ugPhotos.belongsTo(ug);

  pg.hasMany(pgPhotos);
  pgPhotos.belongsTo(pg);

  ug.hasOne(user, { as: "AddedBy", foreignKey: "addedBy" });
  user.hasMany(ug, { as: "AddedBy", foreignKey: "addedBy" });
}
applyExtraSetup(sequelize);
// refreshDb();
module.exports = sequelize;

async function refreshDb() {
  const bcrypt = require("bcrypt");
  await sequelize.sync({ force: true });
  const hashedPassword = bcrypt.hashSync("12345678", 10);
  await sequelize.models.user.create({
    email: "admin@gmail.com",
    password: hashedPassword,
    name: "Admin",
    role: "ADMIN",
  });
  await sequelize.models.user.create({
    email: "staff@gmail.com",
    password: hashedPassword,
    name: "Staff",
    role: "STAFF",
  });
  await sequelize.models.user.create({
    email: "student@gmail.com",
    password: hashedPassword,
    name: "Student",
    role: "STUDENT",
  });
}

// old mysql connection code

// const mysql = require('mysql2/promise');
// const connection = mysql.createPool(process.env.DATABASE_URL);
// module.exports = connection;
