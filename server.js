const express = require("express");
const app = express();
const ErrorHandler = require("./middlewares/ErrorHandler");

const cors = require("cors");
const serveIndex = require("serve-index");
const checkAdmin = require("./middlewares/checkAdmin");

app.use(cors());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const port = process.env.PORT || 3000;

app.use("/uploads", express.static("./uploads"), serveIndex("./uploads"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/import"));
app.use("/seed", require("./routes/seed"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/bin", checkAdmin, require("./routes/bin"));
app.use("/api/suggestions", require("./routes/suggestions"));
app.use("/api/admission/stream", require("./routes/stream"));
app.use("/api/admission/ug", require("./routes/ug"));
app.use("/api/admission/pg", require("./routes/pg"));

app.use(ErrorHandler);

app.listen(port, () => console.log("Server runnng on " + port));
