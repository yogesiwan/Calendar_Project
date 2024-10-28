const express = require('express');
require("dotenv").config();
const PORT = process.env.PORT || 6010;
const notificationJob  = require('./utils/notificationHandler');
const app = express();

const cors = require('cors');

app.use(cors({
    origin:   process.env.CORS_ORIGIN,
    credentials: true, 
}));

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash  = require("connect-flash");

// Routes Require
const usersRouter = require('./routes/usersRouter');
const eventsRouter = require("./routes/eventsRouter");

// Database require
const db = require("./config/mongoose-connection");

// Setups
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);

app.use(flash());

app.use('/users', usersRouter);
app.use('/events', eventsRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

