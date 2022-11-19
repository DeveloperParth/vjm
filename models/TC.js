const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("tc", {
  id: {
    type: DataTypes.UUID,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});
