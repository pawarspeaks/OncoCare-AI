import express from 'express';
import cors from 'cors';
import UserRouter from "./Routes/UserRouter.js";
import HospitalRouter from "./Routes/HospitalRouter.js";
import AdminRouter from "./Routes/AdminRouter.js";
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './data/db.js';

config();

const app = express();

// Connect to databases
// connectDBAdmin();
// connectDBUser();
connectDB();

app.use(cookieParser());
app.use(cors({
  origin: process.env.AVAILABLE_ORIGINS.split(", "),
  credentials: true,
}));
app.use(express.json());

app.use("/users", UserRouter);
app.use("/hospitals", HospitalRouter);
app.use("/admins", AdminRouter);

app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.listen(3001, () => {
  console.log('Listening at port 3001');
});