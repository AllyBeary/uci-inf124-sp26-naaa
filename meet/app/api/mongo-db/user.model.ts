import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId:    { type: String, required: true, unique: true }, // from Google OAuth
  email:       { type: String, required: true, unique: true },
  displayName: { type: String },
  photoURL:    { type: String },
  googleAccessToken:  { type: String, required: true },  // for calling Google Calendar API
  googleRefreshToken: { type: String },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);