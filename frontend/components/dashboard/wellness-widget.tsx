import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface WellnessWidgetProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  color: "purple" | "blue" | "green" | "yellow"
  progress: number
}

const colorClasses = {
  purple: "text-purple-500 bg-purple-50 dark:bg-purple-950/20",
  blue: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
  green: "text-green-500 bg-green-50 dark:bg-green-950/20",
  yellow: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
}

export function WellnessWidget({ title, value, subtitle, icon: Icon, color, progress }: WellnessWidgetProps) {
  return (
    <Card className={cn("animate-fade-in-up hover:shadow-lg transition-shadow", colorClasses[color])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={cn("h-5 w-5", `text-${color}-500`)} />
          <div className="text-right">
            <div className="text-lg font-bold">{value}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
          <Progress value={progress} className="h-1" />
        </div>
      </CardContent>
    </Card>
  )
}
