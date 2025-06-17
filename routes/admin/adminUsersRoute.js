const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const catchAsync = require("../../services/catchAsync");
const { getUsers } = require("../../controller/admin/user/userController");
const router = express.Router();


router.route("/users").get(isAuthenticated,permitTo("admin"),catchAsync(getUsers))

module.exports = router 