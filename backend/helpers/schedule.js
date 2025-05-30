const cron = require('node-cron');
const Event = require('../models/event');
const Registration = require('../models/event/registration');
const EventForm = require('../models/event/form');

cron.schedule('*/1 * * * *', async () => {
  try {
    const now = new Date();
    await Event.updateMany(
      { endTime: { $lt: now }, status: { $ne: 'Past' } },
      { $set: { status: 'Past' } }
    );
    console.log('Event statuses updated to "Past"');

    const eventsToUpdate = await Event.find({
      endTime: { $lt: new Date(now.getTime() - 60 * 60 * 1000) },
    });

    for (const event of eventsToUpdate) {
      const eventForm = await EventForm.findOne({ event: event._id });
      if (!eventForm) {
        continue;
      }
      await Registration.updateMany(
        {
          eventForm: eventForm._id,
          status: 'Upcoming',
        },
        { $set: { status: 'Absent' } }
      );
    }
    console.log('Registration statuses updated to "Absent" where applicable');
  } catch (error) {
    console.error('Error updating event statuses:', error);
  }
});
