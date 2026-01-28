const express = require("express");
const router = express.Router();
const {
  getApprovedPosters,
  getPosterById,
} = require("../controllers/posterController");

// Explore + Search
router.get("/approved", getApprovedPosters);

// Poster detail
router.get("/:id", getPosterById);

module.exports = router;
