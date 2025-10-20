import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  createSport,
  getAllSports,
  getSportsById,
  updateSport,
  deleteSport,
  selectSportsForUser
} from "../controllers/sport.controller.js";

const router = express.Router();

// --------------------- Public Routes ---------------------
router.get("/", getAllSports);                     // Get all sports
router.get("/:id", getSportsById);                 // Get single sport by ID

// --------------------- User Routes ----------------------
router.post("/select", verifyToken, selectSportsForUser); // User selects sports

// --------------------- Admin Routes ---------------------
router.post("/", verifyToken, authorizeRoles("admin"), createSport); // Create sport
router.put("/:id", verifyToken, authorizeRoles("admin"), updateSport); // Update sport
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteSport); // Delete sport

export default router;
