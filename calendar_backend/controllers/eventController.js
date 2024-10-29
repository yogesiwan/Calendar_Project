const eventModel = require("../models/event-model");

module.exports.createEvent = async (req, res) => {
  try {
    const { title, description, start, end } = req.body;

    const event = await eventModel.create({
      user: req.user._id, // by help of isLoggedIn middleware
      title,
      description,
      start,
      end,
    });
    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ err });
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

    const event = await eventModel.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        start,
        end,
        notification,
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
