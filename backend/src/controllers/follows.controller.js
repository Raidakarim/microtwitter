const followService = require("../services/follow.service");

async function follow(req, res, next) {
  try {
    const me = req.user.id;
    const { userId } = req.params;

    if (userId === me) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    try {
      await followService.followUser({ followerId: me, followingId: userId });
      return res.status(201).json({ message: "Followed" });
    } catch (err) {
      // Unique constraint violation => already following
      if (err.code === "P2002") {
        return res.status(200).json({ message: "Already following" });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

async function unfollow(req, res, next) {
  try {
    const me = req.user.id;
    const { userId } = req.params;

    try {
      await followService.unfollowUser({ followerId: me, followingId: userId });
      return res.json({ message: "Unfollowed" });
    } catch (err) {
      // Record not found => not following
      if (err.code === "P2025") {
        return res.status(404).json({ error: "You are not following this user" });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { follow, unfollow };

