import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export interface GoogleEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
}

export async function getGoogleCalendarEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string
): Promise<GoogleEvent[]> {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 100,
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
  }
}

export function parseGoogleEventTime(
  event: GoogleEvent
): {
  startHour: number;
  endHour: number;
  dayIndex: number;
  date: Date;
} | null {
  const startTime =
    event.start.dateTime || event.start.date;
  const endTime = event.end.dateTime || event.end.date;

  if (!startTime || !endTime) return null;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = startDate.getDay();
  // Convert to our format (0 = Monday, 6 = Sunday)
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startHour = startDate.getHours();
  const endHour = endDate.getHours();

  return {
    startHour: Math.max(8, startHour), // Clamp to calendar view
    endHour: Math.min(17, endHour || startHour + 1), // Clamp to calendar view
    dayIndex,
    date: startDate,
  };
}
