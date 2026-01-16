const authService = require("../services/auth.service");

async function signup(req, res, next) {
  try {
    const { email, username, password } = req.body;
    const result = await authService.signup({ email, username, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    // req.user is set by auth middleware
    const user = await authService.me(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, me };

