const express = require('express');
const router = express.Router();
const Tutor = require('./models/Tutor'); // Make sure the path is correct

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
    const tags = ['bangla', 'english', 'science', 'history', 'religion', 'math', 'IQ', 'other'];
    const randomCategory = tags[Math.floor(Math.random() * tags.length)];

    const category = req.query.category || randomCategory;
    const questionId = req.query.id;

    let questions;
    if (questionId) {
      const question = await Question.findOne({ id: questionId });
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      questions = [question];
    } else {
      questions = await Question.find({ category }).sort({ id: 1 });
    }

    res.json({ questions, category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /tutors route
router.get('/tutors', async (req, res) => {
  try {
    const req_tag = req.query.tag || 'all';
    const searchQuery = req.query.query;
    const tags = ['buet', 'du', 'medical', 'cadet'];
    let data;

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      data = await Tutor.find({
        $or: [
          { name: searchRegex },
          { pref: searchRegex },
          { institution: searchRegex },
          { dept: searchRegex },
          { college: searchRegex },
          { expertise: searchRegex }
        ]
      }).sort({ rating: -1, id: 1 });
    } else if (req_tag !== 'all') {
      data = await Tutor.find({ tag: req_tag }).sort({ rating: -1, id: 1 });
    } else {
      data = await Tutor.find({ tag: { $in: tags } }).sort({ tag: 1, rating: -1, id: 1 });
    }

    res.json({ data, currentTag: req_tag, searchQuery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
