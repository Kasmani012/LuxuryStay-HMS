
const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Online"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
