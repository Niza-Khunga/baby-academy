const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const TeacherSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      // Basic regex to validate email format
      match: /^\S+@\S+\.\S+$/,
    },
    password: { type: String, required: true },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Hash password before saving the document
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Optional: method to compare password with hashed password
TeacherSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Teacher", TeacherSchema);
// This code defines a Mongoose schema for a Teacher model in a MongoDB database.
// It includes fields for first name, last name, username, email, and password.
