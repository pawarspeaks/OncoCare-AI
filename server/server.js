import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './data/db.js';
import UserRouter from './Routes/UserRouter.js';
import HospitalRouter from './Routes/HospitalRouter.js';
import AdminRouter from './Routes/AdminRouter.js';

config();

const app = express();

// Connect to the database
connectDB();

app.use(cookieParser());
app.use(cors({
  origin: process.env.AVAILABLE_ORIGINS.split(", "),
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/users", UserRouter);
app.use("/hospitals", HospitalRouter);
app.use("/admins", AdminRouter);

// Route handler for /chatbot endpoint
app.post('/chatbot', (req, res) => {
  const { userId } = req.body; // Extract user ID from the request body
  const greetingMessage = `Hello, User ${userId}!`; // Example greeting message
  res.json({ message: greetingMessage });
});

// New endpoint to handle sending messages
app.post('/users/sendmessage/:userId', (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  console.log('Received message:', message, 'for userId:', userId);

  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }

  try {
    const responseMessage = `Processed message: ${message}`;
    res.json({ message: responseMessage });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Start server
app.listen(3001, () => {
  console.log('Listening at port 3001');
});
