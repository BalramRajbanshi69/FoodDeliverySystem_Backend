// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {

//     //  check the mimetype of file to be uploaded
//     const allowedFileTypes = ["image/jpg","image/png","image/jpeg"];
//     if(!allowedFileTypes.includes(file.mimetype)){
//         cb(new Error("This file cannot be supported"))  // cb means callback(err,success)
//         return
//     }

//     cb(null, './uploads')  // ./uploads where you want to have your images files in root
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now()+"-"+ file.originalname)   // Date.now will show the date in millisecond to override multiple same file upload
//   }
// })

// module.exports= {multer,storage}

const multer = require("multer");

const path = require("path");

const fs = require("fs");

// Ensure uploads directory exists

const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });

  console.log("Created uploads directory");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check the mimetype of file to be uploaded

    const allowedFileTypes = ["image/jpg", "image/png", "image/jpeg"];

    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "This file type is not supported. Only JPG, PNG, and JPEG files are allowed."
        )
      );
    }

    cb(null, uploadsDir); // Use absolute path to uploads directory
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and original name

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const fileExtension = path.extname(file.originalname);

    const baseName = path.basename(file.originalname, fileExtension);

    const finalName = `${uniqueSuffix}-${baseName}${fileExtension}`;

    cb(null, finalName);
  },
});

// File filter for additional validation

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpg", "image/png", "image/jpeg"];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "This file type is not supported. Only JPG, PNG, and JPEG files are allowed."
      ),
      false
    );
  }
};

// Create multer instance with configuration

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },

  fileFilter: fileFilter,
});

module.exports = { upload, storage };
