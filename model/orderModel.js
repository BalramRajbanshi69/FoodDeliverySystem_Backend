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
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress:{
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled',"Preparation"],
        default: 'Pending'
    },
    paymentDetails:{
        method:{
            type:String,
            enum:["COD","Khalti"]
        },
        status: {
            type: String,
            enum: ['Success', 'Pending', 'Failed'],
            default: 'Pending'
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