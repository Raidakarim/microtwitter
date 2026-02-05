const prisma = require("../prisma/client");
const { getPublicUrl } = require("./upload.service");

function withPostImage(post) {
  return {
    ...post,
    imageUrl: post.imagePath ? getPublicUrl("post-images", post.imagePath) : null,
  };
}

async function getFeed({ userId, take = 20, skip = 0 }) {
  // 1) find who I follow
  const followingRows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = followingRows.map((r) => r.followingId);

  // 2) include myself too
  const authorIds = [userId, ...followingIds];

  // 3) fetch posts (include imagePath)
  const posts = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    select: {
      id: true,
      content: true,
      imagePath: true, // ✅ add this
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });

  return posts.map(withPostImage);
}

module.exports = { getFeed };