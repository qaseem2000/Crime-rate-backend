const jwt = require("jsonwebtoken");
const config=require('config')

//middleware function get request , and process and return response....
module.exports=function(req,res,next){//next use for jump to the next middleware function
    const token=req.header('x-auth-token');
    if(!token) return res.status(401).send("Access deninde token not provided");
    
    try{
        const decoded=jwt.verify(token,"qaseem")
        req.user=decoded;
        next(); 
    }
    catch(ex){
        res.status(400).send("Invalid token")
    }


}