const mongoose = require("mongoose");

const UL_Schema = new mongoose.Schema({
  title: String,
  messageId: String,
});
module.exports = mongoose.model("update-list", UL_Schema);
module.exports.config = {
  dbName: "update-list",
  displayName: "Update List",
};
