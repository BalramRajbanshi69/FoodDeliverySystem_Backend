const Order = require("../../../model/orderModel");
const Product = require("../../../model/productModel");
const BACKEND_URL = process.env.BACKEND_URL;
const fs = require("fs");

exports.createProduct = async (req, res) => {
    const file = req.file;
    let imageRelativePath;

    if (!file) {
        imageRelativePath = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
    } else {

        imageRelativePath = `/uploads/${req.file.filename}`;
    }

  const {
    productName,
    productDescription,
    productPrice,
    productStockQuantity,
    productStatus,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productStockQuantity ||
    !productStatus
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productPrice,productStockQuantity,productStatus",
    });
  }

  const productData = await Product.create({
    productName,
    productDescription,
    productPrice,
    productStockQuantity,
    productStatus,
    productImage: [imageRelativePath]
  });
  await productData.save();
  res.status(200).json({
    message: "Product added successfully",
    data: productData,
  });
};


//updateProducts
exports.editProduct = async(req,res)=>{
    const {id} = req.params 
      const {productName,productDescription,productPrice,productStatus,productStockQuantity} = req.body
      if(!productName || !productDescription || !productPrice || !productStatus || !productStockQuantity || !id){
        return res.status(400).json({
            message : "Please provide productName,productDescription,productPrice,productStatus,productStockQuantity,id"
        })
    }
    const oldData = await Product.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No data found with that id"
        })
    }
    
    
    const oldProductImage = oldData.productImage 
    const lengthToCut  = BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) 
    if(req.file && req.file.filename){
        // REMOVE FILE FROM UPLOADS FOLDER
            fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
                if(err){
                    console.log("error deleting file",err) 
                }else{
                    console.log("file deleted successfully")
                }
            })
    }
   const datas =  await Product.findByIdAndUpdate(id,{
        productName ,
        productDescription ,
        productPrice,
        productStatus,
        productStockQuantity,
        productImage : req.file && req.file.filename ? BACKEND_URL +  req.file.filename :  oldProductImage
    },{
        new : true,
    
    })
    res.status(200).json({
        messagee : "Product updated successfully",
        data : datas
    })
}



// delete products
exports.deleteProduct = async(req,res)=>{
  const id = req.params.id;
  if(!id){
    return res.status(400).json({
      message:"Please provide id"
    })
  }

  const oldData = await Product.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No data found with that id"
        })
    }
    const oldProductImage = oldData.productImage // http://localhost:3000/1698943267271-bunImage.png"
    const lengthToCut  = BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) // 1698943267271-bunImage.png
    // REMOVE FILE FROM UPLOADS FOLDER
            fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
                if(err){
                    console.log("error deleting file",err) 
                }else{
                    console.log("file deleted successfully")
                }
            })

   await Product.findByIdAndDelete(id);
  res.status(200).json({
    message:"Product deleted successfully"
  })
}






// update product Status
exports.updateProductStatus = async(req,res)=>{
    const id = req.params.id; // assuming order ID is passed as a URL parameter
    const { productStatus } = req.body; // assuming order status is passed in the request body

    // validate order status
    if(!productStatus || !["available", "unavailable"].includes(productStatus.toLowerCase())) {
        return res.status(400).json({ message: "Invalid product status" });
    }

    // check if order exists or not
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }

    // update the order status
    const updatedProduct = await Product.findByIdAndUpdate(id,{
        productStatus
    },{
        new:true
    })
  

    res.status(200).json({
        message: "Product status updated successfully",
        data: updatedProduct
    });

    
}




// update product stock and price
exports.updateProductStockAndPrice = async(req,res)=>{
    const id = req.params.id; // assuming order ID is passed as a URL parameter
    const { productStockQuantity,productPrice } = req.body; // assuming order status is passed in the request body

    // validate order status
    if(!productStockQuantity && !productPrice) {
        return res.status(400).json({ message: "provide all fields" });
    }

    // check if order exists or not
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }

    // update the order status
    const updatedProduct = await Product.findByIdAndUpdate(id,{
        productStockQuantity : productStockQuantity ? productStockQuantity : product.productStockQuantity, 
        productPrice : productPrice ? productPrice : product.productPrice
    },{
        new:true
    })
  
    res.status(200).json({
        message: "Product stock and price updated successfully",
        data: updatedProduct
    });

    
}






// get orders of a product (how much order has been done in a single product)
exports.getOrdersOfProduct = async(req,res)=>{
  const {id:productId} = req.params;
  
  const product = await Product.findById(productId)
if(!product){
  return res.status(400).json({
    message:"No prouduct found!"
  })
}

const orders = await Order.find({"items.product":productId}) // to get order of product
console.log(orders);

res.status(200).json({
  message:"Orders of product fetched successfully",
  data:orders
})
}