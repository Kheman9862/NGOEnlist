 const router = require("express").Router();
const Events = require("../models/Events");
const upload = require("../middleware/upload_image");

router.post("/Events", upload.single("images"), async (req, res) => {
  try {
    let NgoEvent = new Events();
    NgoEvent.vol_requests = req.body.vol_requests;
    NgoEvent.title = req.body.title;
    NgoEvent.summary = req.body.summary;
    NgoEvent.category_desc = req.body.category_desc;
    NgoEvent.org_title = req.body.org_title;
    NgoEvent.locality = req.body.locality;
    NgoEvent.recurrence_type = req.body.recurrence_type;
    NgoEvent.start_date_date = req.body.start_date_date;
    NgoEvent.end_date_date = req.body.end_date_date;
    NgoEvent.Latitude = req.body.Latitude;
    NgoEvent.Longitude = req.body.Longitude;
    NgoEvent.images = req.file.filename;
    await NgoEvent.save();

    res.redirect("/")
   

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

//GET-  to get all the events
router.get("/Events", async (req, res) => {
  try {
    let events = await Events.find();
    res.json({
      success: true,
      events: events
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

//GET - to get a single event
router.get("/Events/:id", async (req, res) => {
  try {
    let event = await Events.findOne({ _id: req.params.id });
    res.json({
      success: true,
      event: event
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
