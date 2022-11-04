const router = require("express").Router();
const { models } = require("../config/db");

router.get("/", async (req, res, next) => {
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
      father_name: [],
      mother_name: [],
      district: [],
      city: [],
      surname: [],
      caste: [],
      hsc_center: [],
      hsc_school_name: [],
      hsc_school_number: [],
    };
    data.map((item) => {
      response.father_name.push(item.father_name);
      response.mother_name.push(item.mother_name);
      response.district.push(item.district);
      response.city.push(item.city);
      response.surname.push(item.surname);
      response.caste.push(item.caste);
      response.hsc_center.push(item.hsc_center);
      response.hsc_school_name.push(item.hsc_school_name);
      response.hsc_school_number.push(item.hsc_school_number);
    });

    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
