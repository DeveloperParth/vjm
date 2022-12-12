const { DataTypes } = require("sequelize");
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      enrollment: {
        type: DataTypes.STRING,
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
      year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      father_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mother_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      whatsapp_mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      father_mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birth_place: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      physical_disability: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      disease: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      minority: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true,
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      hsc_seat: {
        type: DataTypes.STRING(25),
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
