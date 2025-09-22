"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertCircle, Info } from "lucide-react"

export function AIInsightsCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 border-blue-200 dark:border-blue-800 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>AI Health Insights</span>
          <Badge variant="secondary" className="ml-auto">
            Updated 1h ago
          </Badge>
        </CardTitle>
        <CardDescription>Personalized recommendations based on your health data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Recovery Progress Excellent</p>
              <p className="text-xs text-muted-foreground">
                Your wound healing is 15% faster than average. Continue current medication regimen.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Hydration Reminder</p>
              <p className="text-xs text-muted-foreground">
                You're 2 glasses behind your daily goal. Proper hydration aids recovery.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Sleep Quality Impact</p>
              <p className="text-xs text-muted-foreground">
                Last night's 7.5h sleep correlates with improved pain management scores.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <Info className="h-4 w-4 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Why this alert?</p>
              <p className="text-xs text-muted-foreground">
                Top factors: pain level trend (-12%), medication adherence (+20%), image erythema proxy (-8%).
                Confidence: 0.78. Uncertainty driven by sparse visit frequency.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
