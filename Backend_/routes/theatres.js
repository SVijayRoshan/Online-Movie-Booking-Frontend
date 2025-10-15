import express from "express";
import Theatre from "../models/Theatre.js";

const router = express.Router();

// GET /theatres - get all theatres
router.get("/", async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /theatres/:id - get a single theatre
router.get("/:id", async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) return res.status(404).json({ error: "Theatre not found" });
    res.json(theatre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
