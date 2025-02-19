const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const stakeController = require("../controller/stake.controller");

router.post("/register",userController.register)

router.post("/stake",stakeController.addStake);

module.exports = router;