const { validationResult } = require('express-validator');
const { sendError } = require('../../helpers/error');

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return sendError(res, 400, error[0].msg);
  }
  next();
};
