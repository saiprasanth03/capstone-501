const Sport = require("../models/Sport");

const createSport = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Sport name is required",
      });
    }

    const existing = await Sport.findOne({ name });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Sport already exists",
      });
    }

    const sport = await Sport.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSports = async (req, res) => {
  try {
    const sports = await Sport.find({ isActive: true }).sort({ name: 1 });

    res.json({
      success: true,
      sports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSport = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    res.json({
      success: true,
      sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    res.json({
      success: true,
      message: "Sport deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSport,
  getSports,
  updateSport,
  deleteSport,
};