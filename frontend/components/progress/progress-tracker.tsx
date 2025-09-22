"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Award, Heart, Calendar } from "lucide-react"
import { RecoveryTimeline } from "./recovery-timeline"
import { AchievementBadges } from "./achievement-badges"
import { PainMoodTracker } from "./pain-mood-tracker"
import { ProgressCharts } from "./progress-charts"
import { MotivationalCard } from "./motivational-card"

export function ProgressTracker() {
  const [activeTab, setActiveTab] = useState("tracking")

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 animate-fade-in-up">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">85%</div>
                <p className="text-xs text-green-700 dark:text-green-300">Overall Recovery</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">12</div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">Good</div>
                <p className="text-xs text-purple-700 dark:text-purple-300">Current Mood</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">14</div>
                <p className="text-xs text-orange-700 dark:text-orange-300">Days Since Surgery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MotivationalCard />

      {/* Main Progress Interface */}
      <Card className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Recovery Dashboard</span>
          </CardTitle>
          <CardDescription>Comprehensive view of your healing journey and progress metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
              {/* <TabsTrigger value="timeline">Timeline</TabsTrigger> */}
              <TabsTrigger value="tracking">Daily Tracking</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* <TabsContent value="overview" className="space-y-6 mt-6">
              <ProgressCharts />
            </TabsContent> */}

            {/* <TabsContent value="timeline" className="space-y-6 mt-6">
              <RecoveryTimeline />
            </TabsContent> */}

            <TabsContent value="tracking" className="space-y-6 mt-6">
              <PainMoodTracker />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6 mt-6">
              <AchievementBadges />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
