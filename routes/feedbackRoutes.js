const express = require('express');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');

const router = express.Router();

// POST route for submitting feedback
router.post('/submit-feedback', submitFeedback);
router.get('/', getFeedback);

module.exports = router;
