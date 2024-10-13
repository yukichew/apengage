const { sendError } = require('../../helpers/error');
const Event = require('../../models/event/form');
const Resgistration = require('../../models/event/registration');

exports.joinEvent = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  const event = await Event.findById(id).populate('fields');
  if (!event) return sendError(res, 404, 'Event not found');

  const registration = new Resgistration({
    event,
    participant: req.user._id,
    response,
  });

  await registration.save();

  res.json({ registration });
};
