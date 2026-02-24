const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
  {
    // 💼 BUSINESS CONTROLS
    marginPercentage: {
      type: Number,
      default: 20
    },
    discountPercentage: {
      type: Number,
      default: 0
    },

    // 🔹 SHIPPING CHARGE (FLAT)
    shippingCharge: {
      type: Number,
      default: 0
    },

    // 🔹 COUPONS
   coupons: [
  {
    code: {
      type: String,
      uppercase: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["PERCENTAGE", "BUY_X_GET_Y"],
      default: "PERCENTAGE"
    },

    discountPercent: {
      type: Number
    },

    buyQuantity: {
      type: Number
    },

    freeQuantity: {
      type: Number
    },

    isActive: {
      type: Boolean,
      default: true
    }
  }
],

    // 💳 UPI PAYMENT CONFIG (NEW)
    upiId: {
      type: String,
      default: ""
    },
    upiQrUrl: {
      type: String,
      default: ""
    },

    // 💰 SELLER PAYOUT RULE
    minimumPayout: {
      type: Number,
      default: 500
    }  
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
