const path = require('path');
const { spawn } = require('child_process');
const { sendError } = require('../../helpers/error');

const checkForLogo = async (imagePath) => {
  return new Promise((resolve, reject) => {
    const logoPath = path.resolve(__dirname, 'apu.png');
    const scriptPath = path.join(__dirname, 'logoDetection.py');
    const pythonProcess = spawn('python3', [scriptPath, logoPath, imagePath]);

    let logoDetected = false;

    pythonProcess.stdout.on('data', (chunk) => {
      logoDetected = chunk.toString().trim() === 'True';
    });

    pythonProcess.stderr.on('data', (error) => {
      reject(error.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}`);
      }

      resolve(logoDetected);
    });
  });
};

exports.isLogoExist = async (req, res, next) => {
  const hasLogo = await checkForLogo(req.file.path);
  if (!hasLogo) return sendError(res, 401, 'Poster must include the APU logo!');
  next();
};