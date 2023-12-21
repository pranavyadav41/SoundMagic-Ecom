//For rendering signup page

const User = require("../model/userModel");
const sendMail = require("../services/otpVerification");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const Address = require("../model/addressModel")
const Order = require("../model/orderModel")

//hashing password
const bcrypt = require("bcrypt");
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("userSignup");
  } catch (error) {
    console.log(error.message);
  }
};

// Generate a random 6-digit otp
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

//For storing user details

const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mobile: req.body.mno,
      email: req.body.email,
      password: spassword,
      isBlocked: 0,
      isAdmin: 0,
    });
    const userData = await user.save();

    if (userData) {
      const otp = generateOTP();
      req.session.name = req.body.firstname;
      req.session.otp = otp;
      console.log(req.session.otp);
      req.session.email = req.body.email;

      await sendMail(otp, req.body.email, req.body.firstname);
      res.redirect("/verify");
    } else {
      res.render("userSignup", {
        message: "Your registration has been faileed",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Load otp page
const loadOtp = async (req, res) => {
  try {
    res.render("verifyOtp");
  } catch (error) {
    console.log(error.message);
  }
};
//Compare otp and verify
const verifyOtp = async (req, res) => {
  try {
    userEnteredOtp =
      req.body.digit1 +
      req.body.digit2 +
      req.body.digit3 +
      req.body.digit4 +
      req.body.digit5 +
      req.body.digit6;
    userOtp = parseInt(userEnteredOtp);

    if (req.session.otp === userOtp) {
      const user = await User.updateOne(
        { email: req.session.email },
        { $set: { isVerified: true } }
      );
      req.session.isVerified = 1;
      res.redirect("/login");
    } else {
      res.render("verifyOtp", { message: "Invalid OTP.Please try again." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//render Login

const Login = async (req, res) => {
  try {
    res.render("userLogin");
  } catch (error) {
    console.log(error.message);
  }
};


const Logout = async(req,res)=>{
  try {
    req.session.destroy();
    res.redirect('/login')
        
    
  } catch (error) {
    console.log(error.message)
    
  }
}

//User Login

const userLogin = async (req, res) => {
  const email = req.body.email;
  req.session.email = email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    req.session.userid = user._id;
    //email match
    if (!user) {
      res.render("userLogin", { error: "Invalid Email or Password" });
    }

    //checking block/unblock
    if (user.isBlocked) {
      res.render("userlogin", { error: "Failed to login,You are blocked" });
    }

    //isVerified
    if (!user.isVerified) {
      req.session.email = email;
      const generatedOtp = generateOTP();
      req.session.otp = generatedOtp;
      await sendMail(req.session.otp, req.session.email);
      res.render("userLogin", {
        verify: "Please verify your account before logging in",
      });
    }

    //compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      res.redirect("/home");
    } else {
      res.render("userLogin", { error: "Invalid Email or Password" });
    }
  } catch (error) {}
};

const loadHome = async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log("error.message");
  }
};

const loadShop = async (req, res) => {
  try {
    if (req.query.id) {
      const id = req.query.id;
      const products = await Product.find({ is_listed: true, category: id });
      const category = await Category.find({ isListed: true });
      res.render("shop", { category, products });
    } else {
      const products = await Product.find({ is_listed: true });
      const category = await Category.find({ isListed: true });
      res.render("shop", { products, category });
    }
  } catch (error) {
    console.log("error.message");
  }
};

const productDetail = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Product.findById({ _id: id });
    res.render("productDetail", { product: product });
  } catch (error) {
    console.log(error.message);
  }
};

const resendOtp = async (req, res) => {
  try {
    const otp = await generateOTP();
    req.session.otp = otp;

    const name = req.session.name;

    await sendMail(otp, req.session.email, name);

    res.render("verifyOtp", { success: "Otp sent successfully" });
  } catch (error) {}
};

const loadCart = async (req, res) => {
  try {
    // Fetch cart data based on the user's session or authentication
    const userId = req.session.userid; // Adjust this based on your authentication logic
    const cartData = await Cart.findOne({ userId: userId }).populate(
      "items.productId"
    );
    res.render("cart", { cart: cartData});
  } catch (error) {
    console.error("Error rendering cart page:", error);
    res.status(500).send("Internal server error");
  }
};

const loadProfile = async (req, res) => {
  try {
    const userid = req.session.userid;
    const user = await User.findById(userid);
    const address = await Address.find({userId:userid})
    res.render("profile", { user,address });
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPassword = async (req, res) => {
  try {
    res.render("forgetOtp");
  } catch (error) {
    console.log(error.message);
  }
};

const emailForgetPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (user) {
      const otp = generateOTP();
      req.session.otp = otp;
      const email = user.email;
      req.session.email = email;
      const name = user.firstname;
      await sendMail(otp, email, name);
      res.render("passwordOtp");
    } else {
      res.render("forgetOtp", {
        error: "Email is not registered !",
      });
    }
  } catch (error) {}
};

const forgetVerifyOtp = async (req, res) => {
  try {
    userEnteredOtp =
      req.body.digit1 +
      req.body.digit2 +
      req.body.digit3 +
      req.body.digit4 +
      req.body.digit5 +
      req.body.digit6;
    userOtp = parseInt(userEnteredOtp);
    if (req.session.otp === userOtp) {
      res.render("updatePassword");
    } else {
      res.render("passwordOtp", { error: "OTP you have entered is invalid" });
    }
  } catch (error) {}
};

const updatePassword = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.newPassword);
    const user = await User.findOneAndUpdate(
      { email: req.session.email },
      { password: spassword },
      { new: true }
    );
    res.redirect('/login')
    window.location.href = "login.html?passwordChanged=true";

  } catch (error) {
    console.log(error.message)
  }
};

const changePassword = async (req, res) => {
  const id = req.session.userid;

  const currentPassword = req.body.currentPassword;

  const user = await User.findById(id);

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (passwordMatch) {
    const newPassword = await securePassword(req.body.newPassword);
    const user = await User.findOneAndUpdate(
      { _id: id },
      { password: newPassword },
      { new: true }
    );
    return res.json({ success: true, message: 'Password changed successfully' });
  } else {
    return res.status(400).json({ error: 'Current password does not match' });
  }
};

const addToCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const userId = req.session.userid;
    const quantity = 1;
    let product = await Product.findOne({ _id: productId });
    const stock = product.stock;

    let userCart = await Cart.findOne({ userId });
    if (stock < 1) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    if (!userCart) {
      userCart = new Cart({
        userId: userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      // Check if the product is already in the cart
      const checkItem = userCart.items.find((item) =>
        item.productId.equals(productId)
      );

      if (checkItem) {
        // If the product is already in the cart, update the quantity
        return res.status(400).json({ error: "Product already added to cart" });
      } else {
        // If the product is not in the cart, add it
        userCart.items.push({
          productId,
          quantity,
        });
        
        
      }
      
      
     
    }

    await userCart.save();
    res.json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuantity = async(req,res)=>{
  try {
    const productId = req.body.productId;
    const quantity = req.body.newQuantity;
    const updatedCart = await Cart.findOneAndUpdate(
      { 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );
    if(updatedCart){
      res.json({success:true})
    }
    
  } catch (error) {
    
  }
}

const addAddress = async(req,res)=>{
  try {
    console.log(req.body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           );
    const userId = req.session.userid;
    const userAddress =new Address({
      userId:userId,
      fullname:req.body.Fullname,
      mobile:req.body.Mobile,
      address:req.body.Address,
      pincode:req.body.Pincode,
      city:req.body.city,
      State:req.body.state,
    }) 
    await userAddress.save();
     return res.json({ success: true, message: 'Address added successfully' });
    
  } catch (error) {
    console.log(error.message);
    
  }
}


const deleteAddress =async(req,res)=>{
  try {
   let Id = req.body.addressId;

   const productDetail = await Address.findByIdAndDelete({_id:Id})
   if(productDetail){
    res.json({success:true})
   }

  } catch (error) {

    console.error('Error:', error);
    
  }
}

const removeProduct = async(req,res)=>{
  try {
    const productId = req.body.productId;
    const deleteCart = await Cart.findOneAndUpdate({'items.productId':productId},{$pull:{items:{productId:productId}}},{new:true})
    if(deleteCart){
      res.json({success:true})
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

const loadCheckout = async(req,res)=>{
  try {
    const userid = req.session.userid;
    const cart = await Cart.find({userId:userid}).populate("items.productId")
    ////CALCULATING SUBTOTAL////////////
    let subtotal = 0;
    cart[0].items.forEach(item=>{
      subtotal +=item.productId.offerPrice * item.quantity
    })
    ////////////////////////////////////
    const address = await Address.find({userId:userid})

    res.render('checkout',{address,cart,subtotal})
    
  } catch (error) {
    console.log(error.message);
  }
}

const placeOrder = async(req,res)=>{
  try {
    const userId =req.session.userid;
    const addressId =req.body.addressId;
    const subtotal =req.body.subtotal;
    const paymentMethod =req.body.paymentMethod;
    const address = await Address.find({_id:addressId}).populate('address')
    const cart = await Cart.find({userId:userId})
    const products = cart[0].items;

    const userOrder = new Order({
      userId:userId,
      shippingAddress:{
        fullname:address[0].fullname,
        mobile:address[0].mobile,
        address:address[0].address,
        pincode:address[0].pincode,
        city:address[0].city,
        state:address[0].State,

      },
      products:products,
      totalAmount:subtotal,
      paymentMethod:paymentMethod,
    })
    const order=await userOrder.save();
    if(order){
      await Cart.findOneAndUpdate({userId:userId},{$set:{items:[]}});
      //////Update Stock//////
      for(const product of products){
        const productId= product.productId;
        const quantity = product.quantity;
        await Product.findOneAndUpdate({_id:productId},{$inc:{stock:-quantity}})
      }
      ////////////////////////
    }
    res.json({success:true})


  } catch (error) {

    console.log(error.message);
    
  }
}

const orderPlaced = async(req,res)=>{
  try {

    res.render('orderSuccess')
    
  } catch (error) {
    console.log(error.message);
  }
}

const loadOrders = async(req,res)=>{
  try {
    const userId = req.session.userid;
    const orders= await Order.find({userId}).populate({path:"products.productId"})
    res.render('myOrders',{orders})
    
  } catch (error) {
    console.log(error.message);
  }
}

const orderDetail = async(req,res)=>{
  try {

    res.render('orderDetail')
    
  } catch (error) {

    console.log(error.message)
    
  }
}
module.exports = {
  loadRegister,
  insertUser,
  loadOtp,
  verifyOtp,
  Login,
  userLogin,
  loadHome,
  loadShop,
  productDetail,
  resendOtp,
  loadCart,
  loadProfile,
  forgetPassword,
  emailForgetPassword,
  forgetVerifyOtp,
  updatePassword,
  changePassword,
  addToCart,
  updateQuantity,
  addAddress,
  removeProduct,
  loadCheckout,
  deleteAddress,
  placeOrder,
  orderPlaced,
  Logout,
  loadOrders,
  orderDetail
};
