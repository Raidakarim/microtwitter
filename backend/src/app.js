const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
const allowlist = [
  "http://localhost:5173",
  // Add Netlify URL after deploy:
  // "https://your-site-name.netlify.app",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowlist.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

// Routes (we’ll implement these next)
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/users.routes"));
app.use("/posts", require("./routes/posts.routes"));
app.use("/follows", require("./routes/follows.routes"));
app.use("/feed", require("./routes/feed.routes"));

// Error middleware (placeholder)
app.use(require("./middleware/error.middleware"));

module.exports = app;

