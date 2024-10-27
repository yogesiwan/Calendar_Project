require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        // console.log('server on render');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });

module.exports = mongoose.connection;

