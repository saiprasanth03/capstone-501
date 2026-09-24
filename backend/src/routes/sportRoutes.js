const express = require("express");

const {
  createSport,
  getSports,
  updateSport,
  deleteSport,
} = require("../controllers/sportController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getSports);

router.post("/", protect, adminOnly, createSport);

router.put("/:id", protect, adminOnly, updateSport);

router.delete("/:id", protect, adminOnly, deleteSport);

module.exports = router;