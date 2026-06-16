const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "jkautos_secret_2024", {
    expiresIn: "30d",
  });

module.exports = generateToken;
