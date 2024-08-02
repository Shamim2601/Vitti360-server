const mongoose = require('mongoose');

const TutionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor', // Reference to the Tutor model
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  guardianNumber: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  remuneration: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true
  },
  medium: {
    type: String,
    enum: ['English', 'Bengali', 'Others'], // Adjust as needed
    required: true
  }
}, {
  timestamps: true // Optional: adds createdAt and updatedAt fields
});

const Tution = mongoose.model('Tution', TutionSchema);

module.exports = Tution;
