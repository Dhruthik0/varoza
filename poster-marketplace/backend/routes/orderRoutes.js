const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createOrder,
  markOrderAsPaid,
  getMyOrders
} = require("../controllers/orderController");

// 🛒 Buyer creates order
router.post("/create", authMiddleware, createOrder);

// 💳 Buyer confirms UPI payment
router.post("/mark-paid", authMiddleware, markOrderAsPaid);

// 📦 Buyer views own orders
router.get("/my-orders", authMiddleware, getMyOrders);

module.exports = router;
