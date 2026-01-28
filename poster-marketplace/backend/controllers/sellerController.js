const Poster = require("../models/Poster");
const User = require("../models/User");
const Order = require("../models/Order");


// 🔍 CHECK SELLER APPROVAL
const checkSellerApproved = async (sellerId) => {
  const seller = await User.findById(sellerId);
  return seller && seller.approved === true;
};

// 🖼️ UPLOAD POSTER
exports.uploadPoster = async (req, res) => {
  try {
    const approved = await checkSellerApproved(req.user.id);
    if (!approved) {
      return res
        .status(403)
        .json({ message: "Seller not approved yet" });
    }

    const { title, price, category } = req.body;

    // ✅ SAFETY CHECK (important)
    if (!req.file) {
      return res.status(400).json({
        message: "Image upload failed"
      });
    }

    const imageUrl = req.file.path; // ✅ Cloudinary secure URL

    const poster = await Poster.create({
      title,
      imageUrl,
      price,
      category,
      seller: req.user.id,
      approved: false // ✅ poster goes to admin approval
    });

    res.status(201).json({
      message: "Poster uploaded successfully",
      poster
    });
  } catch (error) {
    console.error("Upload poster error:", error);
    res.status(500).json({
      message: "Failed to upload poster"
    });
  }
};


// 📄 GET MY POSTERS
exports.getMyPosters = async (req, res) => {
  try {
    const posters = await Poster.find({ seller: req.user.id });
    res.json(posters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💰 GET SELLER WALLET
exports.getWallet = async (req, res) => {
  try {
    const seller = await User.findById(req.user.id).select("walletBalance");
    res.json({ walletBalance: seller.walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUpiDetails = async (req, res) => {
  const settings = await AdminSettings.findOne();
  res.json({
    upiId: settings.upiId,
    upiQrUrl: settings.upiQrUrl
  });
};
exports.updateUpiId = async (req, res) => {
  const { sellerUpiId } = req.body;

  const seller = await User.findById(req.user.id);
  seller.sellerUpiId = sellerUpiId;
  await seller.save();

  res.json({ message: "UPI ID updated" });
};

exports.getEarnings = async (req, res) => {
  try {
    const seller = await User.findById(req.user.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // 1️⃣ Get seller poster IDs
    const posters = await Poster.find(
      { seller: seller._id },
      "_id"
    );

    const posterIds = posters.map(p => p._id);

    // 2️⃣ Get completed orders
    const orders = await Order.find({
      poster: { $in: posterIds },
      paymentStatus: { $in: ["paid", "delivering"] }
    }).populate("poster", "title");

    // 3️⃣ Calculate totals from orders
    const totalEarnings = orders.reduce(
      (sum, o) => sum + (o.sellerEarning || 0),
      0
    );

    res.json({
      total: totalEarnings,              // 🔥 FROM ORDERS
      available: seller.walletBalance,   // 🔥 FROM WALLET
      sold: orders.length,
      earnings: orders.map(o => ({
        posterTitle: o.poster?.title,
        amount: o.sellerEarning,
        date: o.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.requestWithdrawal = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { upiId, amount } = req.body;

    if (!upiId || !amount) {
      return res.status(400).json({
        message: "UPI ID and amount are required"
      });
    }

    if (amount < 500) {
      return res.status(400).json({
        message: "Minimum withdrawal amount is ₹500"
      });
    }

    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ message: "Not a seller" });
    }

    if (seller.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient wallet balance"
      });
    }

    const request = await WithdrawalRequest.create({
      seller: sellerId,
      amount,
      upiId
    });

    res.json({
      message: "Withdrawal request submitted",
      request
    });
  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({ message: "Withdrawal failed" });
  }
};

const WithdrawalRequest = require("../models/WithdrawalRequest");

exports.getMyWithdrawals = async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({
      seller: req.user.id
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
