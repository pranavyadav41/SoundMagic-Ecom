
 const mongoose = require("mongoose");

 const productSchema = new mongoose.Schema({
    productName: {
       type:String,
       required:true
    },
   
     offerPrice:{
       type:Number,
       required:true
     },

     productOffer:{

      type:Number,
      default:0


     },
     categoryOffer:{

      type:Number,
      default:0

     },

     totalOfferPrice:{
      type:Number,
      default:0
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