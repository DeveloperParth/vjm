const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "pg",
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
      semester: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      enrollment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING(6),
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
      home_mobile: {
        type: DataTypes.STRING(13),
        allowNull: true,
      },
      dob: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE"),
        allowNull: true,
      },
      birth_place: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      physical_disability: {
        type: DataTypes.ENUM("YES", "NO"),
        allowNull: true,
      },
      disease: {
        type: DataTypes.ENUM("YES", "NO"),
        allowNull: true,
      },
      category: {
        type: DataTypes.ENUM("GEN", "SEBC", "EBC", "SC", "ST"),
        allowNull: true,
      },
      minority: {
        type: DataTypes.ENUM("YES", "NO"),
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
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      aadhar_number: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      blood_group: {
        type: DataTypes.ENUM("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hsc_stream: {
        type: DataTypes.ENUM("ARTS", "COMMERCE", "SCIENCE"),
        allowNull: true,
      },
      hsc_seat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_passing_year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_month: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_attempt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hsc_total: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_obtained: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_percentage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_percentile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_grade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_board: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_center: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_school_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_school_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      ug_degree: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_stream: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_seat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_passing_year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_month: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_attempt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_total: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_obtained: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_percentage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_college_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ug_university: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      pg_degree: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_stream: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_seat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_passing_year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_month: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_attempt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_total: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_obtained: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_percentage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_college_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pg_university: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      tableName: "pg_applications",
    }
  );
};
