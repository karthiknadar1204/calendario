"use client";

import React from "react";
import { useChat } from "ai/react";
import { signOut } from "next-auth/react";
import { createCalendarEvent } from "@/lib/calendarApi";
import { useToast } from "@/hooks/use-toast";

export default function ChatInterface() {
  const { toast } = useToast();
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

  const [creatingEvent, setCreatingEvent] = React.useState<string | null>(null);

  const isWaiting =
    isLoading && messages[messages.length - 1]?.role !== "assistant";

  const handleCreateEvent = async (toolInvocation: any) => {
    setCreatingEvent(toolInvocation.toolCallId);
    try {
      await createCalendarEvent({
        summary: toolInvocation.args.summary,
        startTime: toolInvocation.args.startTime,
        endTime: toolInvocation.args.endTime,
      });
      
      addToolResult({
        toolCallId: toolInvocation.toolCallId,
        state: "done",
        result: "Event created!",
      });
      
      toast({
        title: "Success",
        description: "Calendar event created successfully!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create calendar event",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setCreatingEvent(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground flex-1 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      <button 
        onClick={() => signOut()} 
        className="mb-4 self-end bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/80 transition"
      >
        Sign Out
      </button>
      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md p-4 rounded-lg ${
                  isUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card text-card-foreground shadow-lg"
                }`}
              >
                <p className={`font-semibold mb-2 ${isUser ? "text-right" : "text-left"}`}>
                  {isUser ? "You" : "AI"}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.toolInvocations?.map((toolInvocation) => {
                  if (toolInvocation.toolName === "createCalendarEvent") {
                    return toolInvocation.state === 'done' ? null : (
                      <div
                        key={toolInvocation.toolCallId}
                        className="mt-2 p-2 bg-secondary rounded shadow-inner"
                      >
                        <p className="text-sm text-muted-foreground mb-2">
                          {JSON.stringify(toolInvocation.args, null, 2)}
                        </p>
                        <button
                          className="rounded-md bg-accent text-accent-foreground px-3 py-1 hover:bg-accent/80 transition animate-pulse shadow-lg border-2 border-accent-foreground"
                          onClick={() => handleCreateEvent(toolInvocation)}
                          disabled={creatingEvent === toolInvocation.toolCallId}
                        >
                          {creatingEvent === toolInvocation.toolCallId ? (
                            <span className="flex items-center gap-2">
                              Creating... <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            </span>
                          ) : (
                            'Create Event ✨'
                          )}
                        </button>
                      </div>
                    );
                  }
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
                })}
              </div>
            </div>
          );
        })}
      </div>

      {(isWaiting || error) && (
        <div className="flex items-center justify-center space-x-2 text-muted-foreground my-4">
          {isWaiting ? (
            <>
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
              </div>
              <span className="text-sm font-medium">AI is thinking</span>
            </>
          ) : (
            error && (
              <div className="flex items-center text-destructive">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <span>An error occurred. Please try again later.</span>
              </div>
            )
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 sticky bottom-0 bg-card p-4 border-t border-border"
      >
        <input
          className="flex-1 p-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
          autoFocus
          value={input}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg ${
            isLoading
              ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          } transition`}
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}