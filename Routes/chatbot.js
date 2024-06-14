const express = require('express');
const router = express.Router();

// Define route handler for chatbot
router.post('/', (req, res) => {
  // Get the user message from the request body
  const { message } = req.body;

  // Check if the message is "user" and return user ID
  if (message.toLowerCase() === 'user') {
    // Here you would implement the logic to retrieve the user ID
    const userId = '12311'; // Example user ID

    // Send the user ID as response
    return res.json({ message: `User ID: ${userId}` });
  }

  // Handle other messages
  return res.json({ message: 'Invalid command' });
});

module.exports = router;
