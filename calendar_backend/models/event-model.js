const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    description: { type: String },
    start: { type: Date, required: true },
    end: {
        type: Date, 
        required: true
      },
    notification: { type: Boolean, default: false }
});


const Event = mongoose.model('event', eventSchema);

module.exports = Event;