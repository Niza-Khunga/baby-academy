const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ParentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      // Simple regex to validate email format
      match: /^\S+@\S+\.\S+$/,
    },
    password: { type: String, required: true },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Hash password before saving the document
ParentSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Optional: Add a method to the schema to compare passwords
ParentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Parent", ParentSchema);
// This code defines a Mongoose schema for a Parent model in a MongoDB database.
// It includes fields for first name, last name, username, email, and password.
