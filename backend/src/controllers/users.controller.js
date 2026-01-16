const postService = require("../services/post.service");
const followService = require("../services/follow.service");
const userService = require("../services/user.service");

async function listUsers(req, res, next) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    // exclude "me" if authenticated (optional)
    const excludeUserId = req.user?.id;
    const users = await userService.listUsers({ search, excludeUserId });
    return res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById({ userId: id });
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function getUserPosts(req, res, next) {
  try {
    const { id } = req.params;
    const posts = await postService.listPostsByUser({ authorId: id });
    return res.json({ posts });
  } catch (err) {
    next(err);
  }
}

async function getFollowers(req, res, next) {
  try {
    const { id } = req.params;
    const followers = await followService.listFollowers({ userId: id });
    return res.json({ followers });
  } catch (err) {
    next(err);
  }
}

async function getFollowing(req, res, next) {
  try {
    const { id } = req.params;
    const following = await followService.listFollowing({ userId: id });
    return res.json({ following });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUserPosts,
  getFollowers,
  getFollowing,
  listUsers,
  getUser,
};

