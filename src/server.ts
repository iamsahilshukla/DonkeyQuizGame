// src/server.ts
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app';
import { initializeGameSocket } from './sockets/game.socket';
import { connectDB } from './config/db';

dotenv.config();
const PORT = process.env.PORT;
const server = http.createServer(app);

// Database connection
connectDB();

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initializeGameSocket(io);

// setInterval(() => sessionService.cleanupInactiveSessions(), 3600000); // Every hour

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
