const mongoose = require("mongoose");
const Schema = mongoose.Schema
const reviewSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Review must belongs to userId"]
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:[true,"Review must be done to required productId"]
    },
    rating:{
        type:Number,
        required:[true,"Rating is required"]
    },
    message:{
        type:String,
        required:[true,"Message is required"]
    }
},{
    timestamps:true
})

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review