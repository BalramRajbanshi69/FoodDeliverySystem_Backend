const User = require("../../../model/userModel")


exports.getUsers = async(req,res)=>{
    // const users = await User.find().select("-userPassword").select("-role"); this is the way to whom common users cannot see the admin role, password
    // const users = await User.find().select(["+userPassword","+isOtpVerified","-__v"]); //taking multiple arguments
    const users = await User.find().select(["+otp","+isOtpVerified","-__v"]);
    if(users.length > 1){
        res.status(200).json({
            message:"Users fetched successfully",
            data:users
        })
    }else{
        res.status(404).json({
            message:"Users collection is empty!",
            data:[]
        })
    }
}

