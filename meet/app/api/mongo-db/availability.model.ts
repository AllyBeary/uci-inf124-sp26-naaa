import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  groupId:   { type: String, required: true },
  dayIndex:  { type: Number, required: true, min: 0, max: 6 },
  startHour: { type: Number, required: true },
  endHour:   { type: Number, required: true },
}, { timestamps: true });

availabilitySchema.index({ groupId: 1 });

if (mongoose.models.Availability) {
  delete (mongoose.models as any).Availability;
}
export const Availability = mongoose.model("Availability", availabilitySchema);
