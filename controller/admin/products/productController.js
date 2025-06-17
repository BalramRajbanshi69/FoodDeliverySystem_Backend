const Product = require("../../../model/productModel");
const BACKEND_URL = process.env.BACKEND_URL;
const fs = require("fs");

exports.createProduct = async (req, res) => {
  const file = req.file; // since file comes in req.file not in req.body
  let filePath;
  if (!file) {
    // here if not file from created product set to default image
    filePath =
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
  } else {
    filePath = req.file.filename;
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
    productImage: BACKEND_URL + filePath // now backend developer can easily see the image in url
  });
  await productData.save();
  res.status(200).json({
    message: "Product added successfully",
    data: productData,
  });
};

// get products
   exports.getProducts = async (req, res) => {
     const products = await Product.find();

     if (products.length == 0) {
       res.status(404).json({
         message: "No products found",
         products: []
       });
     } else {
       res.status(200).json({
         message: "Products fetched successfully",
         products: products,
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

  const product = await Product.findById(id);
  if (product.length ==0) {
    res.status(400).json({
      message: "No product found with that id",
      product: [],
    });
  } else{
    res.status(200).json({
      message: "Product with id found successfully",
      product
    });
  }
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
    
    
    const oldProductImage = oldData.productImage // http://localhost:3000/1698943267271-bunImage.png"
    const lengthToCut  = BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) // 1698943267271-bunImage.png
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