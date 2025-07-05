import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './backend/src/routes/authroute.js';
import messageRoutes from './backend/src/routes/messageroute.js';
import { connectDB } from './backend/src/lib/db.js';
import { app, server } from './backend/src/lib/socket.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? [process.env.CLIENT_URL, "https://*.onrender.com"] 
    : "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running in development mode');
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  connectDB();
});