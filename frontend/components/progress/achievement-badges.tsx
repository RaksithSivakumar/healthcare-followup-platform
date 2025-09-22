"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Star, Heart, Zap, Target, Trophy, Medal, Crown, Shield, Flame, CheckCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Completed your first walk after surgery",
    icon: Target,
    earned: true,
    earnedDate: "Day 5",
    rarity: "common",
    points: 10,
  },
  {
    id: 2,
    title: "Pain Warrior",
    description: "Managed pain levels below 5 for 3 consecutive days",
    icon: Shield,
    earned: true,
    earnedDate: "Day 8",
    rarity: "uncommon",
    points: 25,
  },
  {
    id: 3,
    title: "Medication Master",
    description: "Perfect medication adherence for one week",
    icon: Star,
    earned: true,
    earnedDate: "Day 7",
    rarity: "common",
    points: 15,
  },
  {
    id: 4,
    title: "Healing Hero",
    description: "Wound healing ahead of schedule",
    icon: Heart,
    earned: true,
    earnedDate: "Day 10",
    rarity: "rare",
    points: 50,
  },
  {
    id: 5,
    title: "Mood Booster",
    description: "Maintained positive mood for 5 days",
    icon: Zap,
    earned: true,
    earnedDate: "Day 12",
    rarity: "uncommon",
    points: 30,
  },
  {
    id: 6,
    title: "Recovery Champion",
    description: "Reached 80% recovery milestone",
    icon: Trophy,
    earned: true,
    earnedDate: "Day 14",
    rarity: "epic",
    points: 100,
  },
  {
    id: 7,
    title: "Consistency King",
    description: "Complete daily check-ins for 14 days",
    icon: Crown,
    earned: false,
    earnedDate: null,
    rarity: "rare",
    points: 75,
    progress: 85,
  },
  {
    id: 8,
    title: "Perfect Patient",
    description: "Follow all medical instructions for 30 days",
    icon: Medal,
    earned: false,
    earnedDate: null,
    rarity: "legendary",
    points: 200,
    progress: 47,
  },
  {
    id: 9,
    title: "Milestone Master",
    description: "Complete all major recovery milestones",
    icon: Flame,
    earned: false,
    earnedDate: null,
    rarity: "legendary",
    points: 300,
    progress: 62,
  },
]

const rarityColors = {
  common: "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950/20",
  uncommon: "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/20",
  rare: "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20",
  epic: "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/20",
  legendary: "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/20",
}

export function AchievementBadges() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<any>(null)

  const totalPoints = achievements.filter((a) => a.earned).reduce((sum, a) => sum + a.points, 0)
  const earnedCount = achievements.filter((a) => a.earned).length

  const triggerNewAchievement = (achievement: any) => {
    setNewAchievement(achievement)
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setNewAchievement(null)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 animate-pulse">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* New Achievement Popup */}
      {newAchievement && (
        <Card className="fixed top-4 right-4 z-40 animate-slide-down shadow-2xl border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Achievement Unlocked!</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{newAchievement.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{earnedCount}</div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Achievements Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalPoints}</div>
                <p className="text-xs text-purple-700 dark:text-purple-300">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {Math.round((earnedCount / achievements.length) * 100)}%
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon
          const isEarned = achievement.earned

          return (
            <Card
              key={achievement.id}
              className={cn(
                "transition-all duration-300 hover:shadow-lg animate-fade-in-up",
                isEarned
                  ? rarityColors[achievement.rarity]
                  : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20 opacity-60",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        isEarned ? "bg-white/50 dark:bg-black/20" : "bg-gray-200 dark:bg-gray-800",
                      )}
                    >
                      {isEarned ? <Icon className="h-6 w-6" /> : <Lock className="h-6 w-6 text-gray-400" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          achievement.rarity === "legendary" && "border-yellow-400 text-yellow-600",
                          achievement.rarity === "epic" && "border-purple-400 text-purple-600",
                          achievement.rarity === "rare" && "border-blue-400 text-blue-600",
                          achievement.rarity === "uncommon" && "border-green-400 text-green-600",
                        )}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                  {isEarned && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{achievement.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{achievement.points} pts</span>
                  </div>
                  {isEarned ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-950/20">
                      {achievement.earnedDate}
                    </Badge>
                  ) : achievement.progress ? (
                    <Badge variant="outline">{achievement.progress}% complete</Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </div>
                {!isEarned && achievement.progress && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Demo Button */}
      <Card className="text-center">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Demo Achievement System</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Click below to see the achievement unlock animation with confetti
          </p>
          <Button
            onClick={() => triggerNewAchievement({ title: "Demo Achievement", description: "You clicked the button!" })}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Unlock Demo Achievement
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
