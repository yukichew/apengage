const Feedback = require('../../models/event/feedback');

exports.createFeedback = async (req, res) => {
  const { registration, comment, rating } = req.body;

  const feedback = await Feedback.findOne({ registration });
  if (feedback) {
    return res.status(400).json({ error: 'You have already given feedback' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const newFeedback = new Feedback({
    registration,
    comment,
    rating,
  });

  await newFeedback.save();

  res.json({
    feedback: {
      id: newFeedback._id,
      registration: newFeedback.registration,
      comment: newFeedback.comment,
      rating: newFeedback.rating,
    },
  });
};
