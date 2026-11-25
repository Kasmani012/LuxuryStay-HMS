
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Checked-In", "Checked-Out", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
