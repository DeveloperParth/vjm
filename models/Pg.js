const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "pg",
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
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // tream: {
      //   type: DataTypes.STRING(20),
      //   allowNull: false,
      // },s
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
      home_mobile: {
        type: DataTypes.STRING(13),
        allowNull: true,
      },
      dob: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_passing_year: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_month: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_attempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hsc_total: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_obtained: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_percentage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_percentile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_grade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_board: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_center: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_school_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hsc_school_number: {
        type: DataTypes.STRING,
        allowNull: false,
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
