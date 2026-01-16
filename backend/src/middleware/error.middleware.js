module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  // Prisma unique constraint (optional nice-to-have)
  // If you later handle Prisma errors, you can map them here.

  console.error(err);
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
};


