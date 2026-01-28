const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poster",
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    adminMargin: Number,
    sellerEarning: Number,

    // 🚚 DELIVERY INFO
    deliveryAddress: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    // 📦 ORDER STATUS
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "verification_pending",
        "paid",
        "delivering",
        "rejected"
      ],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
