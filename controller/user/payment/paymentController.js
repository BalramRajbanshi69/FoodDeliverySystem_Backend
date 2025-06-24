const { default: axios } = require("axios");
const Order = require("../../../model/orderModel");

exports.initializeKhaltiPayment = async(req,res)=>{
    const {orderId,amount}= req.body;             // orderId is the unique ID for the order, amount is the total amount to be paid in paisa
    if(!orderId || !amount) {
        return res.status(400).json({message: "Order ID and amount are required"});
    }

    const data ={
        return_url : "http://localhost:3500/api/payment/success",  // /api/payment is from app.js api        // return URL where the user will be redirected after payment
        amount:amount,                          // amount in paisa
        purchase_order_id: orderId, 
        purchase_order_name: "orderName_" + orderId,           // purchase order name, you can use any name you want
        website_url : "http://localhost:3500",      // website URL where the user will be redirected after payment

    }

   const response= await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/",data,{
        headers:{
            "Authorization": "key 0deafccdf04347dd81eb9d80c5611a05",
            "Content-Type": "application/json"
        }
    })
    // console.log(response.data);
    let order = await Order.findById(orderId); // find the order by ID
    order.paymentDetails.pidx = response.data.pidx; // store the pidx in the order
    await order.save(); // save the order with the pidx
    res.redirect(response.data.payment_url); // redirect the user to the payment page
    
    
}


// verfify payment/ payment verification
exports.verifyPidx = async(req,res)=>{
    const app = require("../../../app"); // import the app to use the server
    const io = app.getSocketId();
    const pidx = req.query.pidx; // pidx is the payment ID returned by Khalti after payment
    // directly
    const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/",{pidx},{
        headers:{
           "Authorization": "key 0deafccdf04347dd81eb9d80c5611a05",
            "Content-Type": "application/json" 
        }
    })

    if(response.data.status === "Completed"){
        // database modification
        let order = await Order.find({ "paymentDetails.pidx": pidx }); // find the order by pidx
        order[0].paymentDetails.method = "khalti"; // set the payment method to khalti
        order[0].paymentDetails.status = "paid"; // set the payment status to paid
        await order[0].save(); // save the order with the updated payment details
        
        



        // get the socket.io instance from the app
        io.on("connection",(socket)=>{
            io.to(socket.id).emit("payment",{message:"Payment successful"})
        })
        // notify to frontend that payment is successful
        io.emit("payment",{message:"Payment successful"}); // emit the payment event to all connected users
        // res.redirect("http://localhost:3500");
        // database modification
    }else{
        // notify to frontend that payment is failed
        io.on("connection",(socket)=>{
            io.to(socket.id).emit("payment",{message:"Payment error"})
        })
        // res.redirect("http://localhost:3500/errorPage");
    }
    
}