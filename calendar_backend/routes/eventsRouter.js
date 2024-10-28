const express = require('express');
const router = express.Router();
const { createEvent, getEvents, updateEvent, deleteEvent, eventNotify } = require('../controllers/eventController');
const  isLoggedIn  = require('../middlewares/isLoggedIn'); 

router.get('/', isLoggedIn, getEvents);
router.post('/create', isLoggedIn, createEvent);
router.put('/update/:id', isLoggedIn, updateEvent);
router.delete('/delete/:id', isLoggedIn, deleteEvent);
router.post('/notification/:id', isLoggedIn, eventNotify);
module.exports = router;