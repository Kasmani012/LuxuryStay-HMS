
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
