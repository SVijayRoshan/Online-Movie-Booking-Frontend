import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  genres: [String],
  duration: Number,
  language: String,
  rating: Number,
  release_date: String,
  certification: String
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
