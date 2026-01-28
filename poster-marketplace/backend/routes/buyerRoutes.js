const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getPosters,
  createOrder,
  getMyOrders,
  confirmPayment 
} = require("../controllers/buyerController");

// 🔐 BUYER ONLY ROUTES
router.use(authMiddleware);
router.use(roleMiddleware(["buyer"]));

router.get("/posters", getPosters);
router.post("/order", createOrder);

// ✅ BUYER CONFIRMS UPI PAYMENT
router.post("/confirm-payment", confirmPayment);

router.get("/my-orders", getMyOrders);

module.exports = router;
