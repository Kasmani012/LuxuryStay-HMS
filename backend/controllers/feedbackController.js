
const Feedback = require("../models/Feedback");

// ADD FEEDBACK
const addFeedback = async (req, res) => {
  try {
    const { guest, rating, comment, status } = req.body;

    const feedback = await Feedback.create({
      guest,
      rating,
      comment,
      status
    });

    res.status(201).json({
      message: "Feedback added successfully",
      feedback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL FEEDBACK
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("guest");

    res.status(200).json({
      count: feedback.length,
      feedback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE FEEDBACK
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    res.status(200).json({
      message: "Feedback updated successfully",
      feedback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE FEEDBACK
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    res.status(200).json({
      message: "Feedback deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback
};
