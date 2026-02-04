const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { uploadAvatarHandler } = require("../controllers/uploads.controller");

router.post("/avatar", auth, upload.single("file"), uploadAvatarHandler);

module.exports = router;
