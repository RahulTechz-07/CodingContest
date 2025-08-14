import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // ✅ Needed for Socket.io server
import { Server } from 'socket.io'; // ✅ Socket.io
import leaderboardRoute from './routes/leaderboard.js';

// Routes
import submissionRoutes from './routes/submission.js';
import problemRoutes from './routes/problem.js';
import runRoute from './routes/run.js';
import userRoutes from './routes/user.js';
import checkUser from './routes/check-user.js';

dotenv.config();
const app = express();
const server = http.createServer(app); // ✅ Create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/submit', submissionRoutes(io)); // ✅ Pass `io` to submission route
app.use('/api/problems', problemRoutes);
app.use('/api/run', runRoute);
app.use('/api', userRoutes);
app.use('/api', checkUser);
app.use('/api/leaderboard', leaderboardRoute);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 🟢 Optional: Handle new socket connection
io.on("connection", (socket) => {
  console.log(`🧠 New client connected: ${socket.id}`);
});
