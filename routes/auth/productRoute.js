const express = require("express");
const { createProduct, getProducts, getProductById } = require("../../controller/admin/products/productController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const router = express.Router();


// accessing multer file handling image
const {multer,storage} = require("../../middleware/multerConfig");   // importing multer,storage from multerConfig.js
const catchAsync = require("../../services/catchAsync");
const upload = multer({storage:storage})    

// here before creating products , need to see if somebody user/admin/super-admin/customer is logged in authenticated or not. After give access/permission to customer/admin/super-admin to whom you want to give permission to create products,
//  after if need to create image in products before creating products need multer . 
router.route("/products")
.post(isAuthenticated,permitTo("admin"),upload.single("productImage"), catchAsync(createProduct))
.get(catchAsync(getProducts))    // since authentication is not required , because usually we see the products without loggin to it e.g Daraz . So ,if no authentication no authorization(restrictTo/permissin)


router.route("/products/:id").get(catchAsync(getProductById))
module.exports = router