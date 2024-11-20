const userModel = require("../models/user-model");
const eventModel = require("../models/event-model");

// Find user by email
module.exports.findUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Use regex to search for partial matches in both email and username
    const users = await userModel.find({
      $or: [
        { email: { $regex: email, $options: "i" } },
        { username: { $regex: email, $options: "i" } }, // Searching by username
      ],
    });


    res.status(200).json({ message: "Users found.", users });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get meetings for a user by userId
module.exports.getUserMeetings = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const events = await eventModel
      .find({ user: userId })
      .populate('user', 'username email');

    res.status(200).json({ message: "Meetings fetched successfully.", events });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

