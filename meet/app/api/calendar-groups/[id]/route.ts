import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongo-db/client";
import { Group } from "@/app/api/mongo-db/group.model";

//Returns all members of a certain group specified by group ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Error in GET /api/groups/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}
