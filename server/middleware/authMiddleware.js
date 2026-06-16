const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { findById } = require("../utils/db");

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const readToken = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
};

const protect = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "jkautos_secret_2024");
  const user = await findById("users", decoded.id);

  if (!user || user.is_active === false) {
    res.status(401);
    throw new Error("Account not found or inactive");
  }

  req.user = sanitizeUser(user);
  next();
});

const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = readToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jkautos_secret_2024");
    const user = await findById("users", decoded.id);
    if (user && user.is_active !== false) req.user = sanitizeUser(user);
  } catch (_error) {
    req.user = null;
  }

  next();
});

module.exports = { protect, optionalAuth, sanitizeUser };
