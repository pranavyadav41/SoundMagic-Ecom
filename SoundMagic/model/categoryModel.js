const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    offer:{ type:Number,default:0},
    isListed:{type:Boolean,default:true},
});

module.exports = mongoose.model('Category',categorySchema);