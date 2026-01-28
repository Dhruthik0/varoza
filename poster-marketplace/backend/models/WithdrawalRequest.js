const mongoose = require("mongoose");

const withdrawalRequestSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    upiId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "WithdrawalRequest",
  withdrawalRequestSchema
);
