const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  score: {
    type: Number,
    required: true
  },
  quizTitle: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true
  },
  timeTaken: {
    type: String, 
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  questions: [
    {
      questionText: String,
      options: [
        {
          text: String,
          isCorrect: Boolean
        }
      ],
      selectedOptions: [Number]
    }
  ]
});

module.exports = mongoose.model('Attempt', attemptSchema);
