"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, User, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type: "text" | "image" | "analysis"
  imageUrl?: string
  analysis?: {
    findings: string[]
    recommendations: string[]
    riskLevel: "low" | "medium" | "high"
  }
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user"
  const isAnalysis = message.type === "analysis"

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-50 border-green-200 text-green-800"
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "high":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-green-50 border-green-200 text-green-800"
    }
  }

  return (
    <div className={cn("flex gap-3 animate-fade-in", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
            <AvatarFallback className="bg-accent text-accent-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <Card
          className={cn(
            "shadow-sm border transition-all duration-200 hover:shadow-md",
            isUser
              ? "bg-primary text-primary-foreground border-primary/20"
              : "bg-card text-card-foreground border-border",
          )}
        >
          <CardContent className="p-3">
            {message.type === "image" && message.imageUrl && (
              <div className="mb-3">
                <img
                  src={message.imageUrl || "/placeholder.svg"}
                  alt="Uploaded image"
                  className="max-w-full h-auto rounded-md border border-border"
                />
              </div>
            )}

            {isAnalysis && message.analysis ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getRiskIcon(message.analysis.riskLevel)}
                    Risk Level: {message.analysis.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <MarkdownRenderer content={message.content} />

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">🔍 Clinical Findings</h4>
                    <ul className="space-y-1">
                      {message.analysis.findings.map((finding, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-accent mt-1">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">💡 Recommendations</h4>
                    <ul className="space-y-1">
                      {message.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-accent mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <MarkdownRenderer
                content={message.content}
                className={isUser ? "text-primary-foreground" : "text-card-foreground"}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {!isUser && (
            <Badge variant="outline" className="text-xs">
              AI Assistant
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
