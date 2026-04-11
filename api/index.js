import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import listingRouter from './routes/listing.route.js';

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS (frontend connect ke liye)
app.use(
  cors({
    origin: [
      "https://mern-estate-app-puce.vercel.app",
      "https://mern-estate-app-jv7n.vercel.app"
    ],
    credentials: true,
  })
);

// ✅ Root route (important)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Connect DB + Start Server
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB Error:", err);
  });