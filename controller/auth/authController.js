const bcrypt = require("bcryptjs");
const User = require("../../model/userModel")
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../../services/sendEmail");
const JWT_SECRET=process.env.JWT_SECRET;

// register user
exports.registerUser = async(req,res)=>{
const {email,password,phoneNumber,username} = req.body
    if(!email || !password || !phoneNumber || !username){
       return res.status(400).json({
            message : "Please provide email,password,phoneNumber"
        })
    }
    // check if that email user already exist or not
   const userFound =  await User.find({userEmail : email})
    if(userFound.length > 0 ){
        return res.status(400).json({
            message : "User with that email already registered",
            data : []
        })
    }
    // alternative way
    // const userFound = await User.findOne({userEmail:email});
    // if(userFound){
    //     ....user already registered
    // }

    // else 
    const userData = await User.create({
        userName : username,
        userPhoneNumber : phoneNumber,
        userEmail : email,
        userPassword : bcrypt.hashSync(password,10)
    })

    res.status(201).json({
        message : "User registered successfully",
      
    })
  }



// login user
exports.loginUser = async(req,res)=>{
    try {
      const {email,password} = req.body;
      
      if(!email || !password){
        return res.status(400).json({
          message:"Please fill all the required fields!"
        })
      }

      const userFound = await User.find({userEmail:email});
      if(userFound.length == 0){
        return res.status(400).json({
          message:"User with that email not registered"
        })
      }

    //   alternative way
      // const userFound = await User.findOne({userEmail:email});
    // if(!userFound){
    //     user not registered yet
    // }

      const isMatched = bcrypt.compareSync(password,userFound[0].userPassword);
      if(!isMatched){
        res.status(400).json({
          message:"Invalid credentials"
        })
      }else{
        const token = jwt.sign({id:userFound[0]._id},JWT_SECRET,{
          expiresIn:"30d"
        })
        return res.status(200).json({
          message:"User logged in successfully",
          data:userFound,
          token:token
        })
      }
    } catch (error) {
      
    }
  }


  // forgot Password
  exports.forgotPassword = async(req,res)=>{
    const {email} = req.body
    if(!email){
      return res.status(400).json({
        message:"Email is required!"
      })
    }

    // check if that email is registered or not
    const userExist = await User.find({userEmail:email});
    if(userExist.length == 0){
     return res.status(404).json({
        message:"Email is not registered"
      })
    }

    // send otp to email
    const otp = Math.floor(1000 + Math.random() * 9000);
    userExist[0].otp = otp
    await userExist[0].save();
     await sendEmail({
      email:email,
      subject:"Your OTP to for OnlineFoodDeliverySystem ",
      message:`Your otp is ${otp}. Please don't share to anyone!`
    })
      res.status(200).json({
        message:"Email sent successfully"  
      })
    
  }


  // verify OTP
 exports.verifyOtp = async(req,res)=>{
  const {email,otp} = req.body;
  if(!email || !otp){
    return res.status(400).json({
      "message":"Please provide email and otp"
    })
  }

  // check if user email is registered or not
  const userExist = await User.find({userEmail:email});
  if(userExist.length == 0){
    return res.status(404).json({
      "message":"Email is not registered"
    })
  }

  // check if otp is correct or not
  if(userExist[0].otp !== otp){
    res.status(400).json({
      "message":"invalid otp"
    })
  }else{
    // dispost the otp so that same otp cannot be used next time
    userExist[0].otp = undefined;
    userExist[0].isOtpVerified= true
    await userExist[0].save();
    res.status(200).json({
      "message":"otp is correct"
    })
  }
 }



//  reset password
exports.resetPassword = async(req,res)=>{
  const {email,newPassword,confirmPassword} = req.body;
  if(!email || !newPassword || !confirmPassword){
    return res.status(400).json({
      message:"Please provide email,newPassword and confirmPassword"
    })
  }

  // check if newpassword and confirmpassword match
  if(newPassword !== confirmPassword){
    return res.status(400).json({
      message:"NewPassword and confirm Password doesnot match"
    })
  }

  const userExist = await User.find({userEmail:email});
  if(userExist.length == 0){
    return res.status(404).json({
      message:"User email is not registered"
    })
  }

  if(userExist[0].isOtpVerified !== true){
    return res.status(403).json({
      message:"You cannot perform this action"
    })
  }

  userExist[0].userPassword = bcrypt.hashSync(newPassword,10);
  userExist[0].isOtpVerified = false;
  await userExist[0].save();
  res.status(200).json({
    message:"Password changed successfully"
  })
}


  
