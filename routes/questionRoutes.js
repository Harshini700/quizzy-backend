const express = require('express');
const router = express.Router();
const { getUserQuestions } = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user', authMiddleware, getUserQuestions);

module.exports = router;
