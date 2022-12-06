const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define("pgPhotos", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM("ERROR_MAIL", "BACKUP_MAIL"),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
