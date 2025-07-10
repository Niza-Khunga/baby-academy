// routes/parentAuth.js
const express = require("express");
const bcrypt = require("bcrypt");
const Parent = require("../models/Parent");

const router = express.Router();

// ✅ REGISTER Parent
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  // Inside POST /register route before checking for existing user
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await Parent.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const newParent = new Parent({
      firstName,
      lastName,
      username,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
    });
    await newParent.save();

    // Start session
    req.session.user = {
      id: newParent._id,
      role: "parent",
      name: newParent.firstName,
    };

    res.status(201).json({ message: "Parent registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

// ✅ LOGIN Parent
router.post("/login-parent", async (req, res) => {
  const { email, password } = req.body;
  // Inside POST /login-parent route before checking for existing user
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Start session
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ message: "Session error" });
      req.session.user = {
        id: parent._id,
        role: "parent",
        name: parent.firstName,
      };
      res.json({ message: "Login successful" });
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}); // <-- Closing this route handler

module.exports = router;
