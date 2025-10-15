import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genres: [String],
  duration: Number,
  posterUrl: String,
  language: String,
  rating: Number,
  release_date: String,
  certification: String
},{collection:"movies"},{timestamps: true});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
