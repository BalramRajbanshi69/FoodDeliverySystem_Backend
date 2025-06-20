const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const catchAsync = require("../../services/catchAsync");
const { getUsers, deleteUser } = require("../../controller/admin/user/userController");
const router = express.Router();


router.route("/users").get(isAuthenticated,permitTo("admin"),catchAsync(getUsers))
router.route("/users/:id").delete(isAuthenticated,permitTo("admin"),catchAsync(deleteUser))


module.exports = router   