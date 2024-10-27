const userModel = require("../models/user-model");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, username } = req.body;

    let already = await userModel.findOne({ email: email });
    if (already) {
      return res.json({ message: "User Already Registered" });
    }

    // Hash the password using await
    const saltRounds = 10;
    const hash = await bcryptjs.hash(password, saltRounds);

    // Create the user with the hashed password
    const user = await userModel.create({
      email,
      password: hash,
      username,
    });

    // Generate a token for the user
    const token = generateToken(user);

    // Set the token as a cookie
    res.cookie("token", token);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async function (req, res) {
  const { password, email } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid Email or Password" });
    }

    // Generate token and send in cookie
    let token = generateToken(user);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
    });
    return res.status(200).json({ message: "Logged in Successfully", token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

module.exports.logout = async function (req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged Out Successfully" });
};
