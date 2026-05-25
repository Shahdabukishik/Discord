const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email, and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    res.status(409);
    throw new Error("Username or email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });

  res.status(201).json({
    message: "User registered successfully",
    token: createToken(user._id),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    message: "Login successful",
    token: createToken(user._id),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  register,
  login,
  me,
};
