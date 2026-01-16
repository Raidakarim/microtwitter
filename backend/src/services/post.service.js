const prisma = require("../prisma/client");

async function createPost({ authorId, content }) {
  return prisma.post.create({
    data: { authorId, content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });
}

async function listPostsByUser({ authorId }) {
  return prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });
}

module.exports = { createPost, listPostsByUser };
