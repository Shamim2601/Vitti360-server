const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  // Add other fields as necessary
});

module.exports = mongoose.model('Question', QuestionSchema);
