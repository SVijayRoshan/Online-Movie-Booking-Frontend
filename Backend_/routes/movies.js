import express from "express";
import Movie from "../models/Movie.js";

const router = express.Router();

// GET /movies - return all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /movies/:id - return single movie
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById({_id: req.params.id});
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
