const express = require('express');

const {deleteAttempt,getAttemptsByQuizId,submit}=require('../controllers/QuizAttempts')
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();



router.delete('/:quizId/attempts/:attemptId', deleteAttempt);
router.get('/:quizId/attempts', getAttemptsByQuizId);
router.post('/:id/submit',verifyToken,submit)

module.exports=router;