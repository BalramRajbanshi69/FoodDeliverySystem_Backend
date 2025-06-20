const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");
const { getMyReview, deleteProductReview, createReview } = require("../../controller/user/review/reviewController");

const router = express.Router();

router.route("/").get(isAuthenticated,catchAsync(getMyReview))  
router.route("/:id")
.delete(isAuthenticated,catchAsync(deleteProductReview))       // to delete review user must be loggedin
.post(isAuthenticated,catchAsync(createReview))              // to add review user must be loggedin 



module.exports = router