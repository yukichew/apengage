const multer = require('multer');

const storage = multer.diskStorage({});

const dynamicFileFilter = (allowedMimeTypes) => {
  return (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `Invalid file format! Allowed formats: ${allowedMimeTypes.join(', ')}`
        )
      );
    }
    cb(null, true);
  };
};

const createUploader = (allowedMimeTypes) =>
  multer({
    storage,
    fileFilter: dynamicFileFilter(allowedMimeTypes),
  });

const imageUploader = createUploader(['image/jpeg', 'image/png', 'image/gif']);
const fileUploader = createUploader([
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
]);

module.exports = { imageUploader, fileUploader };
