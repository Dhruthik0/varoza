const Poster = require("../models/Poster");

const AdminSettings = require("../models/AdminSettings");
const User = require("../models/User");
const Order = require("../models/Order");


// SET PROFIT MARGIN %
exports.setMargin = async (req, res) => {
  try {
    const { marginPercentage } = req.body;

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    settings.marginPercentage = marginPercentage;
    await settings.save();

    res.json({
      message: "Margin updated successfully",
      marginPercentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SET DISCOUNT %
exports.setDiscount = async (req, res) => {
  try {
    const { discountPercentage } = req.body;

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    settings.discountPercentage = discountPercentage;
    await settings.save();

    res.json({
      message: "Discount updated successfully",
      discountPercentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE SELLER
exports.approveSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== "seller") {
      return res.status(400).json({ message: "Invalid seller" });
    }

    seller.approved = true;
    await seller.save();

    res.json({ message: "Seller approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// APPROVE POSTER
exports.approvePoster = async (req, res) => {
  try {
    const { posterId } = req.body;

    const poster = await Poster.findById(posterId);
    if (!poster) {
      return res.status(404).json({ message: "Poster not found" });
    }

    poster.approved = true;
    await poster.save();

    res.json({ message: "Poster approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// SET UPI DETAILS
exports.setUpiDetails = async (req, res) => {
  try {
    const { upiId, upiQrUrl, minimumPayout } = req.body;

    let settings = await AdminSettings.findOne();
    if (!settings) settings = new AdminSettings();

    settings.upiId = upiId;
    settings.upiQrUrl = upiQrUrl;
    settings.minimumPayout = minimumPayout;

    await settings.save();

    res.json({ message: "UPI details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// VERIFY PAYMENT (ADMIN MANUAL CONFIRM)
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId)
      .populate("items.poster");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "paid" || order.paymentStatus === "delivering") {
      return res.status(400).json({
        message: "Order already processed"
      });
    }

    // 1️⃣ Mark as paid
    order.paymentStatus = "paid";
    await order.save();

    // 2️⃣ Credit each seller
    for (const item of order.items) {
      const seller = await User.findById(item.poster.seller);
      if (!seller) continue;

      seller.walletBalance += item.sellerEarning;
      await seller.save();
    }

    res.json({
      message: "Payment verified & sellers credited",
      order
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: error.message });
  }
};


// REJECT PAYMENT (ADMIN)
exports.rejectPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "rejected";
    await order.save();

    res.json({ message: "Payment rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET PENDING SELLERS
exports.getPendingSellers = async (req, res) => {
  const sellers = await User.find({
    role: "seller",
    approved: false,
  }).select("name email");
  res.json(sellers);
};

// GET PENDING POSTERS
exports.getPendingPosters = async (req, res) => {
  const posters = await Poster.find({ approved: false }).populate(
    "seller",
    "name email"
  );
  res.json(posters);
};



exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentStatus: "verification_pending"
    })
      .populate("buyer", "name email")
      .populate("items.poster", "title price imageUrl")

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId)
      .populate("items.poster");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus !== "verification_pending") {
      return res.status(400).json({
        message: "Order already processed"
      });
    }

    // Credit sellers
    for (const item of order.items) {
      const seller = await User.findById(item.poster.seller);
      if (!seller) continue;

      seller.walletBalance += item.sellerEarning;
      await seller.save();
    }

    order.paymentStatus = "delivering";
    await order.save();

    res.json({
      message: "Payment approved, sellers credited, delivery started",
      order
    });

  } catch (error) {
    console.error("Approve order error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📊 ADMIN ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentStatus: { $in: ["paid", "delivering"] }
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const totalAdminMargin = orders.reduce(
      (sum, o) =>
        sum +
        (o.items || []).reduce(
          (itemSum, item) => itemSum + (item.adminMargin || 0),
          0
        ),
      0
    );

    const totalSellerEarning = orders.reduce(
      (sum, o) =>
        sum +
        (o.items || []).reduce(
          (itemSum, item) => itemSum + (item.sellerEarning || 0),
          0
        ),
      0
    );

    res.json({
      totalOrders,
      totalRevenue,
      totalAdminMargin,
      totalSellerEarning
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const WithdrawalRequest = require("../models/WithdrawalRequest");


/**
 * 📥 Get all pending withdrawal requests
 */
exports.getWithdrawalRequests = async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find()
      .populate("seller", "name email walletBalance")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 💸 Mark withdrawal as PAID
 */
exports.approveWithdrawal = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await WithdrawalRequest.findById(requestId)
      .populate("seller");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request already processed" });
    }

    // Deduct from seller wallet
    const seller = await User.findById(request.seller._id);

    if (seller.walletBalance < request.amount) {
      return res.status(400).json({
        message: "Seller wallet balance insufficient"
      });
    }

    seller.walletBalance -= request.amount;
    await seller.save();

    request.status = "paid";
    await request.save();

    res.json({
      message: "Withdrawal marked as PAID",
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ❌ Reject withdrawal
 */
exports.rejectWithdrawal = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await WithdrawalRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Withdrawal rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🚚 SET SHIPPING CHARGE (ADMIN)
exports.setShippingCharge = async (req, res) => {
  try {
    const { shippingCharge } = req.body;

    if (shippingCharge < 0) {
      return res.status(400).json({ message: "Invalid shipping charge" });
    }

    let settings = await AdminSettings.findOne();
    if (!settings) settings = new AdminSettings();

    settings.shippingCharge = Number(shippingCharge);
    await settings.save();

    res.json({
      message: "Shipping charge updated successfully",
      shippingCharge: settings.shippingCharge
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update shipping charge" });
  }
};


// 🚚 GET SHIPPING CHARGE (BUYER)
exports.getShippingCharge = async (req, res) => {
  try {
    const settings = await AdminSettings.findOne();
    res.json({
      shippingCharge: settings?.shippingCharge || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🎟️ ADD COUPON (ADMIN)
exports.addCoupon = async (req, res) => {
  try {
    const { code, type, discountPercent, buyQuantity, freeQuantity } = req.body;

    let settings = await AdminSettings.findOne();
    if (!settings) settings = new AdminSettings();

    settings.coupons = settings.coupons || [];

    const newCoupon = {
      code: code.toUpperCase(),
      type: type || "PERCENTAGE",
      isActive: true
    };

    // ✅ If Percentage Coupon
    if (type === "PERCENTAGE" || !type) {
      if (!discountPercent) {
        return res.status(400).json({
          message: "Discount percent is required"
        });
      }
      newCoupon.discountPercent = discountPercent;
    }

    // ✅ If Buy X Get Y Coupon
    if (type === "BUY_X_GET_Y") {
      if (!buyQuantity || !freeQuantity) {
        return res.status(400).json({
          message: "Buy and Free quantities are required"
        });
      }
      newCoupon.buyQuantity = buyQuantity;
      newCoupon.freeQuantity = freeQuantity;
    }

    settings.coupons.push(newCoupon);

    await settings.save();

    res.json({ message: "Coupon added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ REMOVE COUPON (ADMIN)
exports.removeCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const settings = await AdminSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    settings.coupons = settings.coupons.filter(
      (c) => c.code !== code.toUpperCase()
    );

    await settings.save();

    res.json({ message: "Coupon removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🎯 VALIDATE COUPON (BUYER)
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const settings = await AdminSettings.findOne();

    const coupon = settings?.coupons.find(
      (c) => c.code === code.toUpperCase() && c.isActive === true
    );

    if (!coupon) {
      return res.status(400).json({
        message: "Coupon is invalid or disabled"
      });
    }

    // ✅ If Percentage Coupon
    if (coupon.type === "PERCENTAGE") {
      return res.json({
        type: "PERCENTAGE",
        discountPercent: coupon.discountPercent
      });
    }

    // ✅ If Buy X Get Y Coupon
    if (coupon.type === "BUY_X_GET_Y") {
      return res.json({
        type: "BUY_X_GET_Y",
        buyQuantity: coupon.buyQuantity,
        freeQuantity: coupon.freeQuantity
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCoupons = async (req, res) => {
  const settings = await AdminSettings.findOne();
  res.json(settings?.coupons || []);
};

exports.toggleCoupon = async (req, res) => {
  const { code, isActive } = req.body;

  const settings = await AdminSettings.findOne();
  const coupon = settings.coupons.find(
    c => c.code === code.toUpperCase()
  );

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  coupon.isActive = isActive;
  await settings.save();

  res.json({ message: "Coupon updated" });
};
