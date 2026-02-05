const prisma = require("../prisma/client");
const { getPublicUrl } = require("./upload.service");

function withPostImage(post) {
  return {
    ...post,
    imageUrl: post.imagePath ? getPublicUrl("post-images", post.imagePath) : null,
  };
}

async function createPost({ authorId, content, imagePath = null }) {
  const post = await prisma.post.create({
    data: { authorId, content, imagePath },
    select: {
      id: true,
      content: true,
      imagePath: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });

  return withPostImage(post);
}

async function updatePostImage({ postId, imagePath }) {
  const post = await prisma.post.update({
    where: { id: postId },
    data: { imagePath },
    select: {
      id: true,
      content: true,
      imagePath: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });

  return withPostImage(post);
}

async function listPostsByUser({ authorId }) {
  const posts = await prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      imagePath: true,
      createdAt: true,
      author: { select: { id: true, username: true } },
    },
  });

  return posts.map(withPostImage);
}

module.exports = { createPost, updatePostImage, listPostsByUser };