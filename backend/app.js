require('express-async-errors');
require('dotenv').config();
require('./config/db');
require('./helpers/schedule');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { sendError } = require('./helpers/error');
const userRouter = require('./routes/auth/user');
const eventRouter = require('./routes/event');
const categoryRouter = require('./routes/event/category');
const formRouter = require('./routes/event/form');
const venueRouter = require('./routes/logistic/venue');
const adminRouter = require('./routes/auth/admin');
const facilityRouter = require('./routes/logistic/facility');
const transportRouter = require('./routes/logistic/transport');
const feedbackRouter = require('./routes/event/feedback');
const dashboardRouter = require('./routes/dashboard');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://192.168.100.111:3000' }));
app.use(morgan('dev'));

app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
app.use('/api/category', categoryRouter);
app.use('/api/venue', venueRouter);
app.use('/api/admin', adminRouter);
app.use('/api/facility', facilityRouter);
app.use('/api/transport', transportRouter);
app.use('/api/form', formRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/dashboard', dashboardRouter);

app.use((err, req, res, next) => {
  sendError(res, 500, err.message);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('port is listening on ' + PORT);
});
