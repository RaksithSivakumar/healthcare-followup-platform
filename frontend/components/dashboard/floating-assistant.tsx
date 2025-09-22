"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, Mic, X, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function FloatingAssistant() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <Card className="mb-4 w-80 animate-slide-down shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">AI Health Assistant</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask about symptoms
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Mic className="mr-2 h-4 w-4" />
                Voice consultation
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <HelpCircle className="mr-2 h-4 w-4" />
                Emergency guidance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        size="lg"
        className={cn(
          "rounded-full w-14 h-14 shadow-lg animate-pulse-glow",
          "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}
