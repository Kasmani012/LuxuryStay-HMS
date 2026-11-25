
const GuestService = require("../models/GuestService");

// ADD SERVICE
const addService = async (req, res) => {
  try {
    const { guest, serviceName, amount, status, notes } = req.body;

    const service = await GuestService.create({
      guest,
      serviceName,
      amount,
      status,
      notes
    });

    res.status(201).json({
      message: "Guest service added successfully",
      service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL SERVICES
const getServices = async (req, res) => {
  try {
    const services = await GuestService.find().populate("guest");

    res.status(200).json({
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SERVICE
const updateService = async (req, res) => {
  try {
    const service = await GuestService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        message: "Guest service not found"
      });
    }

    res.status(200).json({
      message: "Guest service updated successfully",
      service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SERVICE
const deleteService = async (req, res) => {
  try {
    const service = await GuestService.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Guest service not found"
      });
    }

    res.status(200).json({
      message: "Guest service deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addService,
  getServices,
  updateService,
  deleteService
};
