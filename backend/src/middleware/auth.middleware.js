const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "missing Authorization header" });
    }

    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "invalid Authorization format" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET is not set" });
    }

    const payload = jwt.verify(token, secret);

    // attach user to request
    req.user = { id: payload.userId };

    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid or expired token" });
  }
};

