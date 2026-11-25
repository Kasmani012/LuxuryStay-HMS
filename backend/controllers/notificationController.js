
const Notification = require("../models/Notification");

// ADD NOTIFICATION
const addNotification = async (req, res) => {
  try {
    const { title, message, type, status } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      status
    });

    res.status(201).json({
      message: "Notification added successfully",
      notification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();

    res.status(200).json({
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE NOTIFICATION
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification updated successfully",
      notification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addNotification,
  getNotifications,
  updateNotification,
  deleteNotification
};
