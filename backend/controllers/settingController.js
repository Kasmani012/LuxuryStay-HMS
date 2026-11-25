
const Setting = require("../models/Setting");

// ADD SETTINGS
const addSetting = async (req, res) => {
  try {
    const setting = await Setting.create(req.body);

    res.status(201).json({
      message: "Settings saved successfully",
      setting
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SETTINGS
const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();

    res.status(200).json({
      count: settings.length,
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SETTINGS
const updateSetting = async (req, res) => {
  try {
    const setting = await Setting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!setting) {
      return res.status(404).json({
        message: "Settings not found"
      });
    }

    res.status(200).json({
      message: "Settings updated successfully",
      setting
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SETTINGS
const deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findByIdAndDelete(req.params.id);

    if (!setting) {
      return res.status(404).json({
        message: "Settings not found"
      });
    }

    res.status(200).json({
      message: "Settings deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSetting,
  getSettings,
  updateSetting,
  deleteSetting
};
