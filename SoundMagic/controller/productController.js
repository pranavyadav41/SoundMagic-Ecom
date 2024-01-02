const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Order = require('../model/orderModel')
const Coupon = require('../model/couponModel')
const moment = require('moment')
const now = moment();

const loadProduct = async(req,res)=>{
    try {
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }
    
        
        const products = await Product.find({
             productName: { $regex: search, $options: 'i' }
        }).populate('category')
        res.render('products',{products})
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddProduct = async(req,res)=>{
    try {
        const categories = await Category.find({isListed:true},'name');
        res.render('addProduct',{categories})
    } catch (error) {
        
    }
}

const  addProduct = async(req,res)=>{

    try {
        
        const {
            productName,
            actualPrice,
            offerPrice,
            description,
            stock,
            category,

        } = req.body
        const categoryObject = await Category.findOne({ name: category });
        if (!categoryObject) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        const image  = req.files.map((file)=>{
            const newPath = `${file.filename}`;

            file.path = newPath;

            return newPath

        });

        const newProduct = new Product({
            productName,
            actualPrice,
            offerPrice,
            description,
            stock,
            category:categoryObject._id,
            image
        })

        const saveProduct = await newProduct.save();
        res.redirect('/admin/products')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
}

const listProduct = async(req,res)=>{
    try {

        const id = req.params.id
        const product = await Product.findOne({ _id: id })
        if (!product) {
            return res.status(404).json({ error: 'Category not found' });
        }
        product.is_listed = true;
        await product.save()
        res.json({ message: 'Category listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }

}

const unlistProduct = async(req,res)=>{
    try {

        const id = req.params.id

        const product = await Product.findOne({ _id: id })
        if (!product) {
            return res.status(404).json({ error: 'Category not found' });
        }
        product.is_listed = false;
        await product.save()
        res.json({ message: 'Category Unlisted successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }

}

const loadEditProduct = async(req,res)=>{
    try {
        const categories = await Category.find({isListed:true},'name');
        const productId = req.params.id;
        const product = await Product.findById(productId)
        res.render('editProduct',{product,categories})
    } catch (error) {
        
    }
}

const editProduct = async(req,res)=>{
    try {
        const productId = req.params.id;
        const category = req.body.category;
        const categoryObject = await Category.findOne({ name: category });
        if (!categoryObject) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        const uploadedImg = req.files;
        const image  = uploadedImg.map((file)=>{
            const newPath = `${file.filename}`;

            file.path = newPath;

            return newPath

        });
        if(uploadedImg.length!==0){
            const productData = await Product.findByIdAndUpdate({_id:productId},
                {
                    $set: {
                        image:image,
                        productName: req.body.productName,
                        actualPrice:req.body.actualPrice,
                        offerPrice: req.body.offerPrice,
                        stock: req.body.stock,
                        category: categoryObject._id,
                        description: req.body.description,
                    }
    
                })
                res.redirect('/admin/products')
             }else{
        const productData = await Product.findByIdAndUpdate({_id:productId},
            {
                $set: {
                   
                    productName: req.body.productName,
                    actualPrice:req.body.actualPrice,
                    offerPrice: req.body.offerPrice,
                    stock: req.body.stock,
                    category: categoryObject._id,
                    description: req.body.description,
                }

            })
            res.redirect('/admin/products')

        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const orders = async(req,res)=>{
    try {

        const orders = await Order.find().populate({path:'userId'});
        
        res.render('orders',{orders})

    } catch (error) {
        
    }
}
const orderDetail = async(req,res)=>{
    try {
        const orderId = req.params.orderID
        const orders = await Order.findOne({_id:orderId}).populate({path:'products.productId'});
        res.render('orderDetail',{orders})
    } catch (error) {
        console.log(error.message);
    }
}

const orderStatus = async(req,res)=>{
    try {
        const productId = req.body.productId;
        const orderId = req.body.orderId;
        const newStatus = req.body.newValue;

        const order = await Order.findOne({_id:orderId})

        const targetProduct = order.products.find(product=>product.productId.toString()===productId)
    
        targetProduct.productOrderStatus = newStatus 
    
        await order.save();
        
    } catch (error) {
        
        console.log(error.message)
    }
}

const coupons = async(req,res)=>{
    try {

        const coupons = await Coupon.find();

        res.render('coupon',{coupons})
        
    } catch (error) {
       console.log(error.message) 
    }
}

const addCoupons = async(req,res)=>{
    try {

        res.render('addcoupon')
        
    } catch (error) {
        console.log(error.message)
    }
}

const couponAdd = async(req,res)=>{
    try {
        const newCoupon = new Coupon({
            code:req.body.couponCode,
            couponName:req.body.couponName,
            validFrom:req.body.validFrom,
            expiry:req.body.validTo,
            discountAmount:req.body.discountAmount,
            minimumCartValue:req.body.minCartValue,
        })
        await newCoupon.save();
        res.json({success:true});
        

        
    } catch (error) {

        console.log(error)
        
    }

}

const editCoupon = async(req,res)=>{
    try {
        const couponId = req.params.id;
        const coupon = await Coupon.find({_id:couponId})

        res.render('editCoupon',{coupon});
        
    } catch (error) {

        console.log(error.message)
        
    }
}

const couponEdit = async(req,res)=>{
    try {

        const coupon = await Coupon.findByIdAndUpdate({_id:req.body.couponId},{
            $set:{
                code:req.body.coupon.couponCode,
                couponName:req.body.coupon.couponName,
                validFrom:req.body.coupon.validFrom,
                expiry:req.body.coupon.validTo,
                discountAmount:req.body.coupon.discountAmount,
                minimumCartValue:req.body.coupon.minCartValue
            }
        });

        res.json({success:true})
        
    } catch (error) {

        console.log(error.message);
        
    }
}

const listCoupon = async(req,res)=>{
    try {

        const id = req.params.id
        const coupon = await Coupon.findOne({ _id: id })
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        coupon.listed = 1;
        await coupon.save()
        res.json({ message: 'Coupon listed successfully' })


        
    } catch (error) {
        
        console.log(error.message);
    }
}

const unlistCoupon = async(req,res)=>{
    try {

        const id = req.params.id

        const coupon = await Coupon.findOne({ _id: id })
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        coupon.listed = 0;
        await coupon.save()
        res.json({ message: 'Coupon Unlisted successfully' })

        
    } catch (error) {

        console.log(error.message);
        
    }

}

module.exports = {
    loadProduct,
    loadAddProduct,
    addProduct,
    listProduct,
    unlistProduct,
    loadEditProduct,
    editProduct,
    orders,
    orderDetail,
    orderStatus,
    coupons,
    addCoupons,
    couponAdd,
    editCoupon,
    couponEdit,
    listCoupon,
    unlistCoupon
}