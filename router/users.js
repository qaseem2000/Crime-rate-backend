const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  //const {error}=validate(req.body);
  //if(error) return res.status(400).send(error.details[0].message);
// temp
  res.setHeader("Access-Control-Allow-Origin", "*")
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Max-Age", "1800");
res.setHeader("Access-Control-Allow-Headers", "content-type");
res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already register");

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    
  });
  const salt = await bcrypt.genSalt(10); //generate a key
  user.password = await bcrypt.hash(user.password, salt);
  result = await user.save();
  const token = user.generateAuthToken();
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 50000),
    httpOnly: true,
  });
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "userType"]));

  res.status(200).send(result);
});

router.get("/userdetail", [auth], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

module.exports = router;
