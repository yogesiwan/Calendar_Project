const path = require("path");
const express = require('express');
require("dotenv").config();
const PORT = process.env.PORT || 6010;
const notificationJob  = require('./utils/notificationHandler');
const axios = require("axios");
const app = express();
// const path = require("path");
const cors = require('cors');

app.use(cors({
    origin:   process.env.CORS_ORIGIN,
    credentials: true, 
}));

//Firebase setup
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
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

// Keep-alive endpoint
app.get("/keep-alive", (req, res) => {
    res.status(200).send("Server is active");
  });
  setInterval(async () => {
    try {
      await axios.get("https://calendar-project.onrender.com/keep-alive");
      console.log("Pinged the server to keep it alive");
    } catch (error) {
      console.error("Error pinging server:", error.message);
    }
  }, 7 * 60 * 1000); 


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

