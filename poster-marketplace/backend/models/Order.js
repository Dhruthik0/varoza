
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ MULTIPLE ITEMS INSIDE ONE ORDER
    items: [
      {
        poster: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Poster",
          required: true
        },

        quantity: {
          type: Number,
          default: 1
        },

        price: {
          type: Number,
          required: true
        },

        adminMargin: {
          type: Number,
          default: 0
        },

        sellerEarning: {
          type: Number,
          default: 0
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    shippingCharge: {
      type: Number,
      default: 0
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    couponCode: {
      type: String,
      default: null
    },

    deliveryAddress: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

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
