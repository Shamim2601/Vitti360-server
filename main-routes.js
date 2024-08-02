const express = require('express');
const router = express.Router();

// Define routes
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

module.exports = router;
