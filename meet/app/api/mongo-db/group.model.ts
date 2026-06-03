import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  owner:   { type: String, required: true },
  members: [{ type: String }],
}, { timestamps: true });

// ensure owner is always a member
groupSchema.pre('save', function () {
  if (!this.members.includes(this.owner)) {
    this.members.push(this.owner);
  }
});

// show groups the user owns
groupSchema.index({ owner: 1 });
// show groups the user is a member of
groupSchema.index({ members: 1 });

// Delete cached model so schema changes are picked up on hot reload
if (mongoose.models.Group) {
  delete (mongoose.models as any).Group;
}
export const Group = mongoose.model("Group", groupSchema);