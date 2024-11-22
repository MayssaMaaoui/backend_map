// models/feedback.js

const mongoose = require('mongoose');

// Define the Feedback schema
const feedbackSchema = new mongoose.Schema({
  rating: Number, // Rating out of 5
  feedback: String, // Feedback text
  createdAt: { type: Date, default: Date.now } // Automatically sets the current timestamp
});

// Create and export the Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
