import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js';
import listingRouter from './routes/listing.route.js'
import cors from "cors";
 

dotenv.config();


 mongoose.connect(process.env.MONGO).then(()=> {
   console.log('Database is Connected');
 }).catch((err) => {
   console.log(err);
 })

 
const app = express ();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
     "https://mern-estate-app-puce.vercel.app",
     "https://mern-estate-app-jv7n.vercel.app"
    ],
    credentials: true,
  })
);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter); 
app.use('/api/listing', listingRouter )
 
app.use((err, req, res, next ) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || "Internal Server Error";
   return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
   });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;