const User = require("../../../model/userModel");
const bcrypt = require('bcryptjs')

exports.getMyProfile = async(req,res)=>{
    const userId = req.user.id;
    const profile = await User.findById(userId);
    res.status(200).json({
        message:"Profile fetched successfully",
        data:profile 
    })
}


exports.updateProfile = async(req,res)=>{
    const userId = req.user.id;
    const {userName,userEmail,userPhoneNumber} = req.body;
    const updatedData = await User.findByIdAndUpdate(userId,{
        userName,
        userEmail,
        userPhoneNumber
    },{                   // set User model, userEmail to unique
        runValidators:true,
        new:true
    })
    res.status(200).json({
        message:"Profile updated successfully",
        data:updatedData
    })
    
    
}



// delete profile
exports.deleteMyProfile = async(req,res)=>{
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
        message:"Profile deleted successfully",
        data:null
    })
}



// updateProfilePassword
exports.updateMyPassword = async(req,res)=>{                // to update my password , you need to have oldPassword, newPassword for new and confirmPassword to confirm that new Password
    const userId = req.user.id;
    const {oldPassword,newPassword,confirmPassword} = req.body;
    if(!oldPassword || !newPassword || !confirmPassword){          // it should not be empty
        return res.status(400).json({
            message:"Please provide oldPassword, newPassword and confirmNewPassword"
        })
    }
 
    if(newPassword !== confirmPassword){        // check if new created password and confirm password match if not show error
        return res.status(400).json({
            message:"NewPassword and confirmPassword doesnot match"
        })
    }

    // taking out hash of oldPassword
    const userData = await User.findById(userId);
    const hashedOldPassword = userData.userPassword

    // check if oldpassword is correct or not
    const isOldPasswordCorrect = bcrypt.compareSync(oldPassword,hashedOldPassword);
    if(!isOldPasswordCorrect){
        return res.status(400).json({
            message:"OldPassword didnot matched"
        })
    }

    // if matched, hash newPassword
    userData.userPassword = bcrypt.hashSync(newPassword,12);
    await userData.save();
    res.status(200).json({
        message:"Password changed successfully"
    })
}