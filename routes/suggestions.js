const router = require("express").Router();
const { models } = require("../config/db");
const checkStaff = require("../middlewares/checkStaff");

router.get("/", checkStaff, async (req, res, next) => {
  try {
    const data = await models.ug.findAll({
      attributes: [
        "father_name",
        "mother_name",
        "district",
        "city",
        "surname",
        "caste",
        "hsc_center",
        "hsc_school_name",
        "hsc_school_number",
      ],
    });
    // make arrays of each attribute
    const response = {
      father_name: new Set(),
      mother_name: new Set(),
      district: new Set(),
      city: new Set(),
      surname: new Set(),
      caste: new Set(),
      hsc_center: new Set(),
      hsc_school_name: new Set(),
      hsc_school_number: new Set(),
    };
    data.map((item) => {
      response.father_name.add(capitalize(item.father_name));
      response.mother_name.add(capitalize(item.mother_name));
      response.district.add(capitalize(item.district));
      response.city.add(capitalize(item.city));
      response.surname.add(capitalize(item.surname));
      response.caste.add(capitalize(item.caste));
      response.hsc_center.add(capitalize(item.hsc_center));
      response.hsc_school_name.add(capitalize(item.hsc_school_name));
      response.hsc_school_number.add(capitalize(item.hsc_school_number));
    });
    response.father_name = [...response.father_name];
    response.mother_name = [...response.mother_name];
    response.district = [...response.district];
    response.city = [...response.city];
    response.surname = [...response.surname];
    response.caste = [...response.caste];
    response.hsc_center = [...response.hsc_center];
    response.hsc_school_name = [...response.hsc_school_name];
    response.hsc_school_number = [...response.hsc_school_number];

    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

module.exports = router;
