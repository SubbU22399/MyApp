const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const uploadRouter = require('./routes/upload');

// Initialize environment variables
dotenv.config();

// Initialize app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/upload', uploadRouter);

// Online users map
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user login
  socket.on('user-login', (user) => {
    onlineUsers.set(socket.id, user);
    io.emit('online-users', Array.from(onlineUsers.values()));
  });

  // Handle global chat messages
  socket.on('global-message', (message) => {
    io.emit('global-message', message);
  });

  // Handle private messages
  socket.on('private-message', ({ room, message }) => {
    socket.to(room).emit('private-message', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('online-users', Array.from(onlineUsers.values()));
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
