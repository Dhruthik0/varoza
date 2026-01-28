const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer"
    },

    // ✅ Admin approval for sellers
    approved: {
      type: Boolean,
      default: false
    },

    // 💰 Seller wallet balance
    walletBalance: {
      type: Number,
      default: 0
    },

    // 💳 Seller UPI ID (for payouts)
    sellerUpiId: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
