const prisma = require("../prisma/client");

async function getFeed({ userId, take = 20, skip = 0 }) {
  // 1) find who I follow
  const followingRows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = followingRows.map((r) => r.followingId);

  // 2) include myself too
  const authorIds = [userId, ...followingIds];

  // 3) fetch posts
  const posts = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });

  return posts;
}

module.exports = { getFeed };
