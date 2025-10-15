import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  screen_no: { type: Number, required: true },
  seats: [{ type: String, required: true }]
});

const theatreSchema = new mongoose.Schema({
  _id: { type: String, required: true },      // e.g. "t001"
  name: { type: String, required: true },     // e.g. "PVR Cinemas"
  location: { type: String, required: true }, // e.g. "Chennai"
  screens: [screenSchema]                      // array of screen objects
});

const Theatre = mongoose.model("Theatre", theatreSchema);

export default Theatre;
