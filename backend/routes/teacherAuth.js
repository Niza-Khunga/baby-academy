const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher");

// Teacher Registration
router.post("/register-teacher", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if teacher with email or username already exists
    const existingTeacher = await Teacher.findOne({
      $or: [{ email }, { username }],
    });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Teacher
    const newTeacher = new Teacher({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    await newTeacher.save();

    // Set session
    req.session.user = {
      id: newTeacher._id,
      role: "teacher",
      name: newTeacher.firstName,
    };

    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    console.error("Teacher registration error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Teacher Login
router.post("/login-teacher", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" }); // 404 better than 400
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" }); // 401 better than 400
    }

    // Set session
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ message: "Session error" });
      req.session.user = {
        id: teacher._id,
        role: "teacher",
        name: teacher.firstName,
      };
      res.json({ message: "Login successful" });
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
