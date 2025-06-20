const { addToCart, getMyCartItems, removeFromCart, editCart } = require('../../controller/user/cart/cartController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const catchAsync = require('../../services/catchAsync');

const router = require('express').Router();

router.route("/:id")
.post(isAuthenticated,catchAsync(addToCart))  // we are adding products in a cart with that product id , productId = req.params.id (if req.params.productId, then need to use route("/:productId"))->remember
.delete(isAuthenticated,catchAsync(removeFromCart)) // remove product from cart with that product id , productId = req.params.id (if req.params.productId, then need to use route("/:productId"))
router.route("/").get(isAuthenticated,catchAsync(getMyCartItems)) // get all cart items of that user

module.exports = router;