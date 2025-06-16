const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");
const MONGO_URI = process.env.MONGO_URI;

const DBConnection = async()=>{
try {
    await mongoose.connect(MONGO_URI)
    console.log("Database connected successfully");
    // admin seeding function
    adminSeeder();
   
} catch (error) {
    console.error("server error");
    
}
    
    
}

module.exports= DBConnection





