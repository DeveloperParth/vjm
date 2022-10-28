const { DataTypes, ENUM } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "ugPhotos",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM(
          "HSC",
          "LC",
          "SSC",
          "PHOTO",
          "AADHAR",
          "CASTE_CERTIFICATE",
          "THALASSEMIA"
        ),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "ugphotos",
    }
  );
};
