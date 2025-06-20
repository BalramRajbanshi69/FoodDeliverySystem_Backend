const Order = require("../../../model/orderModel");

exports.createOrder = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const { items, totalAmount, shippingAddress, paymentDetails } = req.body;

    if (!items.length > 0 || !totalAmount || !shippingAddress || !paymentDetails) {          // why items.length>0? because items is an array, so we need to check if it has at least one item
        return res.status(400).json({ message: "All fields are required" });
    }

    const order = new Order({
        user: userId,
        items,
        totalAmount,
        shippingAddress,
        paymentDetails
    });

    await order.save();
    
    res.status(201).json({
        message: "Order created successfully",
        data:order
    });
}



// getMyOrders
exports.getMyOrders = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user

    const orders = await Order.find({ user: userId }).populate({   // why populate? because we want to get the product details in the order
        path:"items.product",                                      // why items.product? because items is an array of objects, each object has a product field which is an ObjectId referencing the Product model
        model:"Product",                                            // why Product? because we want to get the product details from the Product model
        select:"-productStockQuantity -createdAt -updatedAt -__v -reviews"                               // we can also use select to exclude some fields from the populated data, like productStockQuantity, productStatus, etc. // to exclude multiple fields, use select: "-field1 -field2" or select: "-productStockQuantity -productStatus -__v -createdAt" etc.

        //OR in this way , first going to items, then going to product
        // path:"items",
        // populate:{
        //     path:"product",
        //     model:"Product",
        //     select:"-productStockQuantity -productStatus -__v -createdAt" // to exclude multiple fields, use select: "-field1 -field2"
        // }
    })

    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json({
        message: "Orders fetched successfully",
        data:orders
    });

}




// getSingleOrder
exports.getSingleOrder = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const orderId = req.params.orderId; // assuming order ID is passed as a URL parameter

    const order = await Order.findOne({ _id: orderId, user: userId }).populate({          // why findOne? because we want to get a single order by its ID and user ID
        path:"items.product",                                      // why populate? because we want to get the product details in the order
        model:"Product",                                            // why Product? because we want to get the product details from the Product model
    })  

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
        message: "Order fetched successfully",
        data:order
    });
}




// deleteOrder
exports.deleteOrder = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const orderId = req.params.orderId; // assuming order ID is passed as a URL parameter

    const order = await Order.findOneAndDelete({ _id: orderId, user: userId }); // why findOneAndDelete? because we want to delete a single order by its ID and user ID

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
        message: "Order deleted successfully",
        data:order
    });
}