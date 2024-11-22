const Message = require('../models/message');

// Fetch chat messages between a user and admin
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const adminId = "673a12d87855487d442e278b"; // Replace with the actual admin user ID

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: adminId },
        { sender: adminId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Send a new message
// Send a new message
exports.sendMessage = async (req, res) => {
    const { content, sender, receiver } = req.body;
  
    try {
      const newMessage = new Message({ 
        content, 
        sender, 
        receiver, 
        status: 'sent', // Initially set to 'sent'
      });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (err) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  };
  // Mark a message as seen
exports.markAsSeen = async (req, res) => {
    const { messageId } = req.params; // Get the message ID from the request
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { status: 'seen' }, // Update the status to 'seen'
        { new: true } // Return the updated message
      );
  
      if (!updatedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.status(200).json(updatedMessage);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update message status' });
    }
  };
  