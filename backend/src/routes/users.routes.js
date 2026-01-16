const router = require("express").Router();
const usersController = require("../controllers/users.controller");
const authOptional = (req, _res, next) => next();

router.get("/:id/posts", usersController.getUserPosts);
router.get("/:id/followers", usersController.getFollowers);
router.get("/:id/following", usersController.getFollowing);
router.get("/", authOptional, usersController.listUsers);
router.get("/:id", usersController.getUser);

module.exports = router;


