const Attempt = require('../models/Attempt');
const Quiz = require('../models/QuizModels');

const getAttemptsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;
    const attempts = await Attempt.find({ quizId }).sort({ submittedAt: -1 });
    res.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
};

const deleteAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findByIdAndDelete(attemptId);

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    res.json({ message: 'Attempt deleted successfully' });
  } catch (error) {
    console.error('Error deleting attempt:', error);
    res.status(500).json({ error: 'Failed to delete attempt' });
  }
};

const submit = async (req, res) => {
  try {
    const { name, email, phone, title, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(req.params?.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let score = 0;

    const questions = quiz.questions?.map((q, index) => {
      const correctIndexes = q?.options
        ?.map((opt, i) => (opt?.isCorrect ? i : null))
        ?.filter(i => i !== null) || [];

      const selected = answers?.[index] || [];

      const isCorrect =
        selected.length === correctIndexes.length &&
        selected.every(i => correctIndexes.includes(i));

      if (isCorrect) score++;

      return {
        questionText: q?.questionText,
        options: q?.options,
        selectedOptions: selected
      };
    }) || [];

    const passed = score >= Math.ceil(quiz.questions?.length * 0.5 || 0);

    const attempt = new Attempt({
      quizId: quiz?._id,
      userId: req.user?._id,
      name,
      email,
      phone,
      score,
      quizTitle: title,
      totalQuestions: quiz.questions?.length || 0,
      passed,
      status: passed ? 'Pass' : 'Fail',
      timeTaken,
      submittedAt: new Date(),
      questions
    });

    await attempt.save();

    res.status(200).json({ message: "Quiz submitted", score, passed });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

module.exports = { deleteAttempt, getAttemptsByQuizId, submit };
