const cron = require('node-cron');
const Event = require('../models/event');

cron.schedule('*/30 * * * *', async () => {
  try {
    const now = new Date();
    await Event.updateMany(
      { endTime: { $lt: now }, status: { $ne: 'Past' } },
      { $set: { status: 'Past' } }
    );
    console.log('Event statuses updated to "Past"');
  } catch (error) {
    console.error('Error updating event statuses:', error);
  }
});
