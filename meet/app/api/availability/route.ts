import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongo-db/client";
import { Availability } from "@/app/api/mongo-db/availability.model";

//GET takes groupId to fetch all first-person user's avaliability for that group
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
    }

    const slots = await Availability.find({ groupId }).lean();
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error in GET /api/availability:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

// POST first-person user's avaliability (day index, start/end hour), requires groupID to know which group to add avaliability to
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { groupId, slots } = await request.json();

    if (!groupId || !Array.isArray(slots) || slots.length === 0) {
      return NextResponse.json({ error: "Missing groupId or slots" }, { status: 400 });
    }

    const docs = slots.map(({ dayIndex, startHour, endHour }: { dayIndex: number; startHour: number; endHour: number }) => ({
      groupId,
      dayIndex,
      startHour,
      endHour,
    }));

    const inserted = await Availability.insertMany(docs);
    return NextResponse.json({ slots: inserted }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/availability:", error);
    return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
  }
}
