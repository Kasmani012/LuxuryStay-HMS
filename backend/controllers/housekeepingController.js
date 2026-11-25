
const Housekeeping = require("../models/Housekeeping");

// ADD TASK
const addTask = async (req, res) => {
  try {
    const { room, task, status, notes } = req.body;

    const housekeeping = await Housekeeping.create({
      room,
      task,
      status,
      notes
    });

    res.status(201).json({
      message: "Housekeeping task added successfully",
      housekeeping
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await Housekeeping.find().populate("room");

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Housekeeping.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Housekeeping.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTask,
  getTasks,
  updateTask,
  deleteTask
};
