const router = require("express").Router();

const { sendDataVerificationMail } = require("../utils/Mail");
const { models } = require("./../config/db");

router.get("/", async (req, res, next) => {
  const bcrypt = require("bcrypt");
  const hashedPassword = bcrypt.hashSync("12345678", 10);
  await models.user.create({
    email: "admin@gmail.com",
    password: hashedPassword,
    name: "Admin",
    role: "ADMIN",
  });
  await models.user.create({
    email: "staff@gmail.com",
    password: hashedPassword,
    name: "Staff",
    role: "STAFF",
  });
  return res.status(200).send("ok");
});
router.get("/mail", async (req, res, next) => {
  const data = {
    name: "Rutwik",
    surname: "Santhra",
    semester: "1",
    stream: "BCA",
    year: "2023",
    father_name: "Fname",
    mother_name: "Mname",
    address: "Chhaya porabandar",
    district: "Porbandar",
    city: "Porbandar",
    pincode: "360575",
    state: "Gujarat",
    whatsapp_mobile: "9999900000",
    father_mobile: "",
    dob: "2003-07-13",
    gender: "FEMALE",
    birth_place: "Porbandar",
    disease: "NO",
    physical_disability: "NO",
    category: "GEN",
    minority: "NO",
    religion: "HINDU",
    caste: "Meher",
    aadhar_number: "542656788934",
    blood_group: "A+",
    email: "parmarparth996@gmail.com",
    hsc_stream: "ARTS",
    hsc_seat: "3456789",
    hsc_passing_year: "2019",
    hsc_month: "merch",
    hsc_attempt: "1",
    hsc_total: "600",
    hsc_obtained: "450",
    hsc_percentage: "70",
    hsc_percentile: "80",
    hsc_grade: "B+",
    hsc_board: "Gujarat Board",
    hsc_center: "Navyug",
    hsc_school_name: "Swaminarayan",
    hsc_school_number: "13213123",
    updatedAt: "2022-11-07T04:10:54.092Z",
    createdAt: "2022-11-07T04:10:54.092Z",
  };
  sendDataVerificationMail("vjmgcs@gmail.com", data, "http://localhost:3000");
  res.send("ok");
});
module.exports = router;
