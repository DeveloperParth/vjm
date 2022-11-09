const jo = require("joi");

const joi = jo.extend(require("@joi/date"));

// genereate joi schema for ug sequelize model
const ugSchema = joi.object({
  id: joi.number().integer().min(1),
  name: joi.string().min(3).max(255).required(),
  surname: joi.string().min(3).max(255).required(),
  stream: joi.string().required(),
  email: joi.string().email().required(),
  gender: joi.string().required(),
  dob: joi.date().format("DD/MM/YYYY").utc().required(),
  birth_place: joi.string().required(),
  address: joi.string().min(3).max(255).required(),
  city: joi.string().min(3).max(255).required(),
  district: joi.string().min(3).max(255).required(),
  state: joi.string().min(3).max(255).required(),
  pincode: joi.string().min(6).max(6).required(),
  taluka: joi.string().min(3).max(255).required(),

  // parents
  father_name: joi.string().min(3).max(255).required(),
  mother_name: joi.string().min(3).max(255).required(),
  father_mobile: joi.string().allow("").optional(),

  // education
  hsc_stream: joi
    .string()
    .valid("Science", "Commerce", "Arts")
    .insensitive()
    .required(),
  hsc_seat: joi.string().required(),
  hsc_passing_year: joi.number().integer().min(2000).max(2021).required(),
  hsc_month: joi.string().required(),
  hsc_attempt: joi.number().integer().min(1).max(3).required(),
  hsc_total: joi.number().integer().min(1).max(1000).required(),
  hsc_obtained: joi.number().integer().min(1).max(1000).required(),
  hsc_percentage: joi.number().integer().min(1).max(100).required(),
  hsc_percentile: joi.number().integer().min(1).max(100).required(),
  hsc_grade: joi.string().min(1).max(255).required(),
  hsc_board: joi.string().min(3).max(255).required(),
  hsc_center: joi.string().min(3).max(255).required(),
  hsc_school_name: joi.string().min(3).max(255).required(),
  hsc_school_number: joi.string().min(3).max(255).required(),
  // other
  whatsapp_mobile: joi.string().min(10).max(10).required(),
  semester: joi.number().integer().min(1).max(8).required(),
  year: joi.string().required(),

  // optional
  disease: joi.string().valid("YES", "NO").insensitive().required(),
  physical_disability: joi.string().valid("YES", "NO").insensitive().required(),
  category: joi.string().min(3).max(255).required(),
  minority: joi.string().valid("YES", "NO").insensitive().required(),
  religion: joi.string().min(3).max(255).required(),
  caste: joi.string().min(3).max(255).required(),
  aadhar_number: joi.string().min(3).max(255).required(),
  blood_group: joi.string().allow("").optional(),
});

module.exports = { ugSchema };