const prisma = require("../prisma/client");
const { getPublicUrl } = require("./upload.service");

function withAvatar(user) {
  return {
    ...user,
    avatarUrl: user.avatarPath ? getPublicUrl("avatars", user.avatarPath) : null,
  };
}

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
      follower: { select: { id: true, username: true, avatarPath: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.follower.id,
    username: r.follower.username,
    avatarPath: r.follower.avatarPath,
    avatarUrl: r.follower.avatarPath ? getPublicUrl("avatars", r.follower.avatarPath) : null,
  }));
}

async function listFollowing({ userId }) {
  const rows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      following: { select: { id: true, username: true, avatarPath: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.following.id,
    username: r.following.username,
    avatarPath: r.following.avatarPath,
    avatarUrl: r.following.avatarPath ? getPublicUrl("avatars", r.following.avatarPath) : null,
  }));
}

module.exports = {
  followUser,
  unfollowUser,
  listFollowers,
  listFollowing,
};

