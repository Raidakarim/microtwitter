const feedService = require("../services/feed.service");

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

async function getFeed(req, res, next) {
  try {
    // Pagination params (optional)
    const take = Math.min(toInt(req.query.take, 20), 50); // max 50
    const skip = Math.max(toInt(req.query.skip, 0), 0);

    const posts = await feedService.getFeed({
      userId: req.user.id,
      take,
      skip,
    });

    return res.json({ posts, paging: { take, skip } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getFeed };

