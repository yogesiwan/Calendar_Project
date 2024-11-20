const express = require('express');
const router = express.Router(); 
const {registerUser, loginUser, logout, googleLogin} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/google-login", googleLogin);

module.exports = router;
