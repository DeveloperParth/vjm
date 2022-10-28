const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define("pgPhotos", {
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
        "THALASSEMIA"
      ),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
