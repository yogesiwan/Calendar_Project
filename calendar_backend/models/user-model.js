const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password:{ type: String},
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
});

const User = mongoose.model('user', userSchema);

module.exports = User;



