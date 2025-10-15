import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  _id: { type: String, required: true },          // e.g. "s001"
  movie_id: { type: String, required: true },     // e.g. "m001"
  theatre_id: { type: String, required: true },   // e.g. "t001"
  screen_no: { type: Number, required: true },    // e.g. 1
  show_time: { type: Date, required: true },      // e.g. "2025-09-30T10:00:00"
  available_seats: [{ type: String, required: true }], // e.g. ["A1","A2","B1"]
  price_per_ticket: { type: Number, required: true }
});

const Show = mongoose.model("Show", showSchema);

export default Show;
