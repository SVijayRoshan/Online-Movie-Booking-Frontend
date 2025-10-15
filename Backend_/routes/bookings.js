import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// GET /bookings?user_id=xxx - get bookings for a user
router.get("/", async (req, res) => {
  const userId = req.query.user_id;
  try {
    const bookings = userId 
      ? await Booking.find({ user_id: userId }) 
      : await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /bookings - create a new booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
