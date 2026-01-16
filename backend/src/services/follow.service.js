const prisma = require("../prisma/client");

async function followUser({ followerId, followingId }) {
  return prisma.follow.create({
    data: { followerId, followingId },
  });
}

async function unfollowUser({ followerId, followingId }) {
  return prisma.follow.delete({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });
}

async function listFollowers({ userId }) {
  const rows = await prisma.follow.findMany({
    where: { followingId: userId },
    select: {
      follower: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => r.follower);
}

async function listFollowing({ userId }) {
  const rows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      following: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => r.following);
}

module.exports = {
  followUser,
  unfollowUser,
  listFollowers,
  listFollowing,
};

