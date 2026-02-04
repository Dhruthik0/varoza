// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// const AdminSettings = require("../models/AdminSettings");
// const { getAnalytics } = require("../controllers/adminController");

// const {
//   getWithdrawalRequests,
//   approveWithdrawal,
//   rejectWithdrawal
// } = require("../controllers/adminController");

// const {
//   setMargin,
//   setDiscount,
//   setUpiDetails,
//   approveSeller,
//   getPendingSellers,
//   approvePoster,
//   getPendingPosters,
//   verifyPayment,
//   rejectPayment,
//   approveOrderPayment,
//   getPendingOrders
// } = require("../controllers/adminController");

// /* ===========================
//    PUBLIC (AUTH ONLY) – UPI DETAILS
//    Buyer MUST be able to access this
// =========================== */
// router.get("/upi", authMiddleware, async (req, res) => {
//   const settings = await AdminSettings.findOne();

//   if (!settings) {
//     return res.status(404).json({
//       message: "UPI not configured"
//     });
//   }

//   res.json({
//     upiId: settings.upiId,
//     upiQrUrl: settings.upiQrUrl
//   });
// });

// /* ===========================
//    🔐 ADMIN-ONLY ROUTES
// =========================== */
// router.use(authMiddleware);
// router.use(roleMiddleware(["admin"]));

// router.post("/set-margin", setMargin);
// router.post("/set-discount", setDiscount);
// router.post("/set-upi", setUpiDetails);

// router.get("/pending-sellers", getPendingSellers);
// router.post("/approve-seller", approveSeller);

// router.get("/pending-posters", getPendingPosters);
// router.post("/approve-poster", approvePoster);

// router.post("/verify-payment", verifyPayment);
// router.post("/reject-payment", rejectPayment);
// router.post("/approve-order", approveOrderPayment);
// router.get("/pending-orders", getPendingOrders);
// router.post("/approve-order", approveOrderPayment);
// router.get("/analytics", getAnalytics);
// //WITHDRAWAL REQUESTS
// router.get("/withdrawals", getWithdrawalRequests);
// router.post("/withdrawals/approve", approveWithdrawal);
// router.post("/withdrawals/reject", rejectWithdrawal);



// module.exports = router;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const AdminSettings = require("../models/AdminSettings");
const { getAnalytics } = require("../controllers/adminController");

const {
  getWithdrawalRequests,
  approveWithdrawal,
  rejectWithdrawal
} = require("../controllers/adminController");

const {
  setMargin,
  setDiscount,
  setUpiDetails,
  approveSeller,
  getPendingSellers,
  approvePoster,
  getPendingPosters,
  verifyPayment,
  rejectPayment,
  approveOrderPayment,
  getPendingOrders
} = require("../controllers/adminController");

// ✅ NEW – SHIPPING & COUPONS
const {
  setShippingCharge,
  getShippingCharge,
  addCoupon,
  removeCoupon,
  validateCoupon
} = require("../controllers/adminController");

router.get("/upi", authMiddleware, async (req, res) => {
  const settings = await AdminSettings.findOne();

  if (!settings) {
    return res.status(404).json({ message: "UPI not configured" });
  }

  res.json({
    upiId: settings.upiId,
    upiQrUrl: settings.upiQrUrl
  });
});

/* ===========================
   🔐 ADMIN-ONLY ROUTES
=========================== */
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.post("/set-margin", setMargin);
router.post("/set-discount", setDiscount);
router.post("/set-upi", setUpiDetails);

router.get("/pending-sellers", getPendingSellers);
router.post("/approve-seller", approveSeller);

router.get("/pending-posters", getPendingPosters);
router.post("/approve-poster", approvePoster);

router.post("/verify-payment", verifyPayment);
router.post("/reject-payment", rejectPayment);
router.post("/approve-order", approveOrderPayment);
router.get("/pending-orders", getPendingOrders);
router.get("/analytics", getAnalytics);// WITHDRAWALS
router.get("/withdrawals", getWithdrawalRequests);
router.post("/withdrawals/approve", approveWithdrawal);
router.post("/withdrawals/reject", rejectWithdrawal);

/* ===========================
 SHIPPING
=========================== */
router.post("/shipping", setShippingCharge);
router.get("/shipping", getShippingCharge);

/* ===========================
COUPONS
=========================== */
router.post("/coupon", addCoupon);
router.delete("/coupon/:code", removeCoupon);
router.post("/coupon/validate", validateCoupon);

module.exports = router;
