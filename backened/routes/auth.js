const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Sign-up
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Sign-in
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });

    // Set token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  res.json({ message: "Logged out successfully" });
});

// Validate token
router.get("/validate", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    try {
      const decoded = jwt.verify(token, "secret_key");
      res.json({ valid: true, user: decoded });
    } catch (err) {
      res.status(400).json({ valid: false, message: "Invalid or expired token" });
    }
  });

module.exports = router;