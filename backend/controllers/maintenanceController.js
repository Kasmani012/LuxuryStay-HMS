
const Maintenance = require("../models/Maintenance");

// ADD MAINTENANCE
const addMaintenance = async (req, res) => {
  try {
    const { room, issue, priority, status, notes } = req.body;

    const maintenance = await Maintenance.create({
      room,
      issue,
      priority,
      status,
      notes
    });

    res.status(201).json({
      message: "Maintenance request added successfully",
      maintenance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MAINTENANCE
const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find().populate("room");

    res.status(200).json({
      count: maintenance.length,
      maintenance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MAINTENANCE
const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found"
      });
    }

    res.status(200).json({
      message: "Maintenance updated successfully",
      maintenance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MAINTENANCE
const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found"
      });
    }

    res.status(200).json({
      message: "Maintenance deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance
};
