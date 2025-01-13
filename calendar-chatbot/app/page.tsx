"use client";

import { useSession, signIn } from "next-auth/react";
import ChatInterface from "./components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare } from 'lucide-react';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>Calendar Chatbot</span>
            </CardTitle>
            <CardDescription className="text-center">
              Your AI-powered calendar assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Please sign in to continue</p>
            <Button
              onClick={() => signIn("google")}
              className="w-full"
              variant="outline"
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ChatInterface />;
}

