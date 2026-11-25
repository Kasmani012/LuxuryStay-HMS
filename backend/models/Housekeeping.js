
const mongoose = require("mongoose");

const housekeepingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    task: {
      type: String,
      required: true,
      enum: ["Cleaning", "Maintenance", "Inspection"]
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

const Housekeeping = mongoose.model("Housekeeping", housekeepingSchema);

module.exports = Housekeeping;
