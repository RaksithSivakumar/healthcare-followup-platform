"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Save, TrendingUp, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const moodEmojis = [
  { emoji: "😢", label: "Very Sad", value: 1, color: "text-red-500" },
  { emoji: "😟", label: "Sad", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Neutral", value: 3, color: "text-yellow-500" },
  { emoji: "🙂", label: "Good", value: 4, color: "text-green-500" },
  { emoji: "😊", label: "Great", value: 5, color: "text-green-600" },
]

export function PainMoodTracker() {
  const [painLevel, setPainLevel] = useState([3])
  const [selectedMood, setSelectedMood] = useState(4)
  const [notes, setNotes] = useState("")
  const [recentEntries, setRecentEntries] = useState([
    { date: "Today", pain: 3, mood: 4, notes: "Feeling much better, less stiffness" },
    { date: "Yesterday", pain: 4, mood: 3, notes: "Some discomfort but manageable" },
    { date: "2 days ago", pain: 5, mood: 3, notes: "Moderate pain, took extra rest" },
    { date: "3 days ago", pain: 4, mood: 4, notes: "Good progress with physical therapy" },
  ])

  const getPainColor = (level: number) => {
    if (level <= 3) return "from-green-400 to-green-600"
    if (level <= 6) return "from-yellow-400 to-yellow-600"
    return "from-red-400 to-red-600"
  }

  const getPainLabel = (level: number) => {
    if (level === 0) return "No Pain"
    if (level <= 3) return "Mild Pain"
    if (level <= 6) return "Moderate Pain"
    if (level <= 8) return "Severe Pain"
    return "Extreme Pain"
  }

  const handleSave = () => {
    const newEntry = {
      date: "Just now",
      pain: painLevel[0],
      mood: selectedMood,
      notes: notes || "No additional notes",
    }

    // Add new entry to the top of the log
    setRecentEntries([newEntry, ...recentEntries])

    // Reset notes field
    setNotes("")
  }

  return (
    <div className="space-y-6">
      {/* Pain & Mood Trackers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pain Tracker */}
        <Card className="glass glass-dark">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
              <span>Pain Level</span>
            </CardTitle>
            <CardDescription>Rate your current pain level from 0-10</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{painLevel[0]}/10</div>
              <Badge className={cn("text-white bg-gradient-to-r", getPainColor(painLevel[0]))} variant="secondary">
                {getPainLabel(painLevel[0])}
              </Badge>
            </div>
            <div className="px-3">
              <Slider value={painLevel} onValueChange={setPainLevel} max={10} min={0} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>No Pain</span>
                <span>Worst Pain</span>
              </div>
            </div>
            <div
              className={cn(
                "h-2 rounded-full bg-gradient-to-r transition-all duration-300",
                getPainColor(painLevel[0]),
              )}
              style={{ width: `${(painLevel[0] / 10) * 100}%` }}
            ></div>
          </CardContent>
        </Card>

        {/* Mood Tracker */}
        <Card className="glass glass-dark">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Mood Tracker</span>
            </CardTitle>
            <CardDescription>How are you feeling emotionally today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-2">{moodEmojis.find((m) => m.value === selectedMood)?.emoji}</div>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {moodEmojis.find((m) => m.value === selectedMood)?.label}
              </Badge>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  className="h-16 text-2xl"
                  onClick={() => setSelectedMood(mood.value)}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>Any additional thoughts or observations about your recovery today?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="How did you sleep? Any new symptoms? What helped with pain management today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Today's Entry
          </Button>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>Recent Entries</span>
          </CardTitle>
          <CardDescription>Your pain and mood tracking history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEntries.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium w-20">{entry.date}</div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Pain: {entry.pain}/10
                    </Badge>
                    <div className="text-lg">{moodEmojis.find((m) => m.value === entry.mood)?.emoji}</div>
                  </div>
                </div>
                <div className="flex-1 mx-4">
                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
