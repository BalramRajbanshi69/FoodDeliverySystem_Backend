require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const DBConnection = require("./Database/DB")
DBConnection();


app.use(express.json());
app.use(express.urlencoded({extended : true}))


// telling node.js to give access to uploads folder so that backend database can see the image make public
// app.use(express.static("./"))   // if you want to make public all of them localhost:PORT/whatyouwanttoaccess  
// multer    
app.use(express.static("./uploads"))      


// ROUTES
const authRoute = require("./routes/auth/authRoute");
const productRoute = require("./routes/admin/productRoute")
const adminUsersRoute = require("./routes/admin/adminUsersRoute")
const userReviewRoute = require("./routes/user/userReviewRoute")
const profileRoute = require("./routes/user/profileRoute")
const cartRoute = require("./routes/user/cartRoute")
const orderRoute = require("./routes/user/orderRoute")



// middleware
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/admin",adminUsersRoute)
app.use("/api/reviews",userReviewRoute)
app.use("/api/profile",profileRoute)
app.use("/api/cart",cartRoute)
app.use("/api/order",orderRoute)



app.get("/",(req,res)=>{
    res.send("Hello world!");
    console.log("hello world!");   
})


app.listen(PORT,(req,res)=>{
    console.log(`The server is running on PORT ${PORT}`);  
})
