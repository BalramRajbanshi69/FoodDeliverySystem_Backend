const Product = require("../../../model/productModel");

exports.createProduct = async(req,res)=>{
    
        const file = req.file   // since file comes in req.file not in req.body
    let filePath;
    if(!file){                   // here if not file from created product set to default image
        filePath="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"                
    }else{
        filePath=req.file.filename
    }
    
    const {productName,productDescription,productPrice,productStockQuantity,productStatus} = req.body;
    if(!productName || !productDescription || !productPrice || !productStockQuantity || !productStatus){
    return res.status(400).json({
        message:"Please provide productName,productDescription,productPrice,productStockQuantity,productStatus"
    })
}

    const productData = await Product.create({
        productName,
        productDescription,
        productPrice,
        productStockQuantity,
        productStatus,
        productImage: "http://localhost:3500/" + filePath         // now backend developer can easily see the image in url
    })
    await productData.save();
    res.status(200).json({
        message:"Product added successfully",
        data:productData
    })
    
}



// get products
exports.getProducts = async(req,res)=>{
      const products = await Product.find();
    if(products.length == 0){
        res.status(400).json({
            message:"No products found",
            products:products
        })
    }else{
        res.status(200).json({
            message:"Products fetched successfully",
            products:products
        })
    }
  
}



// get product by id
exports.getProductById = async(req,res)=>{
    
        const id = req.params.id;
    if(!id){
        return res.status(400).json({
            message:"provide product id"
        })
    }

    const product = await Product.findById(id);
    if(product.length ==0 ){
        res.status(400).json({
            message:"No product found with that id",
            product:product
        })
    }else{
        res.status(200).json({
            message:"Product with id found successfully",
            product:product
        })
    }
}