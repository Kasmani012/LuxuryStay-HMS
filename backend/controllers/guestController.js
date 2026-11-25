
const Guest = require("../models/Guest");

// ADD NEW GUEST
const addGuest = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const existingGuest = await Guest.findOne({ email });

    if (existingGuest) {
      return res.status(400).json({
        message: "Guest email already exists"
      });
    }

    const guest = await Guest.create({
      name,
      email,
      phone,
      address
    });

    res.status(201).json({
      message: "Guest added successfully",
      guest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL GUESTS
const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();

    res.status(200).json({
      count: guests.length,
      guests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE GUEST
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found"
      });
    }

    res.status(200).json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE GUEST
const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found"
      });
    }

    res.status(200).json({
      message: "Guest updated successfully",
      guest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE GUEST
const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found"
      });
    }

    res.status(200).json({
      message: "Guest deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest
};
