const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define("ugPhotos", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
        "THALASSEMIA",
        "PH_CERTIFICATE",
        "YEAR_CERTIFICATE"
      ),
      allowNull: false,
    },
    isLatest: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
