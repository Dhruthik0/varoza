const Poster = require("../models/Poster");
const Order = require("../models/Order");
const AdminSettings = require("../models/AdminSettings");

// 🛍️ GET ALL APPROVED POSTERS (WITH DISCOUNT)
exports.getPosters = async (req, res) => {
  try {
    const settings = await AdminSettings.findOne();
    const discount = settings ? settings.discountPercentage : 0;

    const posters = await Poster.find({ approved: true }).populate(
      "seller",
      "name"
    );

    const postersWithDiscount = posters.map((p) => {
      const discountedPrice =
        p.price - (p.price * discount) / 100;

      return {
        _id: p._id,
        title: p.title,
        imageUrl: p.imageUrl,
        category: p.category,
        originalPrice: p.price,
        discountPercentage: discount,
        finalPrice: discountedPrice,
        sellerName: p.seller.name
      };
    });

    res.json(postersWithDiscount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧾 CREATE ORDER (NO PAYMENT YET)
exports.createOrder = async (req, res) => {
  try {
    const { posterId } = req.body;

    const poster = await Poster.findById(posterId);
    if (!poster || !poster.approved) {
      return res.status(400).json({ message: "Poster not available" });
    }

    const settings = await AdminSettings.findOne();
    const discount = settings ? settings.discountPercentage : 0;
    const margin = settings ? settings.marginPercentage : 0;

    const finalPrice =
      poster.price - (poster.price * discount) / 100;

    const adminMargin = (finalPrice * margin) / 100;
    const sellerEarning = finalPrice - adminMargin;

    const order = await Order.create({
      buyer: req.user.id,
      poster: poster._id,
      totalAmount: finalPrice,
      adminMargin,
      sellerEarning,
      paymentStatus: "pending"
    });

    res.status(201).json({
      message: "Order created (payment pending)",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("poster", "title imageUrl")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// BUYER CONFIRMS PAYMENT (UPI MANUAL)
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "verification_pending";
    await order.save();

    res.json({ message: "Payment submitted for verification" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
