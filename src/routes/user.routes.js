import express from "express"; 
import {getProfile, updateProfile} from "../controllers/user.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// protected routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

// admin-only route example
router.get("/all", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin! This is a protected admin route." });
});

export default router;