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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

 
app.listen(3000, () => {
   console.log('Server is running on Port 3000');
}
); 

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