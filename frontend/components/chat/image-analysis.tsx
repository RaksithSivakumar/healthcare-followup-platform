import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Analysis {
  findings: string[]
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
}

interface ImageAnalysisProps {
  analysis: Analysis
}

const riskConfig = {
  low: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    label: "Low Risk",
  },
  medium: {
    icon: Info,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    label: "Medium Risk",
  },
  high: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    label: "High Risk",
  },
}

export function ImageAnalysis({ analysis }: ImageAnalysisProps) {
  const config = riskConfig[analysis.riskLevel]
  const Icon = config.icon

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">AI Analysis Results</h4>
        <Badge variant="secondary" className={cn(config.bgColor, config.borderColor, config.color, "border")}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      <Card className={cn("border", config.borderColor, config.bgColor)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Findings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-1">
            {analysis.findings.map((finding, index) => (
              <li key={index} className="text-xs flex items-start space-x-2">
                <div className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></div>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-800 dark:text-blue-200">Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-1">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="text-xs flex items-start space-x-2 text-blue-700 dark:text-blue-300">
                <div className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></div>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
