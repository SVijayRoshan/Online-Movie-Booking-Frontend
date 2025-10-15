import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  _id: { type: String, required: true },           // e.g. "p001"
  booking_id: { type: String, required: true },    // e.g. "b001"
  user_id: { type: String, required: true },       // e.g. "u001"
  amount: { type: Number, required: true },       // e.g. 500
  payment_method: { type: String, required: true }, // e.g. "Credit Card"
  payment_status: { type: String, enum: ["Completed","Pending","Failed"], default: "Pending" },
  transaction_id: { type: String, required: true },
  payment_time: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
