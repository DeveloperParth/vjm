const express = require("express");
const cron = require("node-cron");

const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const ErrorHandler = require("./middlewares/ErrorHandler");

app.use(require("cors")());

app.use(require("morgan")("dev"));
const port = process.env.PORT || 3000;

app.use(
  "/uploads",
  express.static("./uploads"),
  require("serve-index")("./uploads")
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

require("./routes")(app);

app.use(ErrorHandler);

// cron.schedule(
//   "* * * * * *",
//   () => {
//     console.log("Running a task every day at 00:00:00");
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );

app.listen(port, () => console.log("Server runnng"));
