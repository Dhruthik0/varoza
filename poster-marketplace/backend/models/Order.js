// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     buyer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     poster: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Poster",
//       required: true
//     },

//     totalAmount: {
//       type: Number,
//       required: true
//     },
//           quantity: {
//         type: Number,
//         required: true,
//         default: 1
//       },


//     adminMargin: Number,
//     sellerEarning: Number,

//     // 🚚 DELIVERY INFO
//     deliveryAddress: {
//       type: String,
//       required: true
//     },

//     phoneNumber: {
//       type: String,
//       required: true
//     },

//     // 📦 ORDER STATUS
//     paymentStatus: {
//       type: String,
//       enum: [
//         "pending",
//         "verification_pending",
//         "paid",
//         "delivering",
//         "rejected"
//       ],
//       default: "pending"
//     }
//   },

//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);
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

    quantity: {
      type: Number,
      default: 1
    },

    totalAmount: {
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
    },

    // ✅ NEW – SHIPPING (FLAT)
    shippingCharge: {
      type: Number,
      default: 0
    },

    // ✅ NEW – COUPON DISCOUNT
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
//as
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
