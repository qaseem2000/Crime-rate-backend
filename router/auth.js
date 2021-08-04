const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
//const Joi = require('joi');
const jwt = require("jsonwebtoken");
//const { Mongoose } = require('mongoose');


const cors = require('cors')

router.post("/", cors(), async (req, res) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: "Invalid pass or email" });
  await bcrypt
    .compare(req.body.password, user.password)
    .then((validpassword) => {
      if (validpassword) {
        res.status(200).send("logged In successfully");
        console.log(1111);
        const token = user.generateAuthToken();
        //const token = jwt.sign({_id:user._id, userType:user.userType},"QWERTY");
        //console.log(token);
        res
          .header("x-auth-token", token)
          .status(200)
          .send({ token: token, email: user.email, name: user.username });
      } else {
        res.status(400).send({ message: "Invalid email or password" });
      }
    })
    .catch((errors) => {
      return res.status(400).send(errors);
    });
});

module.exports = router;
