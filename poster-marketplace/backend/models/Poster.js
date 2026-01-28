const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  price: Number,
  category: String,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Poster", posterSchema);
