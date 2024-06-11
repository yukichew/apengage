exports.sendError = (res, status, error) => {
  return res.status(status).json({ error });
};
