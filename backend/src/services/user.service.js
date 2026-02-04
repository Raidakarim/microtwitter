const prisma = require("../prisma/client");
const { getPublicUrl } = require("./upload.service");

function withAvatar(user) {
  return {
    ...user,
    avatarUrl: user.avatarPath ? getPublicUrl("avatars", user.avatarPath) : null,
  };
}

async function listUsers({ search = "", excludeUserId }) {
  const where = search
    ? {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where: {
      ...where,
      ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, username: true, avatarPath: true },
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    avatarPath: u.avatarPath,
    avatarUrl: u.avatarPath ? getPublicUrl("avatars", u.avatarPath) : null,
  }));
}

async function getUserById({ userId }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true,
      avatarPath: true,
      avatarUrl: true,
    },
  });

  return user || null;
}


module.exports = { listUsers, getUserById };
