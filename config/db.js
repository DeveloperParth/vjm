const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   ssl: {
//     rejectUnauthorized: true,
//   },
// });

const sequelize = new Sequelize("vjm", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

const modelDefiners = [
  require("../models/Ug"),
  require("../models/UgPhotos"),
  require("../models/User"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}
function applyExtraSetup(sequelize) {
  const { ug, ugPhotos } = sequelize.models;
  ug.hasMany(ugPhotos);
  ugPhotos.belongsTo(ug);
}
applyExtraSetup(sequelize);
// sequelize.sync({ force: true });
module.exports = sequelize;

// old mysql connection code

// const mysql = require('mysql2/promise');
// const connection = mysql.createPool(process.env.DATABASE_URL);
// module.exports = connection;
