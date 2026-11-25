
const Reservation = require("../models/Reservation");
const Room = require("../models/Room");

// CHECK ROOM BOOKING AVAILABILITY
const checkRoomAvailability = async (
  roomId,
  checkIn,
  checkOut,
  excludeId = null,
  allowOccupied = false
) => {
  const room = await Room.findById(roomId);

  if (!room) {
    return { error: "Room not found" };
  }

  if (room.status === "Maintenance") {
    return { error: "Room is under maintenance" };
  }

  if (room.status === "Occupied" && !allowOccupied) {
    return { error: "Room is currently occupied" };
  }

  const query = {
    room: roomId,
    status: { $nin: ["Cancelled", "Checked-Out"] },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingBooking = await Reservation.findOne(query);

  if (existingBooking) {
    return {
      error: "This room is already booked for these dates"
    };
  }

  return { room };
};

// AUTOMATICALLY UPDATE ROOM STATUS
const syncRoomStatus = async (roomId) => {
  const room = await Room.findById(roomId);

  if (!room || room.status === "Maintenance") {
    return;
  }

  const activeCheckIn = await Reservation.findOne({
    room: roomId,
    status: "Checked-In"
  });

  await Room.findByIdAndUpdate(roomId, {
    status: activeCheckIn ? "Occupied" : "Available"
  });
};

// ADD RESERVATION
const addReservation = async (req, res) => {
  try {
    const {
      guest,
      room,
      checkIn,
      checkOut,
      totalAmount,
      status
    } = req.body;

    if (!guest || !room || !checkIn || !checkOut || totalAmount == null) {
      return res.status(400).json({
        message: "Please provide all required reservation details"
      });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date"
      });
    }

    const reservationStatus = status || "Confirmed";

    const availability = await checkRoomAvailability(
      room,
      checkIn,
      checkOut
    );

    if (availability.error) {
      return res.status(400).json({
        message: availability.error
      });
    }

    const reservation = await Reservation.create({
      guest,
      room,
      checkIn,
      checkOut,
      totalAmount,
      status: reservationStatus
    });

    await syncRoomStatus(room);

    res.status(201).json({
      message: "Reservation added successfully",
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL RESERVATIONS
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("guest")
      .populate("room");

    res.status(200).json({
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE RESERVATION
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("guest")
      .populate("room");

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found"
      });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE RESERVATION
const updateReservation = async (req, res) => {
  try {
    const existingReservation = await Reservation.findById(req.params.id);

    if (!existingReservation) {
      return res.status(404).json({
        message: "Reservation not found"
      });
    }

    const oldRoomId = String(existingReservation.room);
    const roomId = req.body.room || existingReservation.room;
    const checkIn = req.body.checkIn || existingReservation.checkIn;
    const checkOut = req.body.checkOut || existingReservation.checkOut;
    const newStatus = req.body.status || existingReservation.status;

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date"
      });
    }

    // Check availability for active reservations
    if (!["Cancelled", "Checked-Out"].includes(newStatus)) {
      const sameRoom =
        String(roomId) === oldRoomId;

      const allowOccupied =
        existingReservation.status === "Checked-In" && sameRoom;

      const availability = await checkRoomAvailability(
        roomId,
        checkIn,
        checkOut,
        existingReservation._id,
        allowOccupied
      );

      if (availability.error) {
        return res.status(400).json({
          message: availability.error
        });
      }
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Update old and new room statuses
    const roomsToSync = new Set([
      oldRoomId,
      String(reservation.room)
    ]);

    for (const roomIdToSync of roomsToSync) {
      await syncRoomStatus(roomIdToSync);
    }

    res.status(200).json({
      message: "Reservation updated successfully",
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE RESERVATION
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found"
      });
    }

    const roomId = reservation.room;

    await Reservation.findByIdAndDelete(req.params.id);

    // Restore room status after deletion
    await syncRoomStatus(roomId);

    res.status(200).json({
      message: "Reservation deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXPORT FUNCTIONS
module.exports = {
  addReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
};
