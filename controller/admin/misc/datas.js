const Order = require("../../../model/orderModel")
const Product = require("../../../model/productModel")
const User = require("../../../model/userModel")

exports.getAllDatas = async(req,res)=>{                         // to show in dashboard
    const users = (await User.find()).length
    const orders = (await Order.find()).length
    const products = (await Product.find()).length

    const allOrders = await Order.find().populate({           
        path: "items.product",  // populate the product field in items
        model: "Product"         // specify the model to populate from
    }).populate("user")

    res.status(200).json({
        message:"Datas fetched successfully",
        data:{
            orders,
            users,
            products,
            allOrders
        }
    })
}


