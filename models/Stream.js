const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "stream",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("UG", "PG"),
        allowNull: false,
      },
    },
    {
      paranoid: true,
      tableName: "streams",
    }
  );
};
