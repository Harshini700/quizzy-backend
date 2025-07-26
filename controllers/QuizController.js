const Quiz = require('../models/QuizModels');

const createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz({
      title: req?.body?.title,
      questions: req?.body?.questions,
      userId: req?.user?.id,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req?.user?.id });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req?.params?.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    if (quiz?.userId?.toString() !== req?.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req?.params?.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    if (quiz?.userId?.toString() !== req?.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    quiz.title = req?.body?.title || quiz.title;
    quiz.questions = req?.body?.questions || quiz.questions;

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req?.params?.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    if (quiz?.userId?.toString() !== req?.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
