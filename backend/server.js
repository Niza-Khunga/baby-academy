// server.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const cors = require("cors");
const parentAuthRoutes = require("./routes/parentAuth");
const teacherAuthRoutes = require("./routes/teacherAuth");
const path = require("path");

dotenv.config();
const app = express();

// Replace hardcoded strings with env variables or defaults
const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/babyacademy";
const sessionSecret = process.env.SESSION_SECRET || "default_secret_key";

// ✅ Enable CORS before anything else that uses it
app.use(
  cors({
    origin: "http://localhost:3000", // or wherever your frontend is hosted
    credentials: true,
  })
);

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/public")));

// ✅ Session middleware — only once
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false,
      httpOnly: true,
    },
  })
);

// Routes
app.use("/api", parentAuthRoutes);
app.use("/api", teacherAuthRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Baby Academy Backend Running");
});

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((req, res) => {
  res.status(404).send("Page not found.");
});
