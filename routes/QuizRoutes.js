const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const Quiz=require('../models/QuizModels')

const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/QuizController');

const router = express.Router();

router.use(verifyToken);

router.get('/my', verifyToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/',verifyToken, createQuiz);
router.get('/',verifyToken, getAllQuizzes);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);


module.exports = router;
