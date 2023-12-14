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

admin_route.get('/dashboard',adminController.loadDashboard)

//Users

admin_route.get('/users',adminController.loadUsers)

//blocking user

admin_route.patch('/block-user/:userID',adminController.userBlock)
admin_route.patch('/Unblock-user/:userID',adminController.userUnblock)

//Categories

admin_route.get('/categories',categoryController.loadCategories)

admin_route.post('/categories',categoryController.addCategories)

//editCategories

admin_route.get('/categories/edit/:id',categoryController.loadEditCategories)
admin_route.post('/categories/edit/:id',categoryController.editCategories)

//ListAndUnlist Categories

admin_route.patch('/list-category/:id',categoryController.listCategory)
admin_route.patch('/unlist-category/:id',categoryController.unlistCategory)


//Products

admin_route.get('/products',productController.loadProduct)


//Add Products

admin_route.get('/products/add-product',productController.loadAddProduct)

admin_route.post('/products/add-product',Multer.array('image',4),productController.addProduct)


//List/Unlist Products

admin_route.patch('/list-product/:id',productController.listProduct);

admin_route.patch('/unlist-product/:id',productController.unlistProduct);

//Edit Products
admin_route.get('/products/edit/:id',productController.loadEditProduct)

admin_route.post('/products/edit/:id',Multer.array('image',4),productController.editProduct)


 







module.exports = admin_route;

