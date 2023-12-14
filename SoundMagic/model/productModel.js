
 const mongoose = require("mongoose");

 const productSchema = new mongoose.Schema({
    productName: {
       type:String,
       required:true
    },
     actualPrice:{
       type:Number,
       required:true
     },
   
     offerPrice:{
       type:Number,
       required:true
     },
   
     image:{
       type:Array,
       required:true
     },
     
     description:{
       type:String,
       required:true
     },
     category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category",
      required:true
    },
  
     
     stock:{     
       type:Number,
       required:true
     },
   
     is_listed:{
       type:Boolean,
       default:true
     },
   
   }, );
   
   
   
   module.exports = mongoose.model('Product', productSchema);