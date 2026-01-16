const postService = require("../services/post.service");

async function createPost(req, res, next) {
  try {
    const { content } = req.body;

    if (typeof content !== "string") {
      return res.status(400).json({ error: "content must be a string" });
    }

    const trimmed = content.trim();
    if (trimmed.length < 1 || trimmed.length > 280) {
      return res.status(400).json({ error: "content must be 1–280 characters" });
    }

    const post = await postService.createPost({
      authorId: req.user.id,
      content: trimmed,
    });

    return res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPost };

