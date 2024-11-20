const eventModel = require("../models/event-model");

const checkOverlappingEvent = async (userId, startDate, endDate, excludeEventId = null) => {
  const query = {
    user: userId,
    $or: [
      { start: { $lt: endDate }, end: { $gt: startDate } }, // Overlapping range
      { start: { $gte: startDate, $lt: endDate } }, // Starts within the range
      { end: { $gt: startDate, $lte: endDate } }, // Ends within the range
    ],
  };

  // Exclude a specific event (useful for update scenarios)
  if (excludeEventId) {
    query._id = { $ne: excludeEventId };
  }

  return await eventModel.findOne(query);
};

module.exports.createEvent = async (req, res) => {
  try {
    const { title, description, start, end } = req.body;

    // Parse the start and end dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check for overlapping events
    const overlappingEvent = await checkOverlappingEvent(req.user._id, startDate, endDate);

    if (overlappingEvent) {
      return res.json({
        overlaps: true,
        event: overlappingEvent.title,
      });
    }

    // Create the event if no overlap
    const event = await eventModel.create({
      user: req.user._id,
      title,
      description,
      start: startDate,
      end: endDate,
    });

    res.status(201).json({
      overlaps: false,
      event,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Get all events for the logged-in user
module.exports.getEvents = async (req, res) => {
  try {
    const events = await eventModel.find({ user: req.user._id });
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update an event
module.exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, start, end, notification } = req.body;

    // Parse the start and end dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check for overlapping events excluding the current event
    const overlappingEvent = await checkOverlappingEvent(req.user._id, startDate, endDate, eventId);

    if (overlappingEvent) {
      return res.json({
        overlaps: true,
        event: overlappingEvent.title,
      });
    }

    // Update the event if no overlap
    const event = await eventModel.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        start: startDate,
        end: endDate,
        notification,
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an event
module.exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await eventModel.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//events notifications
module.exports.eventNotify = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await eventModel.findById(eventId);

    if (!event) {
      return res.json({ message: "Event not found" });
    }
    if (event.notification) {
        event.notification = false;
        await event.save();
        return res.json({ notification : event.notification  });
    }
    else{
        event.notification = true;
        await event.save();
        return res.json({  notification : event.notification });
    }   
  } catch (err) {
      res.json({ message: "Error scheduling notification"});
  }
};
