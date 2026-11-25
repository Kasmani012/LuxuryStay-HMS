
const Staff = require("../models/Staff");

// ADD STAFF
const addStaff = async (req, res) => {
  try {
    const { name, email, phone, role, salary, status } = req.body;

    const existingStaff = await Staff.findOne({ email });

    if (existingStaff) {
      return res.status(400).json({
        message: "Staff email already exists"
      });
    }

    const staff = await Staff.create({
      name,
      email,
      phone,
      role,
      salary,
      status
    });

    res.status(201).json({
      message: "Staff added successfully",
      staff
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL STAFF
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();

    res.status(200).json({
      count: staff.length,
      staff
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE STAFF
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found"
      });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STAFF
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found"
      });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      staff
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE STAFF
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found"
      });
    }

    res.status(200).json({
      message: "Staff deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff
};
