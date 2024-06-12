const cloudinary = require('../../config/cloud');
const { sendError } = require('../../helpers/error');
const User = require('../../models/auth/user');

exports.joinEvent = async (req, res) => {
  const { formId, response } = req;
  const user = await User.findById(req.user._id);

  const form = await Event.findById(formId).populate('fields');
  if (!form) sendError(res, 404, 'Form not found');

  const fieldResponses = {};
  for (const field of form.fields) {
    if (responses[field._id]) {
      fieldResponses[field._id] = responses[field._id];
    } else if (field.required) {
      return sendError(
        res,
        400,
        `Required fields missing for required field: ${field.label}`
      );
    }
  }

  const newResponse = new FormResponse({
    form: formId,
    response,
    user: userId,
  });

  await newResponse.save();

  res.json({ response: newResponse });
};
