import express from "express";
import Show from "../models/Show.js";

const router = express.Router();

// GET /shows - get all shows
router.get("/", async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /shows/:id - get a single show
router.get("/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ error: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /shows/:id/lock - lock seats
router.post("/:id/lock", async (req, res) => {
  const { seatIds } = req.body;
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ error: "Show not found" });

    const lockedSeats = [];
    const failedSeats = [];

    seatIds.forEach(seat => {
      if (show.available_seats.includes(seat)) {
        lockedSeats.push(seat);
        // temporarily remove from available seats
        show.available_seats = show.available_seats.filter(s => s !== seat);
      } else {
        failedSeats.push(seat);
      }
    });

    await show.save();

    res.json({
      lockToken: "LOCK_" + Date.now(), // simple lock token
      lockedSeats,
      failedSeats,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes lock
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
