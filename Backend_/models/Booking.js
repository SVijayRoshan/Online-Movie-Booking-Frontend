import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  _id: { type: String, required: true },      // e.g. "b001"
  user_id: { type: String, required: true },  // e.g. "u001"
  show_id: { type: String, required: true },  // e.g. "s001"
  seats: [{ type: String, required: true }],  // e.g. ["A1","A2"]
  total_price: { type: Number, required: true },
  booking_time: { type: Date, default: Date.now },
  status: { type: String, enum: ["Confirmed","Pending","Cancelled"], default: "Confirmed" }
},{collection:"bookings"},{timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
