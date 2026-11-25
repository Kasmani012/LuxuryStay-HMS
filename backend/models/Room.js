
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Deluxe", "Suite"]
    },

    price: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      required: true,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available"
    }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
