import { NextRequest, NextResponse } from "next/server";
import { getGoogleCalendarEvents, parseGoogleEventTime } from "@/lib/googleCalendar";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, timeMin, timeMax } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 401 }
      );
    }

    let events: any[] = [];

    // For demo purposes, return mock events if using mock token
    if (accessToken.startsWith("mock_token_")) {
      events = [
        {
          id: "mock-event-1",
          summary: "Design Brainstorm",
          start: { dateTime: "2026-04-01T10:00:00Z" },
          end: { dateTime: "2026-04-01T11:00:00Z" },
          description: "Weekly team sync"
        },
        {
          id: "mock-event-2",
          summary: "Project Review",
          start: { dateTime: "2026-04-02T14:00:00Z" },
          end: { dateTime: "2026-04-02T15:30:00Z" },
          description: "Review project progress"
        },
        {
          id: "mock-event-3",
          summary: "Client Call",
          start: { dateTime: "2026-04-03T09:00:00Z" },
          end: { dateTime: "2026-04-03T10:00:00Z" },
          description: "Discuss requirements"
        }
      ];
    } else {
      events = await getGoogleCalendarEvents(
        accessToken,
        timeMin,
        timeMax
      );
    }

    // Process events for calendar display
    const processedEvents = events
      .map((event) => {
        const parsed = parseGoogleEventTime(event);
        if (!parsed) return null;

        return {
          dayIndex: parsed.dayIndex,
          startHour: parsed.startHour,
          endHour: parsed.endHour,
          duration: parsed.endHour - parsed.startHour,
          event: {
            id: event.id,
            summary: event.summary || "Untitled Event",
          },
        };
      })
      .filter(Boolean);

    return NextResponse.json({ events: processedEvents });
  } catch (error) {
    console.error("Error in /api/google-events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
