import express from "express";
import passport from "passport";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//protected route using passport jwt strategy
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);
export default router;
