const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");

exports.addToCart = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const productId = req.params.productId; // assuming product ID is sent in the request body , we can also use req.params.productId
    if(!productId){
        return res.status(400).json({message: "Product ID is required"});
    }

    const productExist = await Product.findById(productId);
    if(!productExist){
        return res.status(404).json({message: "Product not found with that product ID"});
    }

    const user = await User.findById(userId);
    // check if that productId exists or not , if exist increase quantity by 1 , if not productId
    const existingCartItem = user.cart.find((item)=>item.product.equals(productId));
    if(existingCartItem){
        existingCartItem.quantity+=1
    }else{
        user.cart.push({
            product:productId,
            quantity:1
        });          // add product Id to user's cart // cart field made in userModel.js // Note: Ensure that the cart field in userModel.js is an array of ObjectIds
    }
    await user.save();
    const updatedUser = await User.findById(userId).populate("cart.product")
    res.status(200).json({
        message: "Product added to cart successfully",
        data: updatedUser.cart
        }); 
    
}


// getMyCartItems
exports.getMyCartItems = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const userData = await User.findById(userId).populate({
        path: 'cart.product', // populate the cart field and inside product field backend userModel 
        select:"-productStatus "       // exclude productStatus from the populated data // to exclude multiple fields, useselect: "-field1 -field2"
        // select:"-productStatus -productName -__v -createdAt ..."       // to exclude multiple fields, useselect: "-field1 -field2"
    }); 
    
    if(!userData){
        return res.status(404).json({message: "User not found"});
    }

    res.status(200).json({
        message: "Cart items retrieved successfully",
        data: userData.cart
    });
}



// removeFromCart
exports.removeFromCart = async(req,res)=>{

    const userId = req.user.id;
    const productId = req.params.productId; // assuming product ID is sent in the request body , we can also use req.params.productId

    // check if that product exists or not
    const productExist = await Product.findById(productId);
    if(!productExist){
        return res.status(404).json({message: "Product not found with that product ID"});
    }

    const user = await User.findById(userId);
    // use of filter method to remove the product from the cart
    // intially why we have used user.cart  because we are updating the cart field in userModel.js, which is an array of ObjectIds so we need to filter out the product ID from the cart array and then save the user
    // user.cart = user.cart.filter((pId)=>pId != productId); // filter out the product ID from the cart array

    user.cart = user.cart.filter(item=>item.product != productId);
    // or (same working)
    // user.cart = user.cart.filter(item => !item.product.equals(productId));
    await user.save();
    res.status(200).json({
        message: "Product removed from cart successfully",
        data: user.cart
    });
}




// updateCartItems
exports.updateCartItems = async(req,res)=>{
    const userId = req.user.id;
    const productId = req.params.productId;
    const {quantity} = req.body;

    const user = await User.findById(userId);
    const cartItem = user.cart.find((item)=>item.product.equals(productId));
    if(!cartItem){
        return res.status(404).json({
            message:"No items with that id"
        })
    }
    cartItem.quantity = quantity
    await user.save();
    res.status(200).json({
        message:"cart items updated successfully",
        data:user.cart
    })
}
