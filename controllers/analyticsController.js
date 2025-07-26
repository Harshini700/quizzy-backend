const Attempt = require('../models/Attempt');
const Quiz = require('../models/QuizModels');

const getSummary = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(400).json({ error: 'User ID not found' });
    const quizzes = await Quiz.find({ userId });
    const quizIds = quizzes.map(q => q?._id);

    if (quizIds.length === 0) {
      return res.json({
        averageScore: 0,
        totalAttempts: 0,
        averageTimeSpent: 0,
        passCount: 0,
        failCount: 0,
        responseByDate: [],
        topScores: [],
        participants: [],
        quizSummary: { count: 0, titles: [] }
      });
    }

    const attempts = await Attempt.find({ quizId: { $in: quizIds } });

    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((a, b) => a + (b?.score || 0), 0);
    const totalTime = attempts.reduce((a, b) => a + (b?.timeTaken || 0), 0); 

    const averageScore = totalAttempts ? totalScore / totalAttempts : 0;
    const averageTimeSpent = totalAttempts ? totalTime / totalAttempts : 0;

    const passCount = attempts.filter(a => a?.status === 'Pass').length; 
    const failCount = attempts.filter(a => a?.status === 'Fail').length; 

    const grouped = await Attempt.aggregate([
      { $match: { quizId: { $in: quizIds } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    const responseByDate = grouped.map(g => ({ date: g?._id, count: g?.count })); 

    const topScores = attempts
      .filter(a => a?.name && typeof a?.score === 'number')
      .sort((a, b) => b?.score - a?.score)
      .slice(0, 5)
      .map(a => ({
        name: a?.name,
        email: a?.email,
        phone: a?.phone || 'N/A',
        score: a?.score
      }));

    const participants = attempts
      .filter(a => a?.name && a?.email)
      .slice(0, 10)
      .map(a => ({
        name: a?.name,
        email: a?.email,
        phone: a?.phone || 'N/A'
      }));

    const quizSummary = {
      count: quizzes.length,
      titles: quizzes.map(q => q?.title) 
    };

    res.json({
      averageScore,
      totalAttempts,
      averageTimeSpent,
      passCount,
      failCount,
      responseByDate,
      topScores,
      participants,
      quizSummary
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSummary };
