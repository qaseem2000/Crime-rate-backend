
//const Joi = require('joi')
const  mongoose =require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema =new mongoose.Schema({
    username:{
        type: String,
        require:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type: String,
        require:true,
        minlength:5,
        maxlength:255,
        unique :true
    },
    password:{
        type: String,
        require:true,
        minlength:5,
        maxlength:1024
    },

})



userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id, userType:this.userType},"qaseem");
    console.log(token)
    return (token);
}

const User=mongoose.model('User',userSchema);
/*
function validateUser(user){
    const schema={
        name: Joi.string().min(5).max(50).require(),
        email: Joi.string().min(5).max(255).require(),
        userType: Joi.string().min(5).max(50).require(),
        password: Joi.string().min(5).max(50).require() 
    }
    return Joi.validate(user,schema);
}*/

/*function generateAuthToken(userSchema) {
    const token = jwt.sign(
      {
        _id: this._id,
        userType:this.userType
      },
      "QWERTY"
    );
    return token;
  }
*/

exports.User =User;
//exports.validate = validateUser;