const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    user: {        // reference to the user who placed the order
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{      // array of items in the order
        quantity:{type:Number,required:true},       // quantity of the product in the order
        product: {      // reference to the product being ordered
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress:{
        type: String,
        required: true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'ontheway', 'delivered', 'cancelled',"preparation"],
        default: 'pending'
    },
    paymentDetails:{
        pidx:{
            type:String
        },
        method:{
            type:String,
            enum:["COD","khalti"]
        },
        status: {
            type: String,
            enum: ['paid', 'pending', 'unpaid'],
            default: 'pending'
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;