const express = require("express");

const {
  createSession,
  getMySessions,
  getAvailableSessions,
  joinSession,
  getJoinedSessions,
  cancelSession,
} = require("../controllers/sessionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createSession);

router.get("/my", protect, getMySessions);

router.get("/available", protect, getAvailableSessions);

router.post("/:id/join", protect, joinSession);

router.get("/joined", protect, getJoinedSessions);

router.patch("/:id/cancel", protect, cancelSession);

module.exports = router;