const userModel = require("../models/user-model");
const jwt = require('jsonwebtoken');


module.exports = async function (req, res, next){
    if(!req.cookies.token){
        return res.status(400).json({ message: 'Session Expired Login again'});
    }
    try{
          let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
          let user = await userModel.findOne(({email: decoded.email})).select("-password");
          req.user = user;
          next();
    }
    catch(err){
        res.status(400).json({ message: 'something went wrong'});
    }
   
}