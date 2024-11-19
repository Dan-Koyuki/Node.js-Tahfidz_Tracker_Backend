// @ts-nocheck

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ActionRoute from "./route/action.route.js";
import MentorRoute from "./route/mentor.route.js";
import StudentRoute from "./route/student.route.js";

const app = express();

dotenv.config();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// CORS Settings
app.use(cors());
app.use((req, res, next) => {
  // Allow requests from all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Define allowed methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // Define allowed headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // Continue to the next middleware
  next();
});
app.options("*", (req, res) => {
  // Respond to preflight requests
  res.status(200).end();
});

// Database connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/mentor", MentorRoute);
app.use("/student", StudentRoute);
app.use("/", ActionRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
