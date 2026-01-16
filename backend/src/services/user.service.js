const prisma = require("../prisma/client");

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
    select: { id: true, username: true },
  });

  return users;
}

async function getUserById({ userId }) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, createdAt: true },
  });
}

module.exports = { listUsers, getUserById };
