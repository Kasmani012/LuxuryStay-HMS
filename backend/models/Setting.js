
const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      default: "PKR"
    }
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
