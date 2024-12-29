const { sendError } = require('../../helpers/error');
const Feedback = require('../../models/event/feedback');
const Form = require('../../models/event/form');
const Registration = require('../../models/event/registration');

exports.createFeedback = async (req, res) => {
  const { registration, comment, rating } = req.body;

  const feedback = await Feedback.findOne({ registration });
  if (feedback) {
    return sendError(res, 400, 'Feedback already exists for this registration');
  }

  if (!rating || rating < 1 || rating > 5) {
    return sendError(res, 400, 'Rating must be between 1 and 5');
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

exports.getFeedbackForEvent = async (req, res) => {
  const { id } = req.params;
  const eventForm = await Form.findOne({ event: id });
  if (!eventForm) {
    return sendError(res, 404, 'Event form not found');
  }

  const registrations = await Registration.find({ eventForm: eventForm._id });
  const registrationIds = registrations.map((registration) => registration._id);

  const feedbacks = await Feedback.find({
    registration: { $in: registrationIds },
  }).populate({
    path: 'registration',
    populate: { path: 'participant', select: 'name email' },
  });

  const totalRating = feedbacks.reduce(
    (sum, feedback) => sum + feedback.rating,
    0
  );
  const averageRating = feedbacks.length ? totalRating / feedbacks.length : 0;

  res.json({
    feedbacks: feedbacks.map((feedback) => {
      return {
        id: feedback._id,
        registration: feedback.registration._id,
        createdBy: feedback.registration.participant,
        rating: feedback.rating,
        comment: feedback.comment,
      };
    }),
    averageRating,
  });
};
