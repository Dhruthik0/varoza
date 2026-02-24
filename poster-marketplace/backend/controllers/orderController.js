const Order = require("../models/Order");
const Poster = require("../models/Poster");
const AdminSettings = require("../models/AdminSettings");

/* ======================================================
   🛒 BUYER CREATES SINGLE GROUPED ORDER
====================================================== */
exports.createOrder = async (req, res) => {
  try {
    const { cartItems, address, phone, couponCode } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address || !phone) {
      return res.status(400).json({ message: "Delivery info missing" });
    }

    const settings = await AdminSettings.findOne();
    const marginPercentage = settings?.marginPercentage || 20;
    const shippingCharge = settings?.shippingCharge || 0;

    // 🎟 Coupon lookup
    let coupon = null;
    let appliedCouponCode = null;

    if (couponCode && settings?.coupons?.length) {
      const normalizedCode = couponCode.toUpperCase();

      coupon = settings.coupons.find(
        (c) => c.code === normalizedCode && c.isActive !== false
      );

      if (coupon) {
        appliedCouponCode = normalizedCode;
      }
    }

    // 🔢 Step 1: Calculate cart subtotal
    let cartSubTotal = 0;

    for (const item of cartItems) {
      const poster = await Poster.findById(item._id);
      if (!poster) continue;

      const quantity = item.quantity || 1;
      cartSubTotal += poster.price * quantity;
    }

    // 🧠 Step 2: Calculate discount
    let totalDiscountAmount = 0;

    if (coupon?.type === "PERCENTAGE") {
      totalDiscountAmount =
        (cartSubTotal * coupon.discountPercent) / 100;
    }

    if (coupon?.type === "BUY_X_GET_Y") {
      let prices = [];

      for (const item of cartItems) {
        const poster = await Poster.findById(item._id);
        if (!poster) continue;

        for (let i = 0; i < (item.quantity || 1); i++) {
          prices.push(poster.price);
        }
      }

      prices.sort((a, b) => a - b);

      const groupSize = coupon.buyQuantity + coupon.freeQuantity;
      const totalGroups = Math.floor(prices.length / groupSize);
      const totalFreeItems = totalGroups * coupon.freeQuantity;

      totalDiscountAmount = prices
        .slice(0, totalFreeItems)
        .reduce((sum, price) => sum + price, 0);
    }

    // 📦 Step 3: Build items array
    const items = [];

    for (const item of cartItems) {
      const poster = await Poster.findById(item._id);
      if (!poster) continue;

      const quantity = item.quantity || 1;

      const adminMarginPerItem =
        (poster.price * marginPercentage) / 100;

      const sellerEarningPerItem =
        poster.price - adminMarginPerItem;

      items.push({
        poster: poster._id,
        quantity,
        price: poster.price,
        adminMargin: adminMarginPerItem * quantity,
        sellerEarning: sellerEarningPerItem * quantity
      });
    }

    const finalTotal =
      cartSubTotal - totalDiscountAmount + shippingCharge;

    // ✅ Create ONE order
    const order = await Order.create({
      buyer: req.user.id,
      items,
      totalAmount: finalTotal,
      shippingCharge,
      discountAmount: totalDiscountAmount,
      couponCode: appliedCouponCode,
      deliveryAddress: address,
      phoneNumber: phone,
      paymentStatus: "verification_pending"
    });

    res.status(201).json({
      message: "Order created. Proceed to payment.",
      order
    });

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* ======================================================
   💳 BUYER MARKS PAYMENT AS DONE
====================================================== */
exports.markOrderAsPaid = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "verification_pending";
    await order.save();

    res.json({
      message: "Payment marked. Waiting for admin approval."
    });

  } catch (err) {
    console.error("Mark paid error:", err);
    res.status(500).json({ message: "Failed to mark payment" });
  }
};

/* ======================================================
   📦 BUYER GETS HIS ORDERS
====================================================== */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("items.poster", "title price imageUrl")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
