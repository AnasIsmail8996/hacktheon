import dotenv from "dotenv";
dotenv.config();

// Keep process alive even if MongoDB DNS/connection fails
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception (server kept alive):', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection (server kept alive):', reason?.message || reason);
});

import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRoute from "./routes/admin-routes.js";
import doctorsRoute from "./routes/doctorRoutes.js";
import userRoute from "./routes/userRoutes.js";
import doctorAuthRoute from "./routes/doctorAuthRoutes.js";
import prescriptionRoute from "./routes/prescriptionRoutes.js";
import aiRoute from "./routes/aiRoutes.js";
import receptionistRoute from "./routes/receptionistRoutes.js";
import analyticsRoute from "./routes/analyticsRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
connectCloudinary();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all localhost origins (any port) + no-origin (Postman etc.)
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── DB Health Gate ────────────────────────────────────
import mongoose from "mongoose";
const skipPaths = ["/api/admin/login", "/api/doctor/login", "/"];
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && !skipPaths.includes(req.path)) {
    return res.status(503).json({
      status: false,
      message: "❌ Database not connected. Please fix MONGO_URI in server/.env and restart the server.",
    });
  }
  next();
});

// ── Existing Routes ──────────────────────────
app.use("/api/admin", adminRoute);
app.use("/api", doctorsRoute);
app.use("/api/user", userRoute);

// ── New Hackathon Routes ─────────────────────
app.use("/api/doctor", doctorAuthRoute);
app.use("/api/prescription", prescriptionRoute);
app.use("/api/ai", aiRoute);
app.use("/api/receptionist", receptionistRoute);
app.use("/api/analytics", analyticsRoute);

app.get("/", (req, res) => res.json({ message: "AI Clinic Management API is running 🚀" }));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
