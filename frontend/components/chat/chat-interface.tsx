"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, ImageIcon, Bot, VolumeX, Camera, Upload } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { TypingIndicator } from "./typing-indicator"
// import { VoiceRecorder } from "./voice-recorder"

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

const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello John! I'm your AI health assistant. How are you feeling today? I'm here to help with any questions about your recovery, symptoms, or medications.",
    sender: "ai",
    timestamp: new Date(Date.now() - 300000),
    type: "text",
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (content: string, type: "text" | "image" = "text", imageUrl?: string) => {
    if (!content.trim() && type === "text") return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type,
      imageUrl,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    setIsTyping(true)
    try {
      let aiResponse: Message
      if (type === "image") {
        // Mock analysis for image uploads
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: "I've analyzed your wound image. Here's what I found:",
          sender: "ai",
          timestamp: new Date(),
          type: "analysis",
          analysis: {
            findings: [
              "Wound edges appear clean and well-approximated",
              "No signs of infection or unusual discharge",
              "Healing progressing within normal parameters",
              "Slight redness consistent with normal inflammatory response",
            ],
            recommendations: [
              "Continue current wound care routine",
              "Keep the area clean and dry",
              "Monitor for any changes in color, size, or discharge",
              "Follow up with your healthcare provider as scheduled",
            ],
            riskLevel: "low",
          },
        }
      } else {
        // Call external AI endpoint
        const response = await fetch("https://raksith-healthcare.hf.space/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: content }),
        })

        let replyText = ""
        try {
          const maybeJson = await response.clone().json()
          replyText =
            typeof maybeJson === "string"
              ? maybeJson
              : maybeJson?.answer || maybeJson?.result || JSON.stringify(maybeJson)
        } catch {
          replyText = await response.text()
        }

        if (!response.ok) {
          throw new Error(replyText || `Request failed with ${response.status}`)
        }

        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: replyText || "",
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }
      }

      setMessages((prev) => [...prev, aiResponse])

      // Text-to-speech for AI responses
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse.content)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 0.8
        setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        speechSynthesis.speak(utterance)
      }
    } catch (err: any) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error contacting assistant: ${err?.message || "Unknown error"}`,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, aiResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        handleSendMessage("Uploaded wound image for analysis", "image", imageUrl)
      }
      reader.readAsDataURL(file)
    }
    setShowImageUpload(false)
  }

  const handleVoiceInput = (transcript: string) => {
    if (transcript) {
      handleSendMessage(transcript)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">AI Health Assistant</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Secure Chat</Badge>
              {isSpeaking && (
                <Button variant="ghost" size="icon" onClick={stopSpeaking}>
                  <VolumeX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <CardContent className="border-t p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message or ask about your health..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                {/* <VoiceRecorder
                  isRecording={isRecording}
                  onStartRecording={() => setIsRecording(true)}
                  onStopRecording={() => setIsRecording(false)}
                  onTranscript={handleVoiceInput}
                /> */}
              </div>
            </div>
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Upload Panel */}
          {showImageUpload && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg animate-slide-down">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Upload wound image for AI analysis</span>
                <Button variant="ghost" size="sm" onClick={() => setShowImageUpload(false)}>
                  ×
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}