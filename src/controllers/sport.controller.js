import Sport from "../models/sport.model.js";
import User from "../models/user.model.js";
import logger from "../config/logger.js";

// --------------------- Create Sport (Admin Only) ---------------------
export const createSport = async (req, res) => {
  try {
    const { name, description, category, players } = req.body;
    if (!name || !description || !category || !players) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingSport = await Sport.findOne({ name, category });
    if (existingSport) return res.status(409).json({ message: "Sport with this name and category already exists" });

    const newSport = new Sport({
      name,
      description,
      category,
      players,
      createdBy: req.user._id
    });

    await newSport.save();
    logger.info(`New sport created: ${newSport.name} by admin ${req.user.email}`);

    res.status(201).json({ success: true, message: "Sport created successfully", data: newSport });
  } catch (error) {
    logger.error(`Error creating sport: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// --------------------- Get All Sports ---------------------
export const getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find();
    res.status(200).json({ success: true, data: sports });
  } catch (error) {
    logger.error(`Error fetching sports: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// --------------------- Get Sport by ID ---------------------
export const getSportsById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.status(200).json({ success: true, data: sport });
  } catch (error) {
    logger.error(`Error fetching sport: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// --------------------- Update Sport (Admin Only) ---------------------
export const updateSport = async (req, res) => {
  try {
    const updatedSport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSport) return res.status(404).json({ message: "Sport not found" });

    res.status(200).json({ success: true, message: "Sport updated successfully", data: updatedSport });
  } catch (error) {
    logger.error(`Error updating sport: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// --------------------- Delete Sport (Admin Only) ---------------------
export const deleteSport = async (req, res) => {
  try {
    const deletedSport = await Sport.findByIdAndDelete(req.params.id);
    if (!deletedSport) return res.status(404).json({ message: "Sport not found" });

    res.status(200).json({ success: true, message: "Sport deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting sport: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// --------------------- Select Sports for User ---------------------
export const selectSportsForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { selectedSports } = req.body;

    if (!selectedSports || !Array.isArray(selectedSports) || selectedSports.length === 0) {
      return res.status(400).json({ message: "At least one sport must be selected" });
    }

    const validSports = await Sport.find({ _id: { $in: selectedSports }, isActive: true });
    if (validSports.length !== selectedSports.length) {
      return res.status(400).json({ message: "One or more selected sports are invalid or inactive" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { selectedSports: { $each: selectedSports } }, onboardingCompleted: true },
      { new: true }
    ).populate("selectedSports", "name description category image");

    res.status(200).json({
      message: "Sports selected successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        selectedSports: user.selectedSports,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    logger.error(`Error selecting sports for user: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
