const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define("bonafide", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
  });
};
