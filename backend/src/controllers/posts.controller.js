const postService = require("../services/post.service");
const { uploadPostImage } = require("../services/upload.service");

/**
 * POST /posts
 * Accepts:
 * - JSON: { content }
 * - OR multipart/form-data: content + optional "image" file
 *
 * Route should use: upload.single("image")
 */
async function createPost(req, res, next) {
  try {
    const userId = req.user.id;

    // content might be missing if user posts image-only
    const rawContent = req.body?.content ?? "";
    const content = typeof rawContent === "string" ? rawContent.trim() : "";

    // allow:
    // - text-only (1–280)
    // - image-only
    // - text + image
    const hasImage = !!req.file;

    if (!hasImage) {
      // text-only validation
      if (typeof rawContent !== "string") {
        return res.status(400).json({ error: "content must be a string" });
      }
      if (content.length < 1 || content.length > 280) {
        return res
          .status(400)
          .json({ error: "content must be 1–280 characters" });
      }
    } else {
      // image present: allow empty text, but if provided enforce max length
      if (typeof rawContent !== "string" && rawContent !== undefined) {
        return res.status(400).json({ error: "content must be a string" });
      }
      if (content.length > 280) {
        return res
          .status(400)
          .json({ error: "content must be 0–280 characters" });
      }
    }

    // 1) Create the post first (so we have post.id)
    const created = await postService.createPost({
      authorId: userId,
      content, // may be "" for image-only
      imagePath: null, // we’ll set this after upload if needed
    });

    // 2) If image is attached, upload to Supabase and update the post record
    let post = created;

    if (hasImage) {
      const uploaded = await uploadPostImage({
        userId,
        postId: created.id,
        file: req.file,
      });

      // update DB with image path (and optionally return imageUrl in service)
      post = await postService.updatePostImage({
        postId: created.id,
        imagePath: uploaded.path,
      });
    }

    return res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPost };