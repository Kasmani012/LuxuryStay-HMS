
const mongoose = require("mongoose");

const guestServiceSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true
    },
    serviceName: {
      type: String,
      required: true,
      enum: ["Laundry", "Room Service", "Spa", "Transport", "Other"]
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending"
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const GuestService = mongoose.model("GuestService", guestServiceSchema);

module.exports = GuestService;
