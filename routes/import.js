const router = require("express").Router();
const { models } = require("../config/db");
const checkStaff = require("./../middlewares/checkStaff");

const BaseError = require("../utils/BaseError");

router.post("/import/:type", checkStaff, async (req, res, next) => {
  try {
    const data = req.body.data;
    const streams = await models.stream.findAll();
    const ugData = [];
    const pgData = [];
    await Promise.all(await data.map(async (record, i) => {
      record.addedById = res.locals.user.id;
      const streamNameToCheckAgainst = (
        record.medium
          ? `${record.stream.replaceAll(".", "")}_${record.medium}`
          : record.stream.replaceAll(".", "")
      ).toUpperCase().trim();
      const stream = streams.find((stream) => stream.name === streamNameToCheckAgainst);
      if (!stream)
        throw new BaseError(
          400,
          `Invalid Stream '${streamNameToCheckAgainst}', please create the stream first`
        );

      record.physcal_disability = convertYandN(record.physcal_disability, {
        Y: "YES",
        N: "NO",
      });
      record.gender = convertYandN(record.gender, {
        M: "MALE",
        F: "FEMALE",
        m: "MALE",
        f: "FEMALE",
      });
      record.whatsapp_mobile = formatNumber(record.whatsapp_mobile);

      record.father_mobile = formatNumber(record.father_mobile);
      record.dob = record.dob?.replaceAll("/", "-");
      record.address = record.address?.replaceAll('"', "");
      record.state ||= "Gujarat";
      record.semester ||= 1;
      record.physical_disability ||= "NO";
      record.minority ||= "NO";
      record.religion ||= "Hindu";
      record.city ||= "Porbandar";
      record.district ||= "Porbandar";
      record.streamId = stream.id;
      record.aadhar_number = record.aadhar_number || null;
      record.isVerified =
        record.isVerified?.toLowerCase()?.replaceAll('"', "") || true;

      if (stream.type === "UG") {
        ugData.push(record);
      }
      else if (stream.type === "PG") {
        pgData.push(record);
      }
      else throw new BaseError(400, "Invalid Stream Type");

      return record;
    }))
    if (ugData.length) {
      const response = await models.ug.bulkCreate(ugData, {
        updateOnDuplicate: Object.keys(models.ug.rawAttributes),
      });
    }
    if (pgData.length) {
      const response = await models.pg.bulkCreate(pgData, {
        updateOnDuplicate: Object.keys(models.pg.rawAttributes),

      });
    }
    const message = "Imported successfully";
    return res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
});
router.post("/import/ug/:stream", checkStaff, async (req, res, next) => {
  try {
    const data = req.body.data;
    data.map((record) => {
      record.addedBy = res.locals.user.id;
      return record;
    });
    const response = await models.ug.bulkCreate(data, {
      updateOnDuplicate: Object.keys(models.ug.rawAttributes),
    });
    return res
      .status(200)
      .json({ data: response, message: "Improted successfully" });
  } catch (error) {
    next(error);
  }
});
// router.post("/import/pg", checkStaff, async (req, res, next) => {
//   try {
//     const data = req.body.data;
//     const streams = await models.stream.findAll();
//     let ugRecordsSkipped = false;
//     data.map((record, i) => {
//       record.addedById = res.locals.user.id;
//       const streamNameToCheckAgainst = (
//         record.medium
//           ? `${ record.stream.replaceAll(".", "") }_${ record.medium }`
//           : record.stream.replaceAll(".", "")
//       )
//         .toUpperCase()
//         .trim();
//       const stream = streams.find(
//         (stream) => stream.name === streamNameToCheckAgainst
//       );
//       if (!stream)
//         throw new BaseError(
//           400,
//           `Invalid Stream '${streamNameToCheckAgainst}', please create the stream first`
//         );
//       if (stream.type.toUpperCase() != "PG") {
//         ugRecordsSkipped = true;
//         return null;
//       }
//       console.log(stream.type);

//       record.physcal_disability = convertYandN(record.physcal_disability, {
//         Y: "YES",
//         N: "NO",
//       });
//       record.gender = convertYandN(record.gender, {
//         M: "MALE",
//         F: "FEMALE",
//         m: "MALE",
//         f: "FEMALE",
//       });
//       record.whatsapp_mobile = formatNumber(record.whatsapp_mobile);

//       record.father_mobile = formatNumber(record.father_mobile);

//       record.state ||= "Gujarat";
//       record.semester ||= 1;
//       record.physical_disability ||= "NO";
//       record.minority ||= "NO";
//       record.religion ||= "Hindu";
//       record.city ||= "Porbandar";
//       record.district ||= "Porbandar";
//       record.streamId = stream.id;
//       record.isVerified ||= true;
//       return record;
//     });
//     const response = await models.pg.bulkCreate(data, {
//       updateOnDuplicate: Object.keys(models.pg.rawAttributes),
//     });
//     const message = ugRecordsSkipped
//       ? "Some UG records were skipped"
//       : "Imported successfully";
//     return res.status(200).json({ data: response, message });
//   } catch (error) {
//     next(error);
//   }
// });
function convertYandN(value, valuesToMap) {
  if (!value) return value;
  return valuesToMap[value.trim()];
}
function formatNumber(value) {
  if (!value) return value;
  if (value.length === 10) return value;
  if (value.includes(",")) return value.split(",")[0];
  return value.split(" ")[0];
}
module.exports = router;
