import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongo-db/client";
import { Event } from "@/app/api/mongo-db/event.model";

// Reference Monday used to convert dayIndex+hour <-> Date
// Jan 6 2025 (UTC) is a Monday → dayIndex 0
const REF_MONDAY = new Date(Date.UTC(2025, 0, 6));

function toDate(dayIndex: number, hour: number): Date {
  const d = new Date(REF_MONDAY);
  d.setUTCDate(d.getUTCDate() + dayIndex);
  d.setUTCHours(hour, 0, 0, 0);
  return d;
}

function fromDate(date: Date): { dayIndex: number; hour: number } {
  const d = new Date(date);
  return {
    dayIndex: (d.getUTCDay() + 6) % 7, // Mon=0 … Sun=6
    hour: d.getUTCHours(),
  };
}

// GET /api/events?groupId=<id>  — fetch all events for a group
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
    }

    const rawEvents = await Event.find({ group: groupId }).lean();

    const events = rawEvents.map((e: any) => {
      const { dayIndex, hour: startHour } = fromDate(new Date(e.startTime));
      const { hour: endHour } = fromDate(new Date(e.endTime));
      return {
        id: e._id.toString(),
        title: e.title,
        dayIndex,
        startHour,
        endHour,
        invitees: (e.attendees ?? []).map((a: any) => a.toString()),
      };
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/events  — create a new event for a group
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { groupId, title, dayIndex, startHour, endHour, createdBy } = body;

    if (!groupId || !title || dayIndex === undefined || startHour === undefined || endHour === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await Event.create({
      group: groupId,
      createdBy: createdBy ?? "unknown",
      title,
      startTime: toDate(dayIndex, startHour),
      endTime: toDate(dayIndex, endHour),
      attendees: [],
    });

    return NextResponse.json(
      {
        event: {
          id: event._id.toString(),
          title: event.title,
          dayIndex,
          startHour,
          endHour,
          invitees: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Safely extract message — Mongoose errors can have circular refs that break JSON.stringify
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Error in POST /api/events:", detail);
    return NextResponse.json({ error: "Failed to create event", detail }, { status: 500 });
  }
}
