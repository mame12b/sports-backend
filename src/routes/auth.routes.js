import express from "express";
import passport from "passport";
import { login, me, register, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyIdToken } from "apple-signin-auth";

const router = express.Router();

// Base route to show available endpoints
router.get("/", (req, res) => {
  res.json({
    message: "Auth API",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login", 
      me: "GET /api/auth/me (protected)",
      logout: "POST /api/auth/logout (protected)",
      appleSignIn: "POST /api/auth/apple-signin",
      googleAuth: "GET /api/auth/google",
      profile: "GET /api/auth/profile (protected)"
    }
  });
});

// Local authentication routes (email/password based)
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me); // ✅ FIXED: Changed verifyIdToken to verifyToken
router.post("/logout", verifyToken, logout);

// Apple Sign-In routes
router.post("/apple-signin", async (req, res) => {
  const { identityToken } = req.body;

  try {
    const appleUser = await verifyIdToken(identityToken, {
      audience: process.env.APPLE_CLIENT_ID,
    });

    // Here you would typically find or create a user in your database
    // For demonstration, we'll just return the appleUser info
    res.json({ message: 'Apple Sign-In successful', user: appleUser });
  } catch (error) {
    console.error("Apple Sign-In error:", error);
    res.status(401).json({ message: "Invalid Apple identity token" });
  }
});

// Google OAuth2 routes
router.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    session: false 
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: "/login" 
  }),
  (req, res) => {
    // Send JWT or redirect to frontend
    const user = req.user;
    res.json({ message: "Google Sign-In successful", user });
  }
);

// Protected route using passport JWT strategy
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

export default router;
