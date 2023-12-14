const express = require('express');

const user_route = express();

user_route.set('views','./views/user')

const userController = require('../controller/userController');



//signup
user_route.get('/',userController.loadRegister);

user_route.post('/',userController.insertUser);

//verifyOtp
user_route.get('/verify',userController.loadOtp)

user_route.post('/verify',userController.verifyOtp);

//Resend Otp

user_route.get('/resendOTP',userController.resendOtp)



//Login
user_route.get('/login',userController.Login);

user_route.post('/login',userController.userLogin);

//Forget password

user_route.get('/forgetOtp',userController.forgetPassword)
user_route.post('/forgetOtp',userController.emailForgetPassword)
user_route.post('/verifyOtp',userController.forgetVerifyOtp)

//Update password

user_route.post('/updatePassword',userController.updatePassword);
 

//Home
user_route.get('/home',userController.loadHome);

//Shop
user_route.get('/shop',userController.loadShop);

//Product Detail
user_route.get('/productDetail',userController.productDetail);

//Cart
user_route.get('/cart',userController.loadCart)

//User Profile

user_route.get('/user-profile',userController.loadProfile)

user_route.post('/changePassword',userController.changePassword)

//Add to Cart

user_route.post('/addToCart',userController.addToCart)


module.exports = user_route;