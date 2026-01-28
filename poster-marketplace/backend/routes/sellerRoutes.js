const express = require("express");   // ✅ MISSING LINE
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// 👉 CONTROLLER FUNCTIONS
const {
  uploadPoster,          // controller
  getMyPosters,
  getWallet,
  updateUpiId,
  getEarnings,
  requestWithdrawal,
  getMyWithdrawals
} = require("../controllers/sellerController");

// 👉 MULTER MIDDLEWARE
const upload = require("../middleware/uploadPoster");

// 🔐 SELLER ONLY ROUTES
router.use(authMiddleware);
router.use(roleMiddleware(["seller"]));

/**
 * 🖼️ UPLOAD POSTER (IMAGE → CLOUDINARY → DB)
 */
router.post(
  "/upload",
  upload.single("image"),
  uploadPoster
);

router.get("/my-posters", getMyPosters);
router.get("/wallet", getWallet);
router.post("/update-upi", updateUpiId);
router.get("/earnings", getEarnings);
router.get("/withdrawals", getMyWithdrawals);
router.post("/withdraw", requestWithdrawal);

module.exports = router;
