const express = require("express");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const ErrorHandler = require("./middlewares/ErrorHandler");

app.use(require("cors")());

app.use(require("morgan")("dev"));
const port = process.env.PORT || 3000;

app.use("/uploads", express.static("./uploads"), require("serve-index")("./uploads"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

require("./routes")(app);

app.use(ErrorHandler);

app.listen(port, () => console.log("Server runnng"));