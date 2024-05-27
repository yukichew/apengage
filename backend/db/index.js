const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('db connection successful'))
  .catch((err) => console.log('db connection failed', err.message || err));
