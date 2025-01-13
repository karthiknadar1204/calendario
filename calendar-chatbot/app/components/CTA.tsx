import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/60 backdrop-blur-md">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Ready to Revolutionize Your Calendar?
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Join thousands of users who have simplified their scheduling with Calendario. Try it free for 14 days!
        </p>
        <Button 
          size="lg" 
          onClick={() => signIn("google")}
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 transition-all duration-300"
        >
          Start Your Free Trial
        </Button>
      </div>
    </section>
  )
}

