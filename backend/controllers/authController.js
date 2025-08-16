// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userSchema = require("../models/User"); 


exports.createAccount = async(req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "All fields required",
    });
  }

  const isUser = await userSchema.findOne({ email });
  if (isUser) {
    return res.status(400).json({
      error: true,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userSchema({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );

  // ✅ Set JWT as an HTTP-only cookie
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: false, // set to true in production (HTTPS)
    sameSite: "Lax",
    maxAge: 72 * 60 * 60 * 1000, // 72 hours
  });

  return res.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    message: "Registration Successful",
  });
};

exports.login = async(req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const user = await userSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not Found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );

  // ✅ Set the token as an HTTP-only cookie
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: false, // change to true in production (with HTTPS)
    sameSite: "Lax",
    maxAge: 72 * 60 * 60 * 1000, // 72h
  });

  return res.json({
    error: false,
    message: "Login Successful",
    user: { Name: user.name, email: user.email },
  });
};

exports.logout = async(req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "Lax",
  });
  res.json({ message: "Logged out successfully" });
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // or your secret key
    const user = await userSchema.findById(decoded.userId); // or decoded._id, etc.
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = decoded; // ✅ now req.user is available to next middleware
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
