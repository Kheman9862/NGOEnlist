var mongoose = require("mongoose");

var locSchema = mongoose.Schema({
  type: String,
  coordinates: [String, String]
});

module.exports = mongoose.model("Loc", locSchema);
