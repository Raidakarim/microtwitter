const prisma = require("../prisma/client");
const { uploadAvatar } = require("../services/upload.service");

async function uploadAvatarHandler(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "missing file" });

    const userId = req.user.id;

    const uploaded = await uploadAvatar({ userId, file: req.file });

    // save avatarPath in DB
    await prisma.user.update({
      where: { id: userId },
      data: { avatarPath: uploaded.path, avatarUrl: uploaded.url },
    });

    res.json({
      avatarPath: uploaded.path,
      avatarUrl: uploaded.url,
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "upload failed" });
  }
}

module.exports = { uploadAvatarHandler };
