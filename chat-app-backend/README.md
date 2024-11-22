Let’s start with the **backend code** using **Node.js** with **Express** and **Socket.IO** to handle the chat functionality. We'll also include endpoints for uploading images and managing users.

---

### **Step 1: Initialize the Project**
Run the following commands in your terminal to set up the project:
```bash
mkdir chat-app-backend
cd chat-app-backend
npm init -y
npm install express socket.io cors body-parser multer cloudinary dotenv
npm install --save-dev nodemon
```

---

### **Step 2: Folder Structure**
Create the following structure:
```
/chat-app-backend
  ├── /uploads          # Temporary storage for images
  ├── /routes           # Express routes
  ├── /controllers      # Controller logic
  ├── server.js         # Main entry point
  ├── .env              # Environment variables
  ├── package.json      # Dependencies
```

---

### **Step 3: Write the Server Code**

#### `server.js`
```javascript
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
```

---

### **Step 4: Image Upload Endpoint**

#### `/routes/upload.js`
```javascript
const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Image upload endpoint
router.post('/', upload.single('image'), uploadImage);

module.exports = router;
```

---

#### `/controllers/uploadController.js`
```javascript
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Handle image upload
exports.uploadImage = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath);
    
    // Delete local file after upload
    fs.unlinkSync(filePath);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};
```

---

### **Step 5: .env File**
Create a `.env` file to store your Cloudinary credentials and other sensitive information.
```
PORT=5000
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

### **Step 6: Start the Server**
Add the following script to `package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Run the server:
```bash
npm run dev
```

---

### **Next Steps**
Now that the backend is set up:
1. Test the APIs using **Postman** or **cURL**.
2. Proceed with building the frontend to integrate Socket.IO and the APIs.

Would you like to implement the frontend next or focus on testing the backend?