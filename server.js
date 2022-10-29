const express = require("express");
const app = express();
const ErrorHandler = require("./middlewares/ErrorHandler");
const port = process.env.PORT || 3000;

const cors = require("cors");

app.use(cors());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use("/uploads", express.static("./uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", require("./routes/auth"));
app.use("/seed", require("./routes/seed"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admission", require("./routes/admission"));

app.use(ErrorHandler);

app.listen(port, () => console.log("Server runnng on " + port));
