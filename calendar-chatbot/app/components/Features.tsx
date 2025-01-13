import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, Clock, Zap } from 'lucide-react'

const features = [
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Google Calendar Integration",
    description: "Seamlessly sync with your Google Calendar for a unified scheduling experience."
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Natural Language Input",
    description: "Add reminders and events using everyday language, just like talking to a friend."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Smart Reminders",
    description: "Get intelligent, context-aware reminders that adapt to your schedule."
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Quick Actions",
    description: "Perform common tasks with lightning speed using our intuitive shortcuts."
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50 backdrop-blur-md">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Powerful Features for Effortless Scheduling
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black/60 border-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/20">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

