// src/server.js
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import logger from "./config/logger.js";
import sportsRoutes from "./routes/sport.routes.js";




dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests
  })
);

// Initialize Passport

app.use(passport.initialize());

// protected route example
app.get(
  "/api/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: `hello npm ${req.user.username}, You have accessed a protected route!`, user: req.user });
  }
);

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/sports", sportsRoutes);

// Routes
app.get("/", (req, res) => res.send("✅ Sports backend is running..."));
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;