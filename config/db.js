const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions:
  // process.env.NODE_ENV === "production"?
  {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
  ,
});
const modelDefiners = [
  require("../models/Ug"),
  require("../models/Pg"),
  require("../models/UgPhotos"),
  require("../models/PgPhotos"),
  require("../models/User"),
  require("../models/Stream"),
  require("../models/Bonafide"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}
function applyExtraSetup(sequelize) {
  const { ug, ugPhotos, pg, pgPhotos, user, stream, bonafide } =
    sequelize.models;

  //define relationship: ug has a stream and stream has many ugs
  ug.belongsTo(stream, { constraints: false });
  stream.hasMany(ug, { constraints: false });

  pg.belongsTo(stream, { constraints: false });
  stream.hasMany(pg, { constraints: false });

  //define relationship: ug has many photos and photo belongs to ug

  ug.hasMany(ugPhotos, { constraints: false });
  ugPhotos.belongsTo(ug, { constraints: false });

  pg.hasMany(pgPhotos, { constraints: false });
  pgPhotos.belongsTo(pg, { constraints: false });

  //define relationship: user has many ugs and ug belongs to user

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

  // bona fide relationship with ug
  bonafide.belongsTo(ug, {
    constraints: false,
  });
  // ug.hasMany(bonafide, {
  //   constraints: false,
  // });

  // bona fide relationship with pg
  bonafide.belongsTo(pg, {
    constraints: false,
  });
  // pg.hasMany(bonafide, {
  //   constraints: false,
  // });

  // bona fide relationship with user
  bonafide.belongsTo(user, {
    as: "addedBy",
    foreignKey: "addedById",
    constraints: false,
  });
}
applyExtraSetup(sequelize);
// refreshDb();
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
  await sequelize.models.stream.create({
    name: "BCA",
    type: "UG",
  });
  await sequelize.models.stream.create({
    name: "BBA",
    type: "UG",
  });
}
