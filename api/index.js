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

// root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// DB connect function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
};

connectDB();

export default app;