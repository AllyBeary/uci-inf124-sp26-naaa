import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  group:       { type: String, required: true },
  createdBy:   { type: String, required: false },
  title:       { type: String, required: true },
  description: { type: String },
  startTime:   { type: Date, required: true },
  endTime:     { type: Date, required: true },
  attendees:   [{ type: String }],
  createdAt:   { type: Date, default: Date.now }
});
eventSchema.index({ group: 1, startTime: 1 });  // fast range queries for availability

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);