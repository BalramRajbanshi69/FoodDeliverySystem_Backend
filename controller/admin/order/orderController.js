const Order = require("../../../model/orderModel");
const Product = require("../../../model/productModel");


// here admin can get all orders, update order status, delete order
// admin can get all orders, update order status, delete order ? because admin has access to all orders, not just the orders of a specific user


exports.getAllOrders = async(req,res)=>{             
    const orders = await Order.find().populate({           // why not using user? because we want to get all orders, not just the orders of a specific user
        path: "items.product",  // populate the product field in items
        model: "Product"         // specify the model to populate from
    }).populate("user")         // populate to get user data
    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({
        message: "Orders fetched successfully",
        data:orders
    });
}





// getSingleOrder
exports.getSingleOrder = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const id = req.params.id; // assuming order ID is passed as a URL parameter

    const order = await Order.findOne({ _id: id, user: userId }).populate({          // why findOne? because we want to get a single order by its ID and user ID
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



// updateOrderStatus
exports.updateOrderStatus = async(req,res)=>{
    const id = req.params.id; // assuming order ID is passed as a URL parameter
    const { orderStatus } = req.body; // assuming order status is passed in the request body

    // validate order status
    if(!orderStatus || !["pending", "ontheway", "delivered", "cancelled", "preparation"].includes(orderStatus.toLowerCase())) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    // check if order exists or not
    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    // update the order status
    const updatedOrder = await Order.findByIdAndUpdate(id,{
        orderStatus
    },{
        new:true
    }).populate({
        path:"items.product",
        model:"Product"
    }).populate("user")
    // update stockQuantity when orderStatus is delivered in frontend  ; suppose in product , out of suppose 4 stockquantiy, if 2 are selected to add an order, it should decrease to 2 in Stock 
    let neccessaryData;
    if(orderStatus === "delivered"){
        neccessaryData = updatedOrder?.items?.map((item)=>{
            return{
                quantity : item.quantity,
                productId : item.product._id,
                productStockQuantity : item.product.productStockQuantity
            }
        })

        for(var i =0; i < neccessaryData.length; i++){
        await Product.findByIdAndUpdate(neccessaryData[i].productId,{
            productStockQuantity: neccessaryData[i].productStockQuantity - neccessaryData[i].quantity
        })
    }
    }

    res.status(200).json({
        message: "Order status updated successfully",
        data: updatedOrder
    });

    
}


// updatePaymentStatus
exports.updatePaymentStatus = async(req,res)=>{
    const id = req.params.id; // assuming order ID is passed as a URL parameter
    const paymentStatus = req.body.paymentStatus; // assuming payment status is passed in the request body

    // validate order status
    if(!paymentStatus || !["pending", "paid","unpaid"].includes(paymentStatus.toLowerCase())) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    // check if order exists or not
    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    // update the order status
    const updatedPayment = await Order.findByIdAndUpdate(id,{
        "paymentDetails.status":paymentStatus
    },{
        new:true
    }).populate({
        path:"items.product",
        model:"Product"
    }).populate("user")

    res.status(200).json({
        message: "Payment status updated successfully",
        data: updatedPayment
    });
}



// deleteOrder
// exports.deleteOrder = async(req,res)=>{
//   const {id} = req.params; // assuming order ID is passed as a URL parameter

    
//   // check if order exists or not
//   const order = await Order.findById(id);
//   if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//   }

//   // check if order belongs to the user
//   if(order.user !== userId){
//         return res.status(403).json({ message: "You are not authorized to delete this order" });
//   }


//   await Order.findByIdAndDelete(id); // delete the order by ID
//   res.status(200).json({
//       message: "Order deleted successfully",
//       data:null
//   });
// }


exports.deleteOrder = async(req, res) => {
  const { id } = req.params;

  // check if order exists or not
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  await Order.findByIdAndDelete(id); // delete the order by ID
  res.status(200).json({
    message: "Order deleted successfully",
    data: null
  });
}



 