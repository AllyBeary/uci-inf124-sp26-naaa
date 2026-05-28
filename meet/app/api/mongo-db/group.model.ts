import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// ensure owner is always a member
groupSchema.pre('save', async function () {
  if (!this.members.map(String).includes(String(this.owner))) {
    this.members.push(this.owner);
  }
});

// show groups the user owns
groupSchema.index({ owner: 1 });
// show groups the user is a member of
groupSchema.index({ members: 1 });

export const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
