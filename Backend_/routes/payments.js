import express from "express";
import Payment from "../models/Payment.js";

const router = express.Router();

// GET /payments?user_id=xxx - get payments for a user
router.get("/", async (req, res) => {
  const userId = req.query.user_id;
  try {
    const payments = userId 
      ? await Payment.find({ user_id: userId }) 
      : await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /payments - create a new payment
router.post("/", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
