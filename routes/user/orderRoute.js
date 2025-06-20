const { createOrder, getMyOrders, getSingleOrder, deleteOrder } = require('../../controller/user/order/orderController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const catchAsync = require('../../services/catchAsync');

const router = require('express').Router();

router.route("/")
.post(isAuthenticated, catchAsync(createOrder))  // create a new order
.get(isAuthenticated, catchAsync(getMyOrders));   // get all orders of that user  

//single order
router.route("/:orderId")
.get(isAuthenticated,catchAsync(getSingleOrder))     // why :orderId? because we want to get a single order by its ID, which is passed as a parameter in the URL
.delete(isAuthenticated,catchAsync(deleteOrder));      // delete a single order by its ID, which is passed as a parameter in the URL


module.exports = router;