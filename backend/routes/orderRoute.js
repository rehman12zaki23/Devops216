const express = require("express");
const {createOrder, getUserOrders} = require("../controllers/orderController");

const router = express.Router();

router.post("/orderdetail", createOrder);
router.get("/user/:userId", getUserOrders);

module.exports = router;