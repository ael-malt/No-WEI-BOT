const mongoose = require("mongoose");

const UL_Schema = new mongoose.Schema({
  title: String,
  messageId: String,
});
module.exports = mongoose.model("updatelists", UL_Schema);
module.exports.config = {
  dbName: "updatelists",
  displayName: "updatelists",
};