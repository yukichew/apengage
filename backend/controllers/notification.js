const { sendError } = require('../helpers/error');
const Form = require('../models/event/form');
const Registration = require('../models/event/registration');
const Notification = require('../models/notification');
const Event = require('../models/event');
const admin = require('firebase-admin');

exports.notifyParticipants = async (req, res) => {
  try {
    // Step 1: Find upcoming events that are approved
    const upcomingEvents = await Event.find({
      endTime: { $gte: new Date() },
      status: 'Approved',
    });

    // Step 2: Loop through each event
    for (const event of upcomingEvents) {
      // Find all forms associated with this event
      const eventForms = await Form.find({ event: event._id });

      // Step 3: Loop through each form to get the registrations
      for (const form of eventForms) {
        const registrations = await Registration.find({
          eventForm: form._id,
        }).populate('participant');

        // Step 4: Loop through each registration
        for (const registration of registrations) {
          const participant = registration.participant;
          const deadline = new Date(form.deadline);
          const timeRemaining = deadline.getTime() - new Date().getTime();

          // Step 5: Check if the deadline is within 24 hours
          if (timeRemaining <= 24 * 60 * 60 * 1000) {
            const message = `The registration deadline for ${event.name} is approaching! Please complete your registration soon.`;

            // Save notification to database
            await Notification.create({
              event: event._id,
              user: participant._id,
              message,
              status: 'Pending',
            });

            // Step 6: Send push notification if the participant has an FCM token
            if (participant.fcmToken) {
              const payload = {
                notification: {
                  title: 'Event Registration Deadline',
                  body: message,
                },
              };

              // Send notification to device
              await admin
                .messaging()
                .sendToDevice(participant.fcmToken, payload);
            }
          }
        }
      }
    }

    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (err) {
    sendError(res, 500, 'An error occurred while sending notifications.');
  }
};
