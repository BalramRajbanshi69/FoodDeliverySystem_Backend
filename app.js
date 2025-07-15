require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 4000;
const DBConnection = require("./Database/DB")
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
DBConnection();

const {Server} = require("socket.io");   // socket.io for real-time communication
// OR
// const Server = require("socket.io").Server;   // socket.io for real-time communication

app.use(cors({
    // origin:["http://localhost:5173","http://localhost:3000"]
    // origin:"*"
origin:["https://food-delivery-system-frontend.vercel.app/","https://food-delivery-system-admin-silk.vercel.app/"]                             // give connection to connect with frontend admin(since we are trying to use socket with admin first)

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
const getAllDatasRoute = require("./routes/admin/getAllDatas");
const User = require("./model/userModel");



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
cors:["https://food-delivery-system-frontend.vercel.app/","https://food-delivery-system-admin-silk.vercel.app/"]                             // give connection to connect with frontend admin(since we are trying to use socket with admin first)
})


let onlineUsers = []

const addToOnlineUsers = (socketId,userId,role)=>{
    onlineUsers = onlineUsers?.filter((user)=>user.userId !== userId)
     onlineUsers.push({socketId,userId,role})
    // console.log(onlineUsers);
    
}

io.on("connection",async(socket)=>{                          // making connection with the frontend
            // take the token and validate   onlineusers                                        // we can also send from here too using socket.emit,  as it is full duplex and get the data in frontend  using socket.on     
        const {token} = socket.handshake.auth;
        if(token){
             const decoded = await promisify(jwt.verify)(token,JWT_SECRET);
             const doesUserExist = await User.findOne({_id:decoded.id});
             
             if(doesUserExist){
                addToOnlineUsers(socket.id,doesUserExist.id,doesUserExist.role)
             }
             
        }   
        
        // socket orderStatus change/update
        socket.on("updateOrderStatus",({status,orderId,userId})=>{
           const findUser = onlineUsers.find((user)=>user.userId == userId)
           io.to(findUser?.socketId).emit("statusUpdated",{status,orderId})       
           
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