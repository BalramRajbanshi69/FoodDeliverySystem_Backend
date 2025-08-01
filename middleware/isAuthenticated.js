// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET
// // const {promisify} = require("util");
// const User = require("../model/userModel");
// const isAuthenticated = async(req,res,next)=>{
//     const token = req.headers.authorization;
//     if(!token){
//     return res.status(403).json({
//             message:"Please login"
//         })
//     }
    // verify if token is legit or not
    // first way
//     try {
//     const data = await jwt.verify(token, JWT_SECRET);
//     req.user = data.user
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Invalid token"
//     });
//   }
// }

//   module.exports = isAuthenticated


//     // alternative waY second
//    try {
//      const decoded = await promisify(jwt.verify)(token,JWT_SECRET);
//     //  console.log("decoded",decoded);
     
//     const doesUserExist = await User.findOne({_id:decoded.id});
//     if(!doesUserExist){
//        return res.status(403).json({
//             message:"User doesnot exist with that token/id"
//         })
//     } 
//     req.user = doesUserExist
//     next()
//    } catch (error) {
//     res.status(400).json({
//         message:error.message
//     })
//    }


// // third alternative
// //  try {
// //     const data = await jwt.verify(token, JWT_SECRET);
// //     req.user = data.user;
// //     next();
// //   } catch (error) {
// //     return res.status(401).json({
// //       msg: "Invalid Token",
// //     });
// //   }



   
// }

// module.exports = isAuthenticated



// require("dotenv").config()
// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;
// const { promisify } = require("util");
// const User = require("../model/userModel");

// const isAuthenticated = async (req, res, next) => {
//     const token = req.headers.authorization;

//     // const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

//     if (!token) {
//         return res.status(403).json({
//             message: "Please login"
//         });
//     }

//     try {
//      const decoded = await promisify(jwt.verify)(token,JWT_SECRET);
//     //  console.log("decoded",decoded);
     
//     const doesUserExist = await User.findOne({_id:decoded.id});
//     if(!doesUserExist){
//        return res.status(403).json({
//             message:"User doesnot exist with that token/id"
//         })
//     } 
//     req.user = doesUserExist
//     next()
//    } catch (error) {
//     res.status(400).json({
//         message:error.message
//     })
//    }
    
// };

// module.exports = isAuthenticated;







require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { promisify } = require("util");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Please login" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    const doesUserExist = await User.findById(decoded.id);

    if (!doesUserExist) {
      return res.status(403).json({ message: "User does not exist with that token/id" });
    }

    req.user = doesUserExist;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;


