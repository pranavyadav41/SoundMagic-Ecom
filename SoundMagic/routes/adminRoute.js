const express = require('express');
const admin_route = express();

admin_route.set('views','./views/admin')

const adminController = require('../controller/adminController')
const categoryController = require('../controller/categoryController')
const productController = require('../controller/productController')
const Multer = require('../middleware/multerConfig')
const auth = require("../middleware/auth")


//Login

admin_route.get('/',auth.isLogout,adminController.loadLogin)

admin_route.post('/',adminController.insertAdmin)

//Logout

admin_route.get('/logout',auth.isLogin,adminController.adminLogout)

//Dashboard

admin_route.get('/dashboard',auth.isLogin,adminController.loadDashboard)

//Users

admin_route.get('/users',auth.isLogin,adminController.loadUsers)

//blocking user

admin_route.patch('/block-user/:userID',adminController.userBlock)
admin_route.patch('/Unblock-user/:userID',adminController.userUnblock)

//Categories

admin_route.get('/categories',auth.isLogin,categoryController.loadCategories)

admin_route.post('/categories',auth.isLogin,categoryController.addCategories)

//editCategories

admin_route.get('/categories/edit/:id',auth.isLogin,categoryController.loadEditCategories)
admin_route.post('/categories/edit/:id',auth.isLogin,categoryController.editCategories)

//ListAndUnlist Categories

admin_route.patch('/list-category/:id',auth.isLogin,categoryController.listCategory)
admin_route.patch('/unlist-category/:id',auth.isLogin,categoryController.unlistCategory)


//Products

admin_route.get('/products',auth.isLogin,productController.loadProduct)


//Add Products

admin_route.get('/products/add-product',auth.isLogin,productController.loadAddProduct)

admin_route.post('/products/add-product',Multer.array('image',4),auth.isLogin,productController.addProduct)


//List/Unlist Products

admin_route.patch('/list-product/:id',auth.isLogin,productController.listProduct);

admin_route.patch('/unlist-product/:id',auth.isLogin,productController.unlistProduct);

//Edit Products
admin_route.get('/products/edit/:id',auth.isLogin,productController.loadEditProduct)

admin_route.post('/products/edit/:id',Multer.array('image',4),auth.isLogin,productController.editProduct)

//MY ORDERS
admin_route.get('/orders',auth.isLogin,productController.orders)

admin_route.get('/orderDetail',auth.isLogin,productController.orderDetail)







module.exports = admin_route;

