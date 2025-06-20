const Order = require("../../../model/orderModel")

exports.getAllOrders = async(req,res)=>{             
    const orders = await Order.find().populate({           // why not using user? because we want to get all orders, not just the orders of a specific user
        path: "items.product",  // populate the product field in items
        model: "Product"         // specify the model to populate from
    })
    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({
        message: "Orders fetched successfully",
        data:orders
    });
}