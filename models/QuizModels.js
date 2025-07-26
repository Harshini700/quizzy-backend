const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [optionSchema],
  type: String,
  maxSelectable: Number,
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: Array,
  createdAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
module.exports = mongoose.model('Quiz', quizSchema);
