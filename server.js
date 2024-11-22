const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const userRoutes = require('./routes/userRoutes'); // Add user routes if applicable
const errorHandler = require('./middleware/errorHandler'); // Error handling middleware
const chatRoutes = require('./routes/chatRoutes'); // Add user routes if applicable
require('dotenv').config();

// Set up Express
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from the 'uploads' directory (if your app has file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', chatRoutes);

// Use the routes
app.use('/api/notes', noteRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes); // Use the user routes for managing users

// Default route for undefined paths
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Error handling middleware should be placed after all routes
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
