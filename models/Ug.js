const { array } = require("joi");
const { DataTypes, Sequelize } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "ug",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      surname: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      sid: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      enrollment: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      stream: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      year: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      father_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      mother_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      whatsapp_mobile: {
        type: DataTypes.STRING(13),
        allowNull: true,
      },
      father_mobile: {
        type: DataTypes.STRING(13),
        allowNull: true,
      },
      dob: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      birth_place: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      physical_disability: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      disease: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      minority: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      religion: {
        type: DataTypes.ENUM(
          "HINDU",
          "MUSLIM",
          "CHRISTIAN",
          "JAIN",
          "ADHERES",
          "SIKH",
          "BUDDHA"
        ),
        allowNull: true,
      },
      caste: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      aadhar_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      blood_group: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hsc_stream: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      hsc_seat: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      hsc_passing_year: {
        type: DataTypes.STRING(4),
        allowNull: true,
      },
      hsc_month: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      hsc_attempt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hsc_total: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      hsc_obtained: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      hsc_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      hsc_percentile: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      hsc_grade: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      hsc_board: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hsc_center: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hsc_school_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hsc_school_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      paranoid: true,
      tableName: "ug_applications",
    }
  );
};
