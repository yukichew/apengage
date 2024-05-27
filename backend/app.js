require('express-async-errors');
require('./db');
const express = require('express');
require('dotenv').config();

const morgan = require('morgan');

const cors = require('cors');

const { sendError } = require('./helpers/error');
const userRouter = require('./routers/user');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));

app.use('/api/user', userRouter);

app.use((err, req, res, next) => {
  sendError(res, 500, err.message);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('port is listening on ' + PORT);
});
