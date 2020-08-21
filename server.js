const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const Loc = require("./models/loc");
const Comment = require("./models/Comments");
const Events = require("./models/Events");
var searchTerm;
var searchLatitude;
var searchLongitude;
var category;

dotenv.config();

const app = express();

mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log("MongoDb is Connected");
    }
  }
);

// const createLoc = require("./createLoc");

const conn = mongoose.connection;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

//Index
app.get("/", (req, res) => {
  Events.find({}, function (err, allEvents) {
    if (err) {
      console.log(err);
    } else {
      res.render("index");
    }
  });
});

//Community
app.get("/community/", (req, res) => {
  Events.find({ category_desc: "Strengthening Communities" }, function (
    err,
    allEvents
  ) {
    if (err) {
      console.log(err);
    } else {
      res.render("community", {
        events: allEvents
      });
    }
  });
});

app.post("/community", function (req, res) {
  searchTerm = req.body.searchName;
  category = "Strengthening Communities";
  res.redirect("/search");
});

app.get("/community/:id", (req, res) => {
  Events.findById(req.params.id)
    .populate("comments")
    .exec(function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        console.log(allEvents);
        res.render("showcommunity", { events: allEvents });
      }
    });
});

//Comments New
app.get("/community/:id/comments/new", function (req, res) {
  // find Event by id
  console.log(req.params.id);
  Events.findById(req.params.id, function (err, allEvent) {
    if (err) {
      console.log(err);
    } else {
      res.render("communitycomment", { event: allEvent });
    }
  });
});

//Comments Create
app.post("/community/:id/comments/new", function (req, res) {
  //lookup event using ID
  Events.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      res.redirect("/community");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.username = req.body.username;
          comment.text = req.body.text;
          //save comment
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          res.redirect("/community");
        }
      });
    }
  });
});

app.post("/loccommunity", function (req, res) {
  searchTerm = req.body.searchLocation;
  category = "Strengthening Communities";
  if (searchTerm == "Bronx" || searchTerm == "bronx") {
    searchLatitude = 40.89587;
    searchLongitude = -73.8923;
  } else if (searchTerm == "New York" || searchTerm == "new york") {
    searchLatitude = 40.74574;
    searchLongitude = -73.9944;
  } else if (searchTerm == "Brooklyn" || searchTerm == "brooklyn") {
    searchLatitude = 40.67886;
    searchLongitude = -73.9638;
  } else if (searchTerm == "Queens" || searchTerm == "queens") {
    searchLatitude = 40.71075;
    searchLongitude = -73.793;
  } else if (searchTerm == "Manhattan" || searchTerm == "manhattan") {
    searchLatitude = 40.7535;
    searchLongitude = -73.9906;
  } else {
    searchLatitude = 40.8111;
    searchLongitude = -73.9642;
  }
  console.log(searchTerm, searchLongitude, searchLatitude);
  res.redirect("/location");
});

//Emergency
app.get("/emergency/", (req, res) => {
  Events.find({ category_desc: "Emergency Preparedness" }, function (
    err,
    allEvents
  ) {
    if (err) {
      console.log(err);
    } else {
      res.render("emergency", {
        events: allEvents
      });
    }
  });
});

app.post("/emergency", function (req, res) {
  searchTerm = req.body.searchName;
  category = "Emergency Preparedness";
  res.redirect("/search");
});

app.get("/emergency/:id", (req, res) => {
  Events.findById(req.params.id)
    .populate("comments")
    .exec(function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        console.log(allEvents);
        res.render("showemergency", { events: allEvents });
      }
    });
});

//Comments New
app.get("/emergency/:id/comments/new", function (req, res) {
  // find Event by id
  console.log(req.params.id);
  Events.findById(req.params.id, function (err, allEvent) {
    if (err) {
      console.log(err);
    } else {
      res.render("emergencycomment", { event: allEvent });
    }
  });
});

//Comments Create
app.post("/emergency/:id/comments/new", function (req, res) {
  //lookup event using ID
  Events.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      res.redirect("/emergency");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //save comment
          comment.username = req.body.username;
          comment.text = req.body.text;
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          res.redirect("/emergency");
        }
      });
    }
  });
});

app.post("/locemergency", function (req, res) {
  category = "Emergency Preparedness";
  searchTerm = req.body.searchLocation;
  if (searchTerm == "Bronx" || searchTerm == "bronx") {
    searchLatitude = 40.89587;
    searchLongitude = -73.8923;
  } else if (searchTerm == "New York" || searchTerm == "new york") {
    searchLatitude = 40.74574;
    searchLongitude = -73.9944;
  } else if (searchTerm == "Brooklyn" || searchTerm == "brooklyn") {
    searchLatitude = 40.67886;
    searchLongitude = -73.9638;
  } else if (searchTerm == "Queens" || searchTerm == "queens") {
    searchLatitude = 40.71075;
    searchLongitude = -73.793;
  } else if (searchTerm == "Manhattan" || searchTerm == "manhattan") {
    searchLatitude = 40.7535;
    searchLongitude = -73.9906;
  } else {
    searchLatitude = 40.8111;
    searchLongitude = -73.9642;
  }
  console.log(searchTerm, searchLongitude, searchLatitude);
  res.redirect("/location");
});

//Environment
app.get("/environment/", (req, res) => {
  Events.find({ category_desc: "Environment" }, function (err, allEvents) {
    if (err) {
      console.log(err);
    } else {
      res.render("environment", {
        events: allEvents
      });
    }
  });
});

app.post("/environment", function (req, res) {
  searchTerm = req.body.searchName;
  category = "Environment";
  res.redirect("/search");
});

app.get("/environment/:id", (req, res) => {
  Events.findById(req.params.id)
    .populate("comments")
    .exec(function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        console.log(allEvents);
        res.render("showenvironment", { events: allEvents });
      }
    });
});

//Comments New
app.get("/environment/:id/comments/new", function (req, res) {
  // find Event by id
  console.log(req.params.id);
  Events.findById(req.params.id, function (err, allEvent) {
    if (err) {
      console.log(err);
    } else {
      res.render("environmentcomment", { event: allEvent });
    }
  });
});

//Comments Create
app.post("/environment/:id/comments/new", function (req, res) {
  //lookup event using ID
  Events.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      res.redirect("/environment");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //save comment
          comment.username = req.body.username;
          comment.text = req.body.text;
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          res.redirect("/environment");
        }
      });
    }
  });
});

app.post("/locenvironment", function (req, res) {
  searchTerm = req.body.searchLocation;
  category = "Environment";
  if (searchTerm == "Bronx" || searchTerm == "bronx") {
    searchLatitude = 40.89587;
    searchLongitude = -73.8923;
  } else if (searchTerm == "New York" || searchTerm == "new york") {
    searchLatitude = 40.74574;
    searchLongitude = -73.9944;
  } else if (searchTerm == "Brooklyn" || searchTerm == "brooklyn") {
    searchLatitude = 40.67886;
    searchLongitude = -73.9638;
  } else if (searchTerm == "Queens" || searchTerm == "queens") {
    searchLatitude = 40.71075;
    searchLongitude = -73.793;
  } else if (searchTerm == "Manhattan" || searchTerm == "manhattan") {
    searchLatitude = 40.7535;
    searchLongitude = -73.9906;
  } else {
    searchLatitude = 40.8111;
    searchLongitude = -73.9642;
  }
  console.log(searchTerm, searchLongitude, searchLatitude);
  res.redirect("/location");
});

//Neighbourhood
app.get("/neighbourhood/", (req, res) => {
  Events.find({ category_desc: "Helping Neighbors in Need" }, function (
    err,
    allEvents
  ) {
    if (err) {
      console.log(err);
    } else {
      res.render("neighbourhood", {
        events: allEvents
      });
    }
  });
});

app.post("/neighbourhood", function (req, res) {
  searchTerm = req.body.searchName;
  category = "Helping Neighbors in Need";
  res.redirect("/search");
});

app.get("/neighbourhood/:id", (req, res) => {
  Events.findById(req.params.id)
    .populate("comments")
    .exec(function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        console.log(allEvents);
        res.render("showneighbourhood", { events: allEvents });
      }
    });
});

//Comments New
app.get("/neighbourhood/:id/comments/new", function (req, res) {
  // find Event by id
  console.log(req.params.id);
  Events.findById(req.params.id, function (err, allEvent) {
    if (err) {
      console.log(err);
    } else {
      res.render("neighbourhoodcomment", { event: allEvent });
    }
  });
});

//Comments Create
app.post("/neighbourhood/:id/comments/new", function (req, res) {
  //lookup event using ID
  Events.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      res.redirect("/neighbourhood");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //save comment
          comment.username = req.body.username;
          comment.text = req.body.text;
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          res.redirect("/neighbourhood");
        }
      });
    }
  });
});

app.post("/locneighbourhood", function (req, res) {
  searchTerm = req.body.searchLocation;
  category = "Helping Neighbors in Need";
  if (searchTerm == "Bronx" || searchTerm == "bronx") {
    searchLatitude = 40.89587;
    searchLongitude = -73.8923;
  } else if (searchTerm == "New York" || searchTerm == "new york") {
    searchLatitude = 40.74574;
    searchLongitude = -73.9944;
  } else if (searchTerm == "Brooklyn" || searchTerm == "brooklyn") {
    searchLatitude = 40.67886;
    searchLongitude = -73.9638;
  } else if (searchTerm == "Queens" || searchTerm == "queens") {
    searchLatitude = 40.71075;
    searchLongitude = -73.793;
  } else if (searchTerm == "Manhattan" || searchTerm == "manhattan") {
    searchLatitude = 40.7535;
    searchLongitude = -73.9906;
  } else {
    searchLatitude = 40.8111;
    searchLongitude = -73.9642;
  }
  console.log(searchTerm, searchLongitude, searchLatitude);
  res.redirect("/location");
});

//Health
app.get("/health/", (req, res) => {
  Events.find({ category_desc: "Health" }, function (err, allEvents) {
    if (err) {
      console.log(err);
    } else {
      res.render("health", {
        events: allEvents
      });
    }
  });
});

app.post("/health", function (req, res) {
  searchTerm = req.body.searchName;
  category = "Health";
  res.redirect("/search");
});

app.get("/health/:id", (req, res) => {
  Events.findById(req.params.id)
    .populate("comments")
    .exec(function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        console.log(allEvents);
        res.render("showhealth", { events: allEvents });
      }
    });
});

//Comments New
app.get("/health/:id/comments/new", function (req, res) {
  // find Event by id
  console.log(req.params.id);
  Events.findById(req.params.id, function (err, allEvent) {
    if (err) {
      console.log(err);
    } else {
      res.render("healthcomment", { event: allEvent });
    }
  });
});

//Comments Create
app.post("/health/:id/comments/new", function (req, res) {
  //lookup event using ID
  Events.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      res.redirect("/health");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //save comment
          comment.username = req.body.username;
          comment.text = req.body.text;
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          res.redirect("/health");
        }
      });
    }
  });
});

app.post("/lochealth", function (req, res) {
  searchTerm = req.body.searchLocation;
  category = "Health";
  if (searchTerm == "Bronx" || searchTerm == "bronx") {
    searchLatitude = 40.89587;
    searchLongitude = -73.8923;
  } else if (searchTerm == "New York" || searchTerm == "new york") {
    searchLatitude = 40.74574;
    searchLongitude = -73.9944;
  } else if (searchTerm == "Brooklyn" || searchTerm == "brooklyn") {
    searchLatitude = 40.67886;
    searchLongitude = -73.9638;
  } else if (searchTerm == "Queens" || searchTerm == "queens") {
    searchLatitude = 40.71075;
    searchLongitude = -73.793;
  } else if (searchTerm == "Manhattan" || searchTerm == "manhattan") {
    searchLatitude = 40.7535;
    searchLongitude = -73.9906;
  } else {
    searchLatitude = 40.8111;
    searchLongitude = -73.9642;
  }
  console.log(searchTerm, searchLongitude, searchLatitude);
  res.redirect("/location");
});

//Education
app.get("/education/", (req, res) => {
  Events.find({ category_desc: "Education" }, function (err, allEvents) {
    if (err) {
      console.log(err);
    } else {
      res.render("education", {
        events: allEvents
      });
    }
  });
});

app.post("/education", function (req, res) {
  searchTerm = req.body.searchName;
  category = "Education";
  res.redirect("/search");
});

app.get("/education/:id", (req, res) => {
  Events.findById(req.params.id)
    .populate("comments")
    .exec(function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        console.log(allEvents);
        res.render("showeducation", { events: allEvents });
      }
    });
});

//Comments New
app.get("/education/:id/comments/new", function (req, res) {
  // find Event by id
  console.log(req.params.id);
  Events.findById(req.params.id, function (err, allEvent) {
    if (err) {
      console.log(err);
    } else {
      res.render("educationcomment", { event: allEvent });
    }
  });
});

//Comments Create
app.post("/education/:id/comments/new", function (req, res) {
  //lookup event using ID
  Events.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      res.redirect("/education");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //save comment
          comment.username = req.body.username;
          comment.text = req.body.text;
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          res.redirect("/education");
        }
      });
    }
  });
});

app.post("/loceducation", function (req, res) {
  searchTerm = req.body.searchLocation;
  category = "Education";
  if (searchTerm == "Bronx" || searchTerm == "bronx") {
    searchLatitude = 40.89587;
    searchLongitude = -73.8923;
  } else if (searchTerm == "New York" || searchTerm == "new york") {
    searchLatitude = 40.74574;
    searchLongitude = -73.9944;
  } else if (searchTerm == "Brooklyn" || searchTerm == "brooklyn") {
    searchLatitude = 40.67886;
    searchLongitude = -73.9638;
  } else if (searchTerm == "Queens" || searchTerm == "queens") {
    searchLatitude = 40.71075;
    searchLongitude = -73.793;
  } else if (searchTerm == "Manhattan" || searchTerm == "manhattan") {
    searchLatitude = 40.7535;
    searchLongitude = -73.9906;
  } else {
    searchLatitude = 40.8111;
    searchLongitude = -73.9642;
  }
  console.log(searchTerm, searchLongitude, searchLatitude);
  res.redirect("/location");
});

// Also add to check if events is empty show a msg please check your catefgory!
app.get("/search", (req, res) => {
  Events.find(
    {
      // org_title: searchTerm,
      org_title: { $regex: "\\b" + searchTerm + "*", $options: "i" },
      category_desc: category
    },
    function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        res.render("search", {
          events: allEvents,
          term: searchTerm,
          category: category
        });
      }
    }
  );
});

app.get("/search/:id", (req, res) => {
  Events.findById(req.params.id)
    .populate("comments")
    .exec(function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        res.render("show", { events: allEvents });
      }
    });
});

//Comments New
app.get("/search/:id/comments/new", function (req, res) {
  // find Event by id
  console.log(req.params.id);
  Events.findById(req.params.id, function (err, allEvent) {
    if (err) {
      console.log(err);
    } else {
      res.render("comment", { event: allEvent });
    }
  });
});

//Comments Create
app.post("/search/:id/comments/new", function (req, res) {
  //lookup event using ID
  Events.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //save comment
          comment.username = req.body.username;
          comment.text = req.body.text;
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          res.redirect("/");
        }
      });
    }
  });
});

app.get("/location", function (req, res) {
  Events.find(
    // this looks for all documents that have a location (loc) near (with 5 k) Rochester.
    //Notice how the query is formed.
    {
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [searchLongitude, searchLatitude]
          },
          $maxDistance: 500
        }
      },
      category_desc: category
    },
    function (err, allEvents) {
      if (err) {
        console.log(err);
      } else {
        res.render("locsearch", {
          events: allEvents,
          location: searchTerm,
          category: category
        });
      }
    }
  );
});
const uploadImages = require("./uploadImages");
const getASingleImage = require("./getASingleImage");
//uploadImages(conn, "./public/img/logo");
console.log(mongoose.connection.readyState);

app.get("/:img", (req, res) => {
  getASingleImage(conn, req.params.img, res);
});

//APIs
const EventRoutes = require("./routes/Event");
app.use("/api", EventRoutes);
app.listen(3000, err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running on port 3000");
  }
});
