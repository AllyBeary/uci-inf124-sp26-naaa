import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongo-db/client";
import { Friendship } from "@/app/api/mongo-db/friendship.model";

//Get all friendships for a user by status
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    //Distinguish between sender and receiver roles
    const role = searchParams.get("role");

    let query: Record<string, any> = {};
    if (role === "requester") query.requester = userId;
    else if (role === "recipient") query.recipient = userId;
    else query.$or = [{ requester: userId }, { recipient: userId }];

    if (status) query.status = status;

    const friendships = await Friendship.find(query);

    return NextResponse.json({ friendships });
  } catch (error) {
    console.error("Error in GET /api/friendships:", error);
    return NextResponse.json({ error: "Failed to fetch friendships" }, { status: 500 });
  }
}

// POST /api/friendships
// Body: { requesterId, recipientId }
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { requesterId, recipientId } = await request.json();

    if (!requesterId || !recipientId) {
      return NextResponse.json({ error: "Missing requesterId or recipientId" }, { status: 400 });
    }

    if (requesterId === recipientId) {
      return NextResponse.json({ error: "Cannot send a friend request to yourself" }, { status: 400 });
    }

    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
    });

    return NextResponse.json({ friendship }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Friend request already exists" }, { status: 409 });
    }
    console.error("Error in POST /api/friendships:", error);
    return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
  }
}
