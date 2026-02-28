import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import adminRouter from './routes/adminRoute.js';
import receptionistRouter from './routes/receptionistRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import patientRouter from './routes/patientRoute.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error(err);
  });

const app = express();
const port = 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/receptionist', receptionistRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})