import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongo-db/client";
import { Group } from "@/app/api/mongo-db/group.model";

//Returns all the groups that the users are apart of 
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const groups = await Group.find({ members: userId })
      .populate("owner", "displayName email photoURL")
      .populate("members", "displayName email photoURL");

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error in GET /api/groups:", error);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

//Creates new group where user is owner 
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, ownerID, memberIDs } = await request.json();

    if (!name || !ownerID) {
      return NextResponse.json({ error: "Missing name or ownerId" }, { status: 400 });
    }

    const group = await Group.create({ name, owner: ownerID, members: memberIDs ?? [] });

    await group.populate("owner", "displayName email photoURL");
    await group.populate("members", "displayName email photoURL");

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/groups:", error);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
