
const Room = require("../models/Room");

// ADD NEW ROOM
const addRoom = async (req, res) => {
  try {
    const { number, type, price, status } = req.body;

    const existingRoom = await Room.findOne({ number });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists"
      });
    }

    const room = await Room.create({
      number,
      type,
      price,
      status
    });

    res.status(201).json({
      message: "Room added successfully",
      room
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ROOMS
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({
      count: rooms.length,
      rooms
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ROOM
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.status(200).json(room);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ROOM
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.status(200).json({
      message: "Room updated successfully",
      room
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ROOM
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.status(200).json({
      message: "Room deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
};
