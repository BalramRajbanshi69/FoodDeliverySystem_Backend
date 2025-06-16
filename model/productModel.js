const mongoose = require("mongoose");
const {Schema} = mongoose;
const productSchema = new Schema({
    productName:{
        type:String,
        required:[true,'productName is required']
    },
     productDescription:{
        type:String,
        required:[true,'productDescription is required']
    },
     productPrice:{
        type:Number,
        required:[true,'productPrice is required']
    },
     productStockQuantity:{
        type:Number,
        required:[true,'productStockQuantity is required']
    },
     productStatus:{
        type:String,
        enum:['available','unavailable'],
        required:[true, 'productStatus is required'] 
    },
    productImage:{
        type:String
    }
    

},{
    timestamps:true
})

const Product = mongoose.model("Product",productSchema);
module.exports = Product