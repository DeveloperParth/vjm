const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define("tc", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    seatNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    examDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    universityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
