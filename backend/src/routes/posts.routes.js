const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const postsController = require("../controllers/posts.controller");

router.post("/", auth, postsController.createPost);

module.exports = router;


