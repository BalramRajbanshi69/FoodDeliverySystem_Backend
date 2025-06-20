const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");

exports.addToCart = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const productId = req.params.id; // assuming product ID is sent in the request body , we can also use req.params.productId
    if(!productId){
        return res.status(400).json({message: "Product ID is required"});
    }

    const productExist = await Product.findById(productId);
    if(!productExist){
        return res.status(404).json({message: "Product not found with that product ID"});
    }

    const userData = await User.findById(userId);
    userData.cart.push(productId);          // add product Id to user's cart // cart field made in userModel.js // Note: Ensure that the cart field in userModel.js is an array of ObjectIds
    await userData.save();
    res.status(200).json({
        message: "Product added to cart successfully",
        cart: userData.cart
        }); 
    
}


// getMyCartItems
exports.getMyCartItems = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const userData = await User.findById(userId).populate({
        path: 'cart', // populate the cart field with product details
        select:"-productStatus "       // exclude productStatus from the populated data // to exclude multiple fields, useselect: "-field1 -field2"
        // select:"-productStatus -productName -__v -createdAt ..."       // to exclude multiple fields, useselect: "-field1 -field2"
    }); 
    
    if(!userData){
        return res.status(404).json({message: "User not found"});
    }

    res.status(200).json({
        message: "Cart items retrieved successfully",
        cart: userData.cart
    });
}



// removeFromCart
exports.removeFromCart = async(req,res)=>{

    const userId = req.user.id;
    const productId = req.params.id; // assuming product ID is sent in the request body , we can also use req.params.productId

    // check if that product exists or not
    const productExist = await Product.findById(productId);
    if(!productExist){
        return res.status(404).json({message: "Product not found with that product ID"});
    }

    const userData = await User.findById(userId);
    // use of filter method to remove the product from the cart
    // intially why we have used userData.cart  because we are updating the cart field in userModel.js, which is an array of ObjectIds so we need to filter out the product ID from the cart array and then save the user
    userData.cart = userData.cart.filter((pId)=>pId != productId); // filter out the product ID from the cart array
    await userData.save();
    res.status(200).json({
        message: "Product removed from cart successfully",
        cart: userData.cart
    });
}





