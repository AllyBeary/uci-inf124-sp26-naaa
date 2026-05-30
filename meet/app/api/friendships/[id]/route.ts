import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongo-db/client";
import { Friendship } from "@/app/api/mongo-db/friendship.model";

// PATCH /api/friendships/[id]
// Body: { status: "accepted" | "declined" }
// Accepts or declines a pending friend request
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { status } = await request.json();

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "status must be 'accepted' or 'declined'" }, { status: 400 });
    }

    const friendship = await Friendship.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!friendship) {
      return NextResponse.json({ error: "Friendship not found" }, { status: 404 });
    }

    return NextResponse.json({ friendship });
  } catch (error) {
    console.error("Error in PATCH /api/friendships/[id]:", error);
    return NextResponse.json({ error: "Failed to update friendship" }, { status: 500 });
  }
}

// DELETE /api/friendships/[id]
// Removes a friendship (unfriend or cancel/reject a request)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const friendship = await Friendship.findByIdAndDelete(params.id);

    if (!friendship) {
      return NextResponse.json({ error: "Friendship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Friendship removed" });
  } catch (error) {
    console.error("Error in DELETE /api/friendships/[id]:", error);
    return NextResponse.json({ error: "Failed to remove friendship" }, { status: 500 });
  }
}
