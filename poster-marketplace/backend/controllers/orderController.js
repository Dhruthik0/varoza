// const Order = require("../models/Order");
// const Poster = require("../models/Poster");
// const AdminSettings = require("../models/AdminSettings");

// /* ======================================================
//    🛒 BUYER CREATES ORDER (AFTER ADDRESS + PHONE)
// ====================================================== */
// exports.createOrder = async (req, res) => {
//   try {
//     const { cartItems, address, phone } = req.body;

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     if (!address || !phone) {
//       return res.status(400).json({ message: "Delivery info missing" });
//     }

//     const settings = await AdminSettings.findOne();
//     const marginPercentage = settings?.marginPercentage || 20;

//     const orders = [];

   
//     for (const item of cartItems) {
//   const poster = await Poster.findById(item._id);
//   if (!poster) continue;

//   const quantity = item.quantity || 1;

//   const adminMarginPerItem =
//     (poster.price * marginPercentage) / 100;

//   const sellerEarningPerItem =
//     poster.price - adminMarginPerItem;

//   const order = await Order.create({
//     buyer: req.user.id,
//     poster: poster._id,
//     quantity,
//     totalAmount: poster.price * quantity,
//     adminMargin: adminMarginPerItem * quantity,
//     sellerEarning: sellerEarningPerItem * quantity,
//     deliveryAddress: address,
//     phoneNumber: phone,
//     paymentStatus: "verification_pending"
//   });

//   orders.push(order);
// }


//     res.status(201).json({
//       message: "Order created. Proceed to payment.",
//       orders
//     });
//   } catch (err) {
//     console.error("Create order error:", err);
//     res.status(500).json({ message: "Order creation failed" });
//   }
// };

// /* ======================================================
//    💳 BUYER MARKS PAYMENT AS DONE
// ====================================================== */
// exports.markOrderAsPaid = async (req, res) => {
//   try {
//     const { orderId } = req.body;

//     if (!orderId) {
//       return res.status(400).json({ message: "Order ID required" });
//     }

//     const order = await Order.findOne({
//       _id: orderId,
//       buyer: req.user.id
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     order.paymentStatus = "verification_pending";
//     await order.save();

//     res.json({
//       message: "Payment marked. Waiting for admin approval."
//     });
//   } catch (err) {
//     console.error("Mark paid error:", err);
//     res.status(500).json({ message: "Failed to mark payment" });
//   }
// };

// /* ======================================================
//    📦 BUYER GETS HIS ORDERS + STATUS
// ====================================================== */
// exports.getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ buyer: req.user.id })
//       .populate("poster", "title price imageUrl")
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     console.error("Get my orders error:", error);
//     res.status(500).json({ message: "Failed to fetch orders" });
//   }
// };
const Order = require("../models/Order");
const Poster = require("../models/Poster");
const AdminSettings = require("../models/AdminSettings");

/* ======================================================
   🛒 BUYER CREATES ORDER (AFTER ADDRESS + PHONE)
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

    // 🎟 Coupon lookup (optional)
    let couponDiscountPercent = 0;
    if (couponCode && settings?.coupons?.length) {
      const coupon = settings.coupons.find(
        (c) => c.code === couponCode.toUpperCase()
      );
      if (coupon) {
        couponDiscountPercent = coupon.discountPercent;
      }
    }

    const orders = [];//1
    for (const item of cartItems) {
      const poster = await Poster.findById(item._id);
      if (!poster) continue;

      const quantity = item.quantity || 1;

      const baseAmount = poster.price * quantity;

      const discountAmount =
        (baseAmount * couponDiscountPercent) / 100;

      const adminMarginPerItem =
        (poster.price * marginPercentage) / 100;

      const sellerEarningPerItem =
        poster.price - adminMarginPerItem;

      const totalAmount =
        baseAmount - discountAmount + shippingCharge;

      const order = await Order.create({
        buyer: req.user.id,
        poster: poster._id,
        quantity,
        totalAmount,
        adminMargin: adminMarginPerItem * quantity,
        sellerEarning: sellerEarningPerItem * quantity,
        deliveryAddress: address,
        phoneNumber: phone,

        // ✅ NEW (safe additions)
        shippingCharge,
        discountAmount,
        couponCode: couponCode || null,

        paymentStatus: "verification_pending"
      });

      orders.push(order);
    }

    res.status(201).json({
      message: "Order created. Proceed to payment.",
      orders
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
   📦 BUYER GETS HIS ORDERS + STATUS
====================================================== */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("poster", "title price imageUrl")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
