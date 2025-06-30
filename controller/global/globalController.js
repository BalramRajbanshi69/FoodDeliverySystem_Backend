const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");


//  why in global cause admin + user both can see or get them getproducts,getProductById,reviewProduct
// get products
exports.getProducts = async (req, res) => {
     const products = await Product.find();

     if (products.length == 0) {
       res.status(404).json({
         message: "No products found",
         data: []
       });
     } else {
       res.status(200).json({
         message: "Products fetched successfully",
         data: products,
       });
     }
   };
   


// get product by id
exports.getProductById = async (req, res) => {
  const {id} = req.params;
  if (!id) {
    return res.status(400).json({
      message: "provide product id",
    });
  }

  const product = await Product.find({_id:id});
  const productReviews = await Review.find({productId : id}).populate("userId")         
  if (product.length ==0) {
    res.status(400).json({
      message: "No product found with that id",
      data:{
        product: [],
      productReviews:[]
      }
    });
  } else{
    res.status(200).json({
      message: "Product with id found successfully",
     data:{
       product,
      productReviews
     }
    });
  }
};