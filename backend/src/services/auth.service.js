const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const SALT_ROUNDS = 12;

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw Object.assign(new Error("JWT_SECRET is not set"), { status: 500 });

  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

async function signup({ email, username, password }) {
  // basic validation
  if (!email || !username || !password) {
    throw Object.assign(new Error("email, username, and password are required"), { status: 400 });
  }
  if (password.length < 8) {
    throw Object.assign(new Error("password must be at least 8 characters"), { status: 400 });
  }
  if (username.length < 3) {
    throw Object.assign(new Error("username must be at least 3 characters"), { status: 400 });
  }

  // check uniqueness
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true, email: true, username: true },
  });
  if (existing) {
    throw Object.assign(new Error("email or username already in use"), { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, username, passwordHash },
    select: { id: true, email: true, username: true, createdAt: true },
  });

  const token = signToken(user.id);
  return { user, token };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw Object.assign(new Error("email and password are required"), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // avoid leaking which part failed
  if (!user) {
    throw Object.assign(new Error("invalid credentials"), { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw Object.assign(new Error("invalid credentials"), { status: 401 });
  }

  const token = signToken(user.id);

  // return safe profile only
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };

  return { user: safeUser, token };
}

async function me(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true, createdAt: true },
  });
  if (!user) {
    throw Object.assign(new Error("user not found"), { status: 404 });
  }
  return user;
}

module.exports = { signup, login, me };

