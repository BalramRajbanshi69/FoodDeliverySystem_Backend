
const Product = require("../../../model/productModel");
const Review = require("../../../model/reviewModel");


// create review
exports.createReview = async(req,res)=>{
    const userId = req.user.id ;   // from which user id you are creating review    loggein user 
    const productId = req.params.id ; // user is targeting which product id from Product model
    
    const {rating,message} = req.body;    
    if(!rating || !message){
        return res.status(400).json({
            message:"Please provide rating,message"
        })
    }

    // check if that productId exists or not
    const productExist = await Product.findById(productId);    
    if(!productExist){
        return res.status(404).json({
            message:"Product with that productId not found or doesnot exist!"
        })
    }

    const review = await Review.create({
        userId,
        productId,
        rating,
        message
    })
    res.status(200).json({
        message:"Review added successfully",
        data:review
    })
}



// get my review
exports.getMyReview = async(req,res)=>{
    const userId = req.user.id;
    const review = await Review.find({userId});
    if(review.length == 0){
        res.status(404).json({
            message:"You haven't reviewed any products yet",
            review:[]
        })
    }else{
        res.status(200).json({
            message:"Review fetched successfully",
            data:cdreview
        })
    }
}



// delete review
exports.deleteProductReview = async(req,res)=>{
    const userId = req.user.id;
    const reviewId = req.params.id;
    if(!reviewId){
        return res.status(400).json({
            message:"Provide reviewId"
        })
    }

    // check if that user created this review 
    const review = await Review.findById(reviewId);
    const ownerIdOfReview = review.userId;
    if(ownerIdOfReview !== userId){
        return res.status(400).json({
            message:"you don't have permission to delete this review"
            })
    }


    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({
        message:"Review deleted successfully"
    })
}







