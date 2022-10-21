const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./uploads/temp`;
    // const path = `./uploads/${req.body.stream}${req.body.sem}-${req.body.name} ${req.body.surname}`
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage });

module.exports = upload;
