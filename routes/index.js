const checkAdmin = require("./../middlewares/checkAdmin");

module.exports = function (app) {
  app.use("/api", require("./auth"));
  app.use("/api", require("./import"));
  app.use("/api/dashboard", require("./dashboard"));
  app.use("/api/tc", require("./tc"));
  app.use("/api/student", require("./student"));
  app.use("/api/bonafide", require("./bonafide"));
  app.use("/api/bin", require("./bin"));
  app.use("/api/suggestions", require("./suggestions"));
  app.use("/api/stream", require("./stream"));
  app.use("/api/admission/ug", require("./ug"));
  app.use("/api/admission/pg", require("./pg"));
  app.use("/api/logs", require("./logs"));

  app.use("/*", (req, res) => {
    res.status(404).json({ message: "Endpoint not Found" });
  });
};
