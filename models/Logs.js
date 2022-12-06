const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
    return sequelize.define("log", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        stack: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
};
