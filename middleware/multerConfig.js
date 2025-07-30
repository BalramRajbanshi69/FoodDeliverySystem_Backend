// const multer = require("multer");
// const path = require("path")
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {

//     //  check the mimetype of file to be uploaded
//     const allowedFileTypes = ["image/jpg","image/png","image/jpeg"];
//     if(!allowedFileTypes.includes(file.mimetype)){
//         cb(new Error("This file cannot be supported"))  // cb means callback(err,success)
//         return 
//     }
    
//     // cb(null, './uploads')  // ./uploads where you want to have your images files in root 
//     cb(null, path.join(__dirname, 'uploads')); // Use absolute path
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now()+"-"+ file.originalname)   // Date.now will show the date in millisecond to override multiple same file upload
//   }
// })

// module.exports= {multer,storage}  








const multer = require("multer");
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check the mimetype of the file to be uploaded
    const allowedFileTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (!allowedFileTypes.includes(file.mimetype)) {
        cb(new Error("This file cannot be supported")); // cb means callback(err, success)
        return;
    }
    
    cb(null, uploadsDir); // Use absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Date.now will show the date in milliseconds to override multiple same file uploads
  }
});

module.exports = { multer, storage };
