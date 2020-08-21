const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

dotenv.config();

const app = express();

const storage = new GridFsStorage({
  url: process.env.DATABASE,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "fs",
      };
      resolve(fileInfo);
    });
  },
});
const upload = multer({ storage });

module.exports = upload;
