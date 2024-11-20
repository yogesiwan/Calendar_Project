const express = require('express');
const router = express.Router();
const { findUserByEmail, getUserMeetings} = require('../controllers/meetingController');
const  isLoggedIn  = require('../middlewares/isLoggedIn'); 

router.get('/users', isLoggedIn, findUserByEmail);
router.get('/:userId', isLoggedIn, getUserMeetings);
module.exports = router;



