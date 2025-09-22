"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onTranscript: (transcript: string) => void
}

export function VoiceRecorder({ isRecording, onStartRecording, onStopRecording, onTranscript }: VoiceRecorderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          onTranscript(transcript)
          onStopRecording()
        }

        recognitionRef.current.onerror = () => {
          onStopRecording()
        }

        recognitionRef.current.onend = () => {
          onStopRecording()
        }
      }
    }
  }, [onTranscript, onStopRecording])

  const handleToggleRecording = () => {
    if (!isSupported || !recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
      onStopRecording()
    } else {
      recognitionRef.current.start()
      onStartRecording()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", isRecording && "bg-red-100 text-red-600 animate-pulse-glow dark:bg-red-950/20")}
      onClick={handleToggleRecording}
    >
      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
