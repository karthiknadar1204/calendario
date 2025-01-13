"use client";

import React from "react";
import { useChat } from "ai/react";
import { createCalendarEvent } from "@/lib/calendarApi";
import { signOut } from "next-auth/react";

export default function Page() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    addToolResult,
  } = useChat({
    body: {
      datetime: new Date().toLocaleString(),
    },
  });

  const isWaiting =
    isLoading && messages[messages.length - 1]?.role !== "assistant";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground flex-1 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      <button onClick={() => signOut()}>Sign Out</button>
      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user" ? "bg-muted" : "bg-primary/10"
            }`}
          >
            <p className="font-semibold mb-2">
              {message.role === "user" ? "You" : "AI"}
            </p>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.toolInvocations?.map((toolInvocation) => {
              switch (toolInvocation.toolName) {
                case "createCalendarEvent":
                  return (
                    <div
                      key={toolInvocation.toolCallId}
                      className="mt-2 p-2 bg-secondary/20 rounded"
                    >
                      <p className="text-sm text-muted-foreground mb-2">
                        {JSON.stringify(toolInvocation.args)}
                      </p>
                      <button
                        className="rounded-md bg-blue-500 text-white px-2 py-1"
                        onClick={() => {
                          createCalendarEvent({
                            summary: toolInvocation.args.summary,
                            startTime: toolInvocation.args.startTime,
                            endTime: toolInvocation.args.endTime,
                          }).then(() => {
                            addToolResult({
                              toolCallId: toolInvocation.toolCallId,
                              result: "Event created!",
                            });
                          });
                        }}
                      >
                        Create Event
                      </button>
                    </div>
                  );
                default:
                  return (
                    <p
                      key={toolInvocation.toolCallId}
                      className="text-sm text-muted-foreground mt-2"
                    >
                      {`${toolInvocation.toolName}: ${JSON.stringify(
                        toolInvocation.args
                      )} -> ${toolInvocation.state}`}
                    </p>
                  );
              }
            })}
          </div>
        ))}
      </div>

      {(isWaiting || error) && (
        <p className="text-muted-foreground text-center my-4">
          {isWaiting
            ? "AI is thinking..."
            : error && "An error has occurred. Please try again later."}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 sticky bottom-0 bg-background p-4 border-t"
      >
        <input
          className="flex-1 p-2 rounded-lg border border-primary/20"
          placeholder="Type your message..."
          autoFocus
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
