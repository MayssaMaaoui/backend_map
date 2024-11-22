const Feedback = require('../models/feedback');

// Function to handle feedback submission
const submitFeedback = async (req, res) => {
  const { rating, feedback } = req.body;

  if (!rating || !feedback) {
    return res.status(400).json({ message: "Rating and feedback are required." });
  }

  try {
    const newFeedback = new Feedback({
      rating,
      feedback
    });

    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving feedback: ' + err.message });
  }
};
const getFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find();
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feedback', error });
    }
  };
  
module.exports = { submitFeedback , getFeedback};
