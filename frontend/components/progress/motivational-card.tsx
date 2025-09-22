"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Star, Heart, Zap } from "lucide-react"

const motivationalQuotes = [
  {
    quote: "Every day you don't give up is a day you win.",
    author: "Recovery Wisdom",
    icon: Star,
    color: "from-yellow-400 to-orange-500",
  },
  {
    quote: "Healing is not linear, but every step forward counts.",
    author: "Health Journey",
    icon: Heart,
    color: "from-pink-400 to-red-500",
  },
  {
    quote: "Your body is incredibly resilient. Trust the process.",
    author: "Medical Insight",
    icon: Zap,
    color: "from-blue-400 to-purple-500",
  },
  {
    quote: "Progress, not perfection. You're doing amazing.",
    author: "Recovery Coach",
    icon: Star,
    color: "from-green-400 to-teal-500",
  },
  {
    quote: "Each day of recovery is an investment in your future self.",
    author: "Wellness Guide",
    icon: Heart,
    color: "from-purple-400 to-pink-500",
  },
]

export function MotivationalCard() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
      setIsAnimating(false)
    }, 300)
  }

  useEffect(() => {
    const interval = setInterval(nextQuote, 10000) // Auto-rotate every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const quote = motivationalQuotes[currentQuote]
  const Icon = quote.icon

  return (
    <Card className={`bg-gradient-to-r ${quote.color} text-white border-none shadow-lg animate-fade-in-up`}>
      <CardContent className="p-6">
        <div
          className={`transition-all duration-300 ${isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"}`}
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <blockquote className="text-lg font-medium mb-2">"{quote.quote}"</blockquote>
              <cite className="text-sm opacity-90">— {quote.author}</cite>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextQuote}
              className="text-white hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
