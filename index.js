const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const users = require('./router/users');
const auth = require('./router/auth');
const cors= require('cors');

const app=express();

console.log(`Enviorment: ${process.env.NoDE_ENV}`);

mongoose.connect(config.connectionstring,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    serverSelectionTimeoutMS: 3000
  })
    .then(()=>{console.log("Connect to database")})
    .catch(()=>{console.error("Error connecting database")});



app.use(express.json());
app.options('*', cors()) ;
app.use(cors());

app.use('/api/users',users);
app.use('/api/auth',auth);


const port =process.env.PORT || 4001;
app.listen(port,()=>console.log(`listening on port ${port}`));