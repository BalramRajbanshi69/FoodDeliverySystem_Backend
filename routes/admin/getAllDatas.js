const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const catchAsync = require("../../services/catchAsync");
const { getAllDatas } = require("../../controller/admin/misc/datas");
const router = express.Router();

router.route("/misc/getAllDatas").get(isAuthenticated,permitTo("admin"),catchAsync(getAllDatas))

module.exports = router