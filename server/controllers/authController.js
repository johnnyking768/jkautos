const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { all, insert } = require("../utils/db");
const generateToken = require("../utils/generateToken");
const { sanitizeUser } = require("../middleware/authMiddleware");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, city, country = "Nigeria" } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existing = (await all("users")).find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409);
    throw new Error("Email already exists");
  }

  const user = await insert("users", {
    name,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role: "user",
    phone,
    city,
    country,
    is_active: true,
    is_verified: false,
  });

  res.status(201).json({ user: sanitizeUser(user), token: generateToken(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = (await all("users")).find((entry) => entry.email.toLowerCase() === String(email).toLowerCase());

  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.is_active === false) {
    res.status(403);
    throw new Error("Account is inactive");
  }

  res.json({ user: sanitizeUser(user), token: generateToken(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { register, login, me };
