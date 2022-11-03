const { DataTypes, Sequelize } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "ug",
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
      surname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      sid: {
        type: DataTypes.STRING(20),
        allowNull: true,
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
        allowNull: false,
      },
      stream: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      father_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      mother_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      pincode: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      whatsapp_mobile: {
        type: DataTypes.STRING(13),
        allowNull: false,
      },
      father_mobile: {
        type: DataTypes.STRING(13),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE"),
        allowNull: false,
      },
      birth_place: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      physical_disability: {
        type: DataTypes.ENUM("YES", "NO"),
        allowNull: false,
      },
      disease: {
        type: DataTypes.ENUM("YES", "NO"),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("GEN", "SEBC", "EBC", "SC", "ST"),
        allowNull: false,
      },
      minority: {
        type: DataTypes.ENUM("YES", "NO"),
        allowNull: false,
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
        allowNull: false,
      },
      caste: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      aadhar_number: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      blood_group: {
        type: DataTypes.ENUM("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      hsc_stream: {
        type: DataTypes.ENUM("ARTS", "COMMERCE", "SCIENCE"),
        allowNull: false,
      },
      hsc_seat: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      hsc_passing_year: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      hsc_month: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      hsc_attempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hsc_total: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      hsc_obtained: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      hsc_percentage: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      hsc_percentile: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      hsc_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      hsc_board: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      hsc_center: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      hsc_school_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      hsc_school_number: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      paranoid: true,
      tableName: "ug_applications",
    }
  );
};
