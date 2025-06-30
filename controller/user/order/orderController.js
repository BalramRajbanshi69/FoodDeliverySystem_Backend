
const Order = require("../../../model/orderModel");
const User = require("../../../model/userModel");

exports.createOrder = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const { items, totalAmount, shippingAddress, paymentDetails,phoneNumber } = req.body;

    if (!items.length > 0 || !totalAmount || !shippingAddress || !paymentDetails || !phoneNumber) {          // why items.length>0? because items is an array, so we need to check if it has at least one item
        return res.status(400).json({ message: "All fields are required" });
    }


    const createdOrder = new Order({
        user: userId,
        items,
        totalAmount,
        shippingAddress,
        phoneNumber,
        paymentDetails
    });
    await createdOrder.save()
    
    const user = await User.findById(userId);
    user.cart = []
    await user.save();

    
    res.status(201).json({
        message: "Order created successfully",
        data: createdOrder
    });
}



// getMyOrders
exports.getMyOrders = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user

    const order = await Order.find({ user: userId }).populate({   // why populate? because we want to get the product details in the order
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

    if (!order || order.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json({
        message: "Orders fetched successfully",
        data:order
    });

}


                
 // deleteOrder
exports.deleteMyOrder = async(req,res)=>{
    const userId = req.user.id 
    const {id} = req.params 

    // check if order exists or not 
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "No order with that id"
        })
    }
    if(order.user != userId){
       return res.status(400).json({
        message : "You don't have permission to delete this order"
       })
    }
    if(order.orderStatus != "pending"){
        return res.status(400).json({
            message : "You cannot delete this order as it is not pending"
        })
    }
    await Order.findByIdAndDelete(id)
    res.status(200).json({
        message : "Order deleted successfully",
        data : null
    })
}


// updateOrder
exports.updateMyOrder = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const id = req.params.id; // assuming order ID is passed as a URL parameter
    const {items,shippingAddress} = req.body; // assuming items and shippingAddress are passed in the request body
    if(!items.length == 0 || !shippingAddress){   // why items.length == 0? because items is an array, so we need to check if it has at least one item
        return res.status(400).json({ message: "Items and shipping address are required" });
    }

    const existingOrder = await Order.findById(id); // find the order by ID
    if (!existingOrder) {
        return res.status(404).json({ message: "Order not found with that id" });
    }

    // Check if the order belongs to the user
    if(existingOrder.user !== userId){
        return res.status(403).json({ message: "You are not authorized to update this order" });
    }

    // Check if the order is already on the way
    if(existingOrder.orderStatus === "ontheway"){
        return res.status(400).json({ message: "Order is already on the way, cannot update" });
    }


    const updateOrder = await Order.findByIdAndUpdate(id,{
        items,
        shippingAddress
    },{
        new:true // return the updated order
    })
    res.status(200).json({
        message: "Order updated successfully",
        data:updateOrder
    });
}




// cancelOrder
exports.cancelOrder = async(req,res)=>{
    const {id}  = req.body 
    const userId = req.user.id 
  

    // check if order exists or not
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "No order with that id"
        })
    }
    // console.log(id);
    // console.log(order);
    // console.log(userId);
    

    if(order.user != userId){
       return res.status(400).json({
        message : "You don't have permission to delete this order"
       })
    }
    if(order.orderStatus !=="pending"){
        return res.status(400).json({
            message : "You cannot cancel this order as it is not pending"
        })
    }
   const updatedOrder =  await Order.findByIdAndUpdate(id,{
        orderStatus : "cancelled"
    },{new:true})
    res.status(200).json({
        message : "Order cancelled successfully",
        data : updatedOrder
    })

} 