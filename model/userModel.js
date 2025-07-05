const mongoose = require("mongoose");
const {Schema} = mongoose;
const userSchema = new Schema({
    userName:{
        type:String,
        required:[true,"Username is required"],
        unique:true
    },
    userPassword:{
        type:String,
        required:[true,"UserPassword must be provided"],
        // select:false
        
    },
    userEmail:{
        type:String,
        unique:true,
        required:[true,"UserEmail is required"],
        lowercase:true
    },
    userPhoneNumber:{
        type:Number,
        required:[true,"UserPhoneNumber is required"]
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
    otp:{
        type:Number,
        select:false
    },
    isOtpVerified : {
        type : Boolean,
        default : false,
        select:false
    },
    cart:[
        {
        quantity:{
            type:Number,
            required:true
        },
        product:{type:Schema.Types.ObjectId, ref:"Product"}
    }],

     createdAt: {
        type: Date,
        default: Date.now
    }
        
},{
    timeStamps:true
})

const User = mongoose.model("User",userSchema);
module.exports = User