import { convertToCoreMessages, streamText } from "ai";
import { friendli } from "@friendliai/ai-provider";
import { auth } from "@/auth";
import { z } from "zod";

import { fetchCalendarEvents } from "@/lib/calendarApi";

export async function POST(req: Request) {
  const { messages, datetime } = await req.json();
  if (!messages) return new Response("Messages is required", { status: 400 });

  if (!(await auth().then((session) => session?.user))) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Filter out messages with pending tool calls
  const processedMessages = messages.map(message => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.filter(tool => tool.state === 'done' && tool.result)
      };
    }
    return message;
  });

  const result = await streamText({
    model: friendli("meta-llama-3.1-70b-instruct", {
      tools: [
        {
          type: "web:search",
        },
      ],
      parallelToolCalls: false,
    }),
    system: `Today is ${datetime}. You are a helpful calendar assistant.`,
    messages: convertToCoreMessages(processedMessages),
    abortSignal: req.signal,
    maxSteps: 4,
    tools: {
      createCalendarEvent: {
        description: `Creates a new calendar event.`,
        parameters: z.object({
          summary: z.string().describe("Title of the event to be added"),
          startTime: z
            .string()
            .describe(
              "Date and time of the event, format should be 'yyyy-MM-dd HH:mm'"
            ),
          endTime: z
            .string()
            .describe(
              "Date and time of the event, format should be 'yyyy-MM-dd HH:mm'"
            ),
        }),
      },
      fetchCalendarEvents: {
        description: `Retrieves calendar events within a specified date range.`,
        parameters: z.object({
          startDate: z
            .string()
            .describe("Start date of the search range (format: yyyy-MM-dd)"),
          endDate: z
            .string()
            .describe("End date of the search range (format: yyyy-MM-dd)"),
        }),
        execute: async ({ startDate, endDate }) => {
          try {
            const events = await fetchCalendarEvents(startDate, endDate);
            return JSON.stringify({
              message: "Calendar events fetched successfully.",
              events,
            });
          } catch {
            return JSON.stringify({
              message: "Error fetching calendar events.",
            });
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
