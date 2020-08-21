const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const fs = require("fs");
const db = "NGOEnlist";
function getASingleImage(conn, img, response) {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  const readStream = gfs.createReadStream({
    filename: img
  });
  readStream.on("error", function(err) {
    console.log("An error: ", err);
  });
  readStream.pipe(response);
  // mongoose.connection.db.listCollections( (err, names) => {
  //     console.log(names);
  // })
}
module.exports = getASingleImage;
