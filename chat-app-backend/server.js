const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory user storage
const onlineUsers = new Map();

// Endpoint to handle login
app.post('/api/login', (req, res) => {
  const { username } = req.body;

  // Check if the username is already taken
  const isTaken = Array.from(onlineUsers.values()).some(user => user.name === username);
  if (isTaken) {
    return res.status(400).json({ message: 'Username is already taken.' });
  }

  const user = { id: `user-${Date.now()}`, name: username };
  res.status(200).json(user);
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user login and store their data
  socket.on('user-login', (user) => {
    onlineUsers.set(socket.id, user);
    io.emit('online-users', Array.from(onlineUsers.values()));
  });

  // Handle global messaging
  socket.on('global-message', (msg) => {
    io.emit('global-message', msg); // Broadcast the message to all clients
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
