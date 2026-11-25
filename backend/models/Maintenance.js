
const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    issue: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
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

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

module.exports = Maintenance;
