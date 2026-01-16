const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const feedController = require("../controllers/feed.controller");

router.get("/", auth, feedController.getFeed);

module.exports = router;

