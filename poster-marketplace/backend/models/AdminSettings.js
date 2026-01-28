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

    // 💳 UPI PAYMENT CONFIG (NEW)
    upiId: {
      type: String,
      required: true
    },
    upiQrUrl: {
      type: String,
      required: true
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
