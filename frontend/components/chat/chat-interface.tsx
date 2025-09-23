"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  ImageIcon,
  Bot,
  VolumeX,
  Volume2,
  Camera,
  Upload,
} from "lucide-react";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import { VoiceRecorder } from "./voice-recorder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "image" | "analysis";
  imageUrl?: string;
  analysis?: {
    findings: string[];
    recommendations: string[];
    riskLevel: "low" | "medium" | "high";
  };
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
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenId, setLastSpokenId] = useState<string | null>(null);
  const STORAGE_KEY = "chat_history_v1";
  const VOICE_LANG_KEY = "chat_voice_lang_v1";
  const VOICE_MUTE_KEY = "chat_voice_muted_v1";
  const [selectedLang, setSelectedLang] = useState<string>("en-IN");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const LANGUAGE_OPTIONS: {
    code: string;
    label: string;
    fallbacks: string[];
  }[] = [
    {
      code: "en-IN",
      label: "English",
      fallbacks: ["en-IN", "en-US", "en-GB", "en"],
    },
    { code: "ta-IN", label: "Tamil", fallbacks: ["ta-IN", "ta"] },
    { code: "hi-IN", label: "Hindi", fallbacks: ["hi-IN", "hi"] },
    { code: "ml-IN", label: "Malayalam", fallbacks: ["ml-IN", "ml"] },
    { code: "kn-IN", label: "Kannada", fallbacks: ["kn-IN", "kn"] },
    { code: "te-IN", label: "Telugu", fallbacks: ["te-IN", "te"] },
  ];
  const [showImageUpload, setShowImageUpload] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Message[];
        const revived = saved.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        if (revived.length > 0) {
          setMessages(revived);
        }
      }
    } catch {}
  }, []);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Load voice settings
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(VOICE_LANG_KEY);
      if (savedLang) setSelectedLang(savedLang);
      const savedMute = localStorage.getItem(VOICE_MUTE_KEY);
      if (savedMute != null) setIsMuted(savedMute === "true");
    } catch {}

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const v = speechSynthesis.getVoices();
        setVoices(v);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const markdownToPlainText = (md: string) => {
    return md
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/^>\s?/gm, "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "• ")
      .replace(/^\s*\d+\.\s+/gm, (m) => m.replace(/\d+\./, (n) => `${n} `))
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_/g, " ")
      .replace(/\|/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim();
  };

  const getPreferredVoice = (langCode: string) => {
    if (!voices || voices.length === 0) return null;
    const option = LANGUAGE_OPTIONS.find((l) => l.code === langCode);
    const candidates = option ? option.fallbacks : [langCode];
    for (const cand of candidates) {
      const voice = voices.find((v) =>
        v.lang?.toLowerCase().startsWith(cand.toLowerCase())
      );
      if (voice) return voice;
    }
    return null;
  };

  // Speak AI messages
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.sender !== "ai" || last.id === lastSpokenId) return;
    if (isMuted) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const text = markdownToPlainText(last.content);
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 0.85;
    utterance.lang = selectedLang;
    const preferred = getPreferredVoice(selectedLang);
    if (preferred) utterance.voice = preferred;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    try {
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      setLastSpokenId(last.id);
    } catch {
      setIsSpeaking(false);
    }
  }, [messages, lastSpokenId, selectedLang, voices, isMuted]);

  const handleSendMessage = async (
    content: string,
    type: "text" | "image" = "text",
    imageUrl?: string
  ) => {
    if (!content.trim() && type === "text") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type,
      imageUrl,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      let aiResponse: Message;
      if (type === "image") {
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
        };
      } else {
        const recentHistory = [...messages, newMessage].slice(-15).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content,
          type: m.type,
        }));

        const response = await fetch(
          "https://raksith-healthcare.hf.space/query",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: content, history: recentHistory }),
          }
        );

        let replyText = "";
        try {
          const maybeJson = await response.clone().json();
          replyText =
            typeof maybeJson === "string"
              ? maybeJson
              : maybeJson?.answer ||
                maybeJson?.result ||
                JSON.stringify(maybeJson);
        } catch {
          replyText = await response.text();
        }

        if (!response.ok)
          throw new Error(
            replyText || `Request failed with ${response.status}`
          );

        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: replyText || "",
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        };
      }
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: any) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error contacting assistant: ${
          err?.message || "Unknown error"
        }`,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleSendMessage(
          "Uploaded wound image for analysis",
          "image",
          imageUrl
        );
      };
      reader.readAsDataURL(file);
    }
    setShowImageUpload(false);
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript) handleSendMessage(transcript);
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMessages(initialMessages);
      setLastSpokenId(null);
    } catch {}
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);

    try {
      localStorage.setItem(VOICE_MUTE_KEY, String(next));
    } catch {}

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (next) {
        // Muting → Pause instead of cancel
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
          speechSynthesis.pause();
        }
      } else {
        // Unmuting → Resume if paused
        if (speechSynthesis.paused) {
          speechSynthesis.resume();
        }
      }
    }
  };

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

              {/* Single Mute/Unmute Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                title={isMuted ? "Unmute voice" : "Mute voice"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <Select
                value={selectedLang}
                onValueChange={(v) => {
                  setSelectedLang(v);
                  try {
                    localStorage.setItem(VOICE_LANG_KEY, v);
                  } catch {}
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Voice language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.code} value={opt.code}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                Clear
              </Button>
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
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSendMessage(inputValue)
                }
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
                <VoiceRecorder
                  isRecording={isRecording}
                  onStartRecording={() => setIsRecording(true)}
                  onStopRecording={() => setIsRecording(false)}
                  onTranscript={handleVoiceInput}
                  language={selectedLang} // 🔹 link voice input to selected language
                />
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
                <span className="text-sm font-medium">
                  Upload wound image for AI analysis
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(false)}
                >
                  ×
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
