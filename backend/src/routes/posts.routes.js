const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { createPost } = require("../controllers/posts.controller");

router.post("/", auth, upload.single("image"), createPost);

module.exports = router;