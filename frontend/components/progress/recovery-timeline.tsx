"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const timelineData = [
  {
    id: 1,
    title: "Surgery Completed",
    description: "Successful procedure with no complications",
    date: "Day 0",
    status: "completed",
    type: "major",
  },
  {
    id: 2,
    title: "Initial Recovery",
    description: "Pain management and wound care established",
    date: "Day 1-3",
    status: "completed",
    type: "minor",
  },
  {
    id: 3,
    title: "Mobility Milestone",
    description: "First successful walk without assistance",
    date: "Day 5",
    status: "completed",
    type: "major",
  },
  {
    id: 4,
    title: "Wound Healing Check",
    description: "Excellent healing progress, no signs of infection",
    date: "Day 7",
    status: "completed",
    type: "minor",
  },
  {
    id: 5,
    title: "Pain Reduction",
    description: "Pain levels decreased to manageable levels",
    date: "Day 10",
    status: "completed",
    type: "major",
  },
  {
    id: 6,
    title: "Physical Therapy Start",
    description: "Beginning structured rehabilitation program",
    date: "Day 14",
    status: "current",
    type: "major",
  },
  {
    id: 7,
    title: "Suture Removal",
    description: "Scheduled removal of surgical sutures",
    date: "Day 21",
    status: "upcoming",
    type: "minor",
  },
  {
    id: 8,
    title: "Full Recovery",
    description: "Expected return to normal activities",
    date: "Day 42",
    status: "upcoming",
    type: "major",
  },
]

export function RecoveryTimeline() {
  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-gray-300"></div>

        {timelineData.map((item, index) => {
          const isCompleted = item.status === "completed"
          const isCurrent = item.status === "current"
          const isUpcoming = item.status === "upcoming"

          return (
            <div
              key={item.id}
              className={cn(
                "relative flex items-start space-x-4 pb-8 animate-fade-in-up",
                isCompleted && "opacity-90",
                isCurrent && "opacity-100",
                isUpcoming && "opacity-60",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Timeline Icon */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4",
                  isCompleted && "bg-green-500 border-green-200 text-white",
                  isCurrent && "bg-blue-500 border-blue-200 text-white animate-pulse-glow",
                  isUpcoming && "bg-gray-200 border-gray-300 text-gray-500",
                )}
              >
                {isCompleted && <CheckCircle className="w-6 h-6" />}
                {isCurrent && <Clock className="w-6 h-6" />}
                {isUpcoming && <Circle className="w-6 h-6" />}
                {item.type === "major" && (
                  <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>

              {/* Timeline Content */}
              <Card
                className={cn(
                  "flex-1 transition-all duration-300",
                  isCompleted && "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
                  isCurrent && "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 shadow-lg",
                  isUpcoming && "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={isCompleted ? "default" : isCurrent ? "secondary" : "outline"}
                        className={cn(
                          isCompleted && "bg-green-500",
                          isCurrent && "bg-blue-500",
                          isUpcoming && "bg-gray-400",
                        )}
                      >
                        {item.date}
                      </Badge>
                      {item.type === "major" && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                          Major Milestone
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  {isCurrent && (
                    <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                        🎯 Current Focus: Stay consistent with physical therapy exercises
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
