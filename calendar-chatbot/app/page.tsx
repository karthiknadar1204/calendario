'use client';

import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { useSession } from "next-auth/react";
import ChatInterface from "./components/ChatInterface";

export default function LandingPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/95">
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-primary border-t-transparent shadow-lg shadow-primary/20" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <main>
          <Hero />
          <Features />
          <CTA />
        </main>
        <Footer />
      </div>
    );
  }

  return <ChatInterface />;
}

