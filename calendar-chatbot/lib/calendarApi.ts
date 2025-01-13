"use server";

import { calendar_v3, google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { auth, EnrichedSession } from "@/auth";

async function getGoogleCalendar(): Promise<calendar_v3.Calendar> {
  const session = (await auth()) as EnrichedSession;

  if (!session) throw new Error("Authentication session not found");

  const oauth2Client = new OAuth2Client({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  });

  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  return google.calendar({ version: "v3", auth: oauth2Client });
}

interface CreateEventParams {
  summary: string;
  startTime: string;
  endTime: string;
}

export async function createCalendarEvent({
  summary,
  startTime,
  endTime,
}: CreateEventParams): Promise<calendar_v3.Schema$Event> {
  try {
    const calendar = await getGoogleCalendar();
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: `[AI] ${summary}`,
        start: { dateTime: new Date(startTime).toISOString(), timeZone: "UTC" },
        end: { dateTime: new Date(endTime).toISOString(), timeZone: "UTC" },
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error("Failed to create calendar event");
  }
}

interface CalendarEvent {
  summary: string;
  start: string;
  end?: string;
  allDay: boolean;
}

export async function fetchCalendarEvents(
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> {
  try {
    const calendar = await getGoogleCalendar();
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date(`${startDate} 00:00:00`).toISOString(),
      timeMax: new Date(`${endDate} 23:59:59`).toISOString(),
      timeZone: "UTC",
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items?.map(
      ({ summary, start, end }: calendar_v3.Schema$Event) => {
        if (start?.dateTime && end?.dateTime) {
          return {
            summary,
            start: new Date(start.dateTime).toLocaleString(),
            end: new Date(end.dateTime).toLocaleString(),
            allDay: false,
          };
        }
        return {
          summary,
          start: new Date(start?.date as string).toLocaleDateString(),
          allDay: true,
        };
      }
    ) as CalendarEvent[];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error("Failed to fetch calendar events");
  }
}
