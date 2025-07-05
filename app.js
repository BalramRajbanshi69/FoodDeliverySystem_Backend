require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 4000;
const DBConnection = require("./Database/DB")
DBConnection();

const {Server} = require("socket.io");   // socket.io for real-time communication
// OR
// const Server = require("socket.io").Server;   // socket.io for real-time communication

app.use(cors({
    origin:"*"
}))
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
const adminOrderRoute = require("./routes/admin/adminOrderRoute")
const paymentRoute = require("./routes/user/paymentRoute");
const getAllDatasRoute = require("./routes/admin/getAllDatas")



// middleware
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/admin",adminUsersRoute)
app.use("/api/admin",adminOrderRoute)
app.use("/api/admin",getAllDatasRoute)
app.use("/api/reviews",userReviewRoute)
app.use("/api/profile",profileRoute)
app.use("/api/cart",cartRoute)
app.use("/api/order",orderRoute)
app.use("/api/payment",paymentRoute)



app.get("/",(req,res)=>{
    res.send("Hello world!");
    console.log("hello world!");   
})


const server = app.listen(PORT,(req,res)=>{                 // starting the server
    console.log(`The server is running on PORT ${PORT}`);  
})

const io = new Server(server,{                              // initializing socket.io with the server
cors:"http://localhost:3000"                             // give connection to connect with frontend admin(since we are trying to use socket with admin first)
})



io.on("connection",(socket)=>{                          // making connection with the frontend
    socket.on("hello",(data)=>{                          // to get data use socket.io , to give data use .emit
        console.log(data);                               // we can also send from here too using socket.emit,  as it is full duplex and get the data in frontend  using socket.on
        
    })
})









// io.on("connection",(socket)=>{                              // listening for connection event
//     // console.log('A User connected');                        // when a user connects, this event is triggered
//     // socket.on("disconnect",()=>{
//     //     console.log('A User disconnected');       // when a user disconnects, this event is triggered
 
//     socket.on("register",async(data)=>{                        // when a user sends a message, this event is triggered
//         const {email,userName,phoneNumber,password} = data;
//         // await User.create({
//         //     userEmail:email,
//         //     userName:userName,
//         //     userPhoneNumber:phoneNumber,
//         //     userPassword:password
//         // })
//         // socket.emit("response",{message:"User registered successfully"});  // sending a response back to the user
//         io.to(socket.id).emit("response",{message:"User registered successfully"});   // io.to(socket.id) sends the response to the specific user who registered
//         // console.log("A user registered");   
//     })   
//     })


const getSocketId = ()=>{
    return io
}

module.exports.getSocketId = getSocketId;  // exporting the getSocketId function to use it in other files