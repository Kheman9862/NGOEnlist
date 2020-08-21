const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Events = new Schema({
  vol_requests: {
    type: Number
  },
  title: {
    type: String
  },
  summary: {
    type: String
  },
  category_desc: {
    type: String
  },
  org_title: {
    type: String
  },
  locality: {
    type: String
  },
  recurrence_type: {
    type: String
  },
  start_date_date: {
    type: String
  },
  end_date_date: {
    type: String
  },
  Latitude: {
    type: Number
  },
  Longitude: {
    type: Number
  },
  images: {
    type: String
  },
  locs: {
    type: String,
    coordinates: [Number]
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

Events.index({ loc: "2dsphere" });
module.exports = mongoose.model("Event", Events);
