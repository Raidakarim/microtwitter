const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

// public
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// protected
router.get("/me", auth, authController.me);

module.exports = router;


