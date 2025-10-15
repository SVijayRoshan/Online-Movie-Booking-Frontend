import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },        // e.g. "user1"
  email: { type: String, required: true, unique: true }, // e.g. "user1@example.com"
  phone: { type: String, required: true },       // e.g. "+91-9000000001"
  password: { type: String, required: true }    // hashed password for login
},{collection:"users"},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
