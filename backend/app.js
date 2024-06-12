require('express-async-errors');
require('dotenv').config();
require('./config/db');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { sendError } = require('./helpers/error');
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event/form');
const categoryRouter = require('./routes/event/category');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));

app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
app.use('/api/category', categoryRouter);

app.use((err, req, res, next) => {
  sendError(res, 500, err.message);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('port is listening on ' + PORT);
});
