import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/mongo-db/client";
import { Event } from "@/app/api/mongo-db/event.model";

const REF_MONDAY = new Date(Date.UTC(2025, 0, 6));

function toDate(dayIndex: number, hour: number): Date {
  const d = new Date(REF_MONDAY);
  d.setUTCDate(d.getUTCDate() + dayIndex);
  d.setUTCHours(hour, 0, 0, 0);
  return d;
}

// PATCH /api/events/[id]  — update start/end time of an event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { startHour, endHour, dayIndex } = await request.json();

    if (startHour === undefined || endHour === undefined) {
      return NextResponse.json({ error: "Missing startHour or endHour" }, { status: 400 });
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const currentDayIndex =
      dayIndex !== undefined
        ? dayIndex
        : (new Date(event.startTime).getUTCDay() + 6) % 7;

    event.startTime = toDate(currentDayIndex, startHour);
    event.endTime = toDate(currentDayIndex, endHour);
    await event.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE /api/events/[id]  — remove an event
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
