const express = require('express');

const user_route = express();

user_route.set('views','./views/user')

const userController = require('../controller/userController');
const auth = require('../middleware/userAuth');



//signup
user_route.get('/',userController.loadRegister);

user_route.post('/',userController.insertUser);

//verifyOtp
user_route.get('/verify',userController.loadOtp)

user_route.post('/verify',userController.verifyOtp);

//Resend Otp

user_route.get('/resendOTP',userController.resendOtp)



//Login
user_route.get('/login',auth.isLogout,userController.Login);

//Logout
user_route.get('/logout',auth.isLogin,userController.Logout)

user_route.post('/login',userController.userLogin);

//Forget password

user_route.get('/forgetOtp',userController.forgetPassword)
user_route.post('/forgetOtp',userController.emailForgetPassword)
user_route.post('/verifyOtp',userController.forgetVerifyOtp)

//Update password

user_route.post('/updatePassword',userController.updatePassword);
 

//Home
user_route.get('/home',auth.isLogin,userController.loadHome);

//Shop
user_route.get('/shop',auth.isLogin,userController.loadShop);

//Product Detail
user_route.get('/productDetail',auth.isLogin,userController.productDetail);

//Cart
user_route.get('/cart',auth.isLogin,userController.loadCart)

//User Profile

user_route.get('/user-profile',auth.isLogin,userController.loadProfile)
user_route.post('/changePassword',userController.changePassword)
user_route.post('/addAddress',userController.addAddress)
user_route.post('/deleteAddress',userController.deleteAddress)



//Add to Cart

user_route.post('/addToCart',userController.addToCart)
user_route.post('/updateQuantity',userController.updateQuantity)
user_route.post('/removeProduct',userController.removeProduct)

//Checkout

user_route.get('/checkout',auth.isLogin,userController.loadCheckout)
user_route.post('/placeOrder',userController.placeOrder)
user_route.get('/successOrder',auth.isLogin,userController.orderPlaced)

//Orders
user_route.get('/myOrders',auth.isLogin,userController.loadOrders)
user_route.get('/orderDetail/:id',auth.isLogin,userController.orderDetail)





module.exports = user_route;