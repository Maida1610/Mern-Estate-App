import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://mern-estate-app-puce.vercel.app",
      "https://mern-estate-app-jv7n.vercel.app",
    ],
    credentials: true,
  })
);

// routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// DB
mongoose.connect(process.env.MONGO).then(() => {
  console.log("DB connected");
});

export default app; // ✅ only this