const { getMyProfile, deleteMyProfile, updateProfile, updateMyPassword } = require("../../controller/user/profile/profileController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

// route to get,delete and update profile
router.route("/")
.get(isAuthenticated,catchAsync(getMyProfile))
.delete(isAuthenticated,catchAsync(deleteMyProfile))
.patch(isAuthenticated,catchAsync(updateProfile))

// route to update password of profile
router.route("/changePassword").patch(isAuthenticated,catchAsync(updateMyPassword))

module.exports = router