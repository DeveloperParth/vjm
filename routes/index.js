const checkAdmin = require("./../middlewares/checkAdmin");

module.exports = function (app) {
    app.use("/api", require("./auth"));
    app.use("/api", require("./import"));
    app.use("/seed", require("./seed"));
    app.use("/api/dashboard", require("./dashboard"));
    app.use("/api/tc", require("./tc"));
    app.use("/api/student", require("./student"));
    app.use("/api/bonafide", require("./bonafide"));
    app.use("/api/bin", checkAdmin, require("./bin"));
    app.use("/api/suggestions", require("./suggestions"));
    app.use("/api/stream", require("./stream"));
    app.use("/api/admission/ug", require("./ug"));
    app.use("/api/admission/pg", require("./pg"));
}