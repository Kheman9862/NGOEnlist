const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const fs = require("fs");

function uploadImages(conn, directoryName) {
  conn.once("open", function() {
    console.log(mongoose.connection.readyState);
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    fs.readdir(directoryName, function(err, filenames) {
      if (err) {
        console.log(err);
      }
      filenames.forEach(function(filename) {
        console.log(filename);
        var writestream = gfs.createWriteStream({
          filename: filename
        });
        fs.createReadStream("./public/img/logo/" + filename).pipe(writestream);
        writestream
          .on("error", function(err) {
            console.log(err);
          })
          .on("close", function(file) {
            console.log("stream closed : ", file);
          });
      });
    });
  });
}

module.exports = uploadImages;
