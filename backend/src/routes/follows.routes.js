const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const followsController = require("../controllers/follows.controller");

router.post("/:userId", auth, followsController.follow);
router.delete("/:userId", auth, followsController.unfollow);

module.exports = router;


