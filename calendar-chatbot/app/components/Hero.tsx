'use client';

import { Button } from "@/components/ui/button"
import { Calendar, Sparkles } from 'lucide-react'
import { signIn } from "next-auth/react"

export default function Hero() {
  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-900/20" />
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="relative z-10 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-600 mb-6 animate-text">
          Calendario
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 mb-8 max-w-3xl">
          Your AI-Powered Calendar Assistant
        </p>
        <div className="flex items-center justify-center space-x-4 text-lg text-gray-400 mb-12">
          <Calendar className="w-6 h-6 text-primary" />
          <span>Intelligent Scheduling</span>
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <Button
          onClick={() => signIn("google")}
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
          variant="outline"
          size="lg"
        >
          <span className="mr-2">Connect with Google</span>
          <svg className="w-5 h-5 fill-current transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </Button>
      </div>
    </div>
  )
}

