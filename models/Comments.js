var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  text: String,
  username: String
});

module.exports = mongoose.model("Comment", commentSchema);
