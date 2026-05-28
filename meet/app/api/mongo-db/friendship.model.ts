import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
}, { timestamps: true });
// Prevent duplicate friend requests
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
// checks pending with a given user
friendshipSchema.index({ recipient: 1, status: 1 });

export const Friendship = mongoose.models.Friendship || mongoose.model("Friendship", friendshipSchema);
