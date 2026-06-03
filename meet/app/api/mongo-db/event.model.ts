import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  group:       { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  startTime:   { type: Date, required: true },
  endTime:     { type: Date, required: true },
  attendees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt:   { type: Date, default: Date.now }
});
eventSchema.index({ group: 1, startTime: 1 });  // fast range queries for availability

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
