const cron = require('node-cron');
const { sendEmail } = require('./emailHandler');
const eventModel = require('../models/event-model');

const notificationJob = cron.schedule('* * * * *', async () => {
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);

  try {
    const upcomingEvents = await eventModel.find({
      start: { $gte: now, $lte: fiveMinutesLater },
      notification: true
    }).populate('user');

    if (upcomingEvents.length === 0) {
      return;
    }

    for (const event of upcomingEvents) {
      try {
        await sendEmail(
          event.user.email, 
          `⏰ Reminder: Your Upcoming Event - “${event.title}” is Starting Soon!`, 
          `Hello ${event.user.username || 'User'},
      
          This is a friendly reminder that your event titled "${event.title}" is scheduled to start in 5 minutes.
      
          Here are the details:
          - Event: ${event.title}
          - Description: ${event.description || "No description provided"}
          - Start Time: ${new Date(event.start).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}
          - End Time: ${new Date(event.end).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}
      
          We hope you have a productive and successful event. 
          Please let us know if you need any further assistance.
      
          Warm regards,  
          The Calendar App Team`
        );
        event.notification = false;

        await event.save();
      } catch (emailError) {
        console.error(`Failed to send email to ${event.user.email} for event "${event.title}":`, emailError);
      }
    }
  } catch (dbError) {
    console.error('Error fetching upcoming events from the database:', dbError);
  }
});

notificationJob.start();

module.exports = { notificationJob };