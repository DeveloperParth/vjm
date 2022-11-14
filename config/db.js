const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions:
  {
    ssl: {
      rejectUnauthorized: true,
    },
  }

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
  ug.hasMany(ugPhotos, { constraints: false });
  ugPhotos.belongsTo(ug, { constraints: false });

  pg.hasMany(pgPhotos, { constraints: false });
  pgPhotos.belongsTo(pg, { constraints: false });

  ug.belongsTo(user, {
    as: "addedBy",
    foreignKey: "addedById",
    constraints: false,
  });
  user.hasMany(ug, {
    as: "addedBy",
    foreignKey: "addedById",
    constraints: false,
  });

  pg.belongsTo(user, {
    as: "addedBy",
    foreignKey: "addedById",
    constraints: false,
  });
  user.hasMany(pg, {
    // as: "addedBy",
    foreignKey: "addedById",
    constraints: false,
  });
}
applyExtraSetup(sequelize);
refreshDb();
module.exports = sequelize;

async function refreshDb() {
  await sequelize.sync({ force: true });
  const bcrypt = require("bcrypt");
  const hashedPassword = bcrypt.hashSync("12345678", 10);
  await sequelize.models.user.create({
    id: "0a9ba6ed-adc2-4599-ab95-592d92ca21bc",
    email: "admin@gmail.com",
    password: hashedPassword,
    name: "Admin",
    role: "ADMIN",
  });
  await sequelize.models.user.create({
    id: "37812f2d-f38b-4d34-8a60-f7a02df9a35e",
    email: "staff@gmail.com",
    password: hashedPassword,
    name: "Staff",
    role: "STAFF",
  });
}
