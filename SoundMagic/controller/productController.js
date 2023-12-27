const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Order = require('../model/orderModel')

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
        console.log(orders.products);
        
        res.render('orders',{orders})

    } catch (error) {
        
    }
}
const orderDetail = async(req,res)=>{
    try {
        res.render('orderDetail')
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
    orderDetail
}