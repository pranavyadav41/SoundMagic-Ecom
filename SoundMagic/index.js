const mongoose = require("mongoose");
const session = require('express-session');
mongoose.connect("mongodb://127.0.0.1:27017/SoundMagic");
const path = require("path");


const express = require("express");
const nodemailer = require("nodemailer")
const config = require("./config/config")

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine','ejs');
app.set('views','./views');
//Nocache
const nocache = require("nocache");
app.use(nocache());

//session storage
app.use(session({
  secret:config.generateRandomString(32),
  resave: false,
  saveUninitialized: true,
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

//for user routes
const user_route = require('./routes/userRoute');
app.use('/',user_route);

//for admin routes
const admin_route = require('./routes/adminRoute');
app.use('/admin',admin_route)



app.listen(3000, function () {
  console.log("server is running on port http://localhost:3000");
});