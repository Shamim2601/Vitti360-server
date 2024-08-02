const express = require('express');
const router = express.Router();
const Question = require('./models/Question'); // Make sure the path is correct

// Define other routes
router.get('/', (req, res) => {
  res.send('Hello, Vercel from main routes!');
});

router.get('/about', (req, res) => {
  res.send('About Page');
});

router.get('/contact', (req, res) => {
  res.send('Contact Page');
});

router.post('/data', (req, res) => {
  console.log(req.body);
  res.send('Data received');
});

// GET /jiggasa route
router.get('/jiggasa', async (req, res) => {
  try {
    // Define your tags
    const tags = ['bangla', 'english', 'science', 'history', 'religion', 'math', 'IQ', 'other'];

    // Select a random tag from the tags array
    const randomCategory = tags[Math.floor(Math.random() * tags.length)];

    const category = req.query.category || randomCategory;
    const questionId = req.query.id;

    let questions;
    if (questionId) {
      // Find the question by the custom 'id' field
      const question = await Question.findOne({ id: questionId });

      // Check if the question was found
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      questions = [question];
    } else {
      // Find questions by category
      questions = await Question.find({ category }).sort({ id: 1 });
    }

    res.json({
      questions,
      category,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
