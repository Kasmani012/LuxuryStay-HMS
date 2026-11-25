
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Booking", "Payment", "Maintenance", "General"],
      default: "General"
    },
    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread"
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
