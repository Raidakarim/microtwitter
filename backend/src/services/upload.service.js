const { supabase } = require("../lib/supabase");

function getPublicUrl(bucket, path) {
  const base = process.env.SUPABASE_URL;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

async function uploadAvatar({ userId, file }) {
  const bucket = "avatars";

  const ext = (file.mimetype.split("/")[1] || "png").toLowerCase();
  const path = `${userId}/avatar.${ext}`;

  // upsert = overwrite old avatar
  const { error } = await supabase.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: true,
  });

  if (error) throw new Error(error.message);

  return { bucket, path, url: getPublicUrl(bucket, path) };
}

module.exports = { uploadAvatar, getPublicUrl };
