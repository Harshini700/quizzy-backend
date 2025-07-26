const Quiz = require('../models/QuizModels');

const getUserQuestions = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing from request' });
    }

    const userQuizzes = await Quiz.find({ userId });
    const allQuestions = userQuizzes?.flatMap((quiz) =>
      quiz?.questions?.map((question, index) => ({
        _id: question?._id || `${quiz?._id}-${index}`,
        questionText: question?.questionText,
        questionType: question?.questionType,
        options: question?.options,
        maxSelectableOptions: question?.maxSelectableOptions,
        quizId: quiz?._id,
        quizTitle: quiz?.title,
        index,
      })) || []
    ) || [];

    res.status(200).json(allQuestions);
  } catch (err) {
    console.error('Error fetching user questions:', err);
    res.status(500).json({ message: 'Failed to get questions', error: err?.message });
  }
};

module.exports = { getUserQuestions };
