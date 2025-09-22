"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  TrendingUp,
  Stethoscope,
  AlertTriangle,
  Pill,
  Brain,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ImageComparison } from "./image-comparison";
import { SymptomLogger } from "./symptom-logger";
import { SymptomHistory } from "./symptom-history";
import { AIAnalysisPanel } from "./ai-analysis-panel";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

interface HealthAnalysis {
  result: string;
  hasPatientData: boolean;
  patientName: string | null;
}

// A map to apply colors to the pain level buttons for better visual feedback
const painLevelColors: { [key: number]: { base: string; hover: string } } = {
  1: { base: "bg-green-500/90", hover: "hover:bg-green-500" },
  2: { base: "bg-lime-500/90", hover: "hover:bg-lime-500" },
  3: { base: "bg-yellow-500/90", hover: "hover:bg-yellow-500" },
  4: { base: "bg-orange-500/90", hover: "hover:bg-orange-500" },
  5: { base: "bg-red-500/90", hover: "hover:bg-red-500" },
};

export function SymptomChecker() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("check");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  // State for interactive yes/no questions
  const [painLevel, setPainLevel] = useState<number | null>(3); // Default to a neutral value
  const [newSymptoms, setNewSymptoms] = useState<boolean | null>(null);
  const [medicationTaken, setMedicationTaken] = useState<boolean | null>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickResult, setQuickResult] = useState<string | null>(null);
  const [quickError, setQuickError] = useState<string | null>(null);

  // State for detailed health analysis
  const [detailedFormData, setDetailedFormData] = useState({
    feeling: "",
    painLevel: "3",
    newSymptoms: false,
    medicationTaken: false,
    symptomsText: ""
  });

  // Function to remove hashtags from Groq response
  const removeHashtags = (text: string): string => {
    if (!text) return '';
    // Remove markdown code block markers (triple backticks)
    let cleaned = text.replace(/```/g, '').trim();
    // Convert hashtags to bold headings with better formatting
    cleaned = cleaned.replace(/^###\s+(.+)$/gm, '**$1**');
    // Remove any remaining hashtags in the middle of lines
    cleaned = cleaned.replace(/#{1,6}\s+/g, '');
    // Remove asterisks (*) used for bullet points
    cleaned = cleaned.replace(/^\*\s+/gm, '• ');
    // Remove any remaining asterisks in the middle of lines
    cleaned = cleaned.replace(/\*/g, '');
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n\s*\n/g, '\n\n').trim();
    return cleaned;
  };

  const handleImageAnalysis = (results: any) => {
    setAnalysisResults(results);
    // Optional: automatically switch to the check tab to show results
    setActiveTab("check");
  };

  const submitQuickAssessment = async () => {
    setQuickError(null);
    setQuickResult(null);
    setIsSubmitting(true);
    try {
      // Derive a simple feeling label from pain level if not explicitly asked
      const derivedFeeling = (() => {
        const level = painLevel ?? 3;
        if (level <= 2) return "Good";
        if (level === 3) return "Okay";
        return "Bad";
      })();

      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeling: derivedFeeling,
          painLevel: painLevel ?? 3,
          newSymptoms: Boolean(newSymptoms),
          medicationTaken: Boolean(medicationTaken),
          symptomsText: "", // can be extended to include free-text input
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to generate assessment");
      }
      setQuickResult(data.result as string);
    } catch (err: any) {
      setQuickError(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailedAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert("Please log in to get personalized health analysis");
      return;
    }

    setIsLoadingAnalysis(true);
    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...detailedFormData,
          userId: user.id
        })
      });

      const data = await response.json();
      if (data.ok) {
        setHealthAnalysis(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error getting health analysis:', error);
      alert('Failed to get health analysis. Please try again.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleDetailedInputChange = (field: string, value: string | boolean | number) => {
    setDetailedFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    // Added a container with a subtle, animated gradient background
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#1b1e24] p-4 md:p-8 transition-colors duration-300">
      <div className="fixed inset-0 z-[-1] opacity-20 dark:opacity-30 bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-blue-200 via-transparent to-transparent dark:from-blue-900" />

      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Main Symptom Check Interface */}
        <Card
          className="rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-2xl shadow-slate-400/10 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-black/30 dark:shadow-black/20"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
              <Stethoscope className="h-7 w-7 text-primary" />
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-slate-50 dark:to-slate-400">
                Symptom Assessment
              </span>
            </CardTitle>
            <CardDescription className="pt-1 text-slate-600 dark:text-slate-400">
              Track your symptoms, analyze wound images, and get AI-powered
              insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-1 rounded-lg bg-slate-200/80 p-1 dark:bg-slate-800/60 sm:grid-cols-4">
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="images">Image Labeling</TabsTrigger>
                <TabsTrigger value="log">Log Symptoms</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="check" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-1">
                  <Card className="rounded-xl border border-slate-200/80 bg-white/60 p-4 shadow-md backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/50">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Quick Assessment
                      </CardTitle>
                      <CardDescription>
                        How are you feeling right now?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {/* Pain Level Question with colored buttons */}
                        <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800/70">
                          <span className="flex items-center text-sm font-medium">
                            <TrendingUp className="mr-2 h-4 w-4 text-red-500" />
                            Pain level?
                          </span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <Button
                                key={level}
                                onClick={() => setPainLevel(level)}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-8 w-8 rounded-full p-0 text-white transition-all duration-200 hover:scale-110",
                                  painLevel === level
                                    ? `${painLevelColors[level].base} ${painLevelColors[level].hover} scale-110 shadow-lg`
                                    : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
                                )}
                              >
                                {level}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* New Symptoms Question (Interactive) */}
                        <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800/70">
                          <span className="flex items-center text-sm font-medium">
                            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                            New symptoms?
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setNewSymptoms(true)}
                              variant={
                                newSymptoms === true ? "default" : "outline"
                              }
                              size="sm"
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() => setNewSymptoms(false)}
                              variant={
                                newSymptoms === false ? "default" : "outline"
                              }
                              size="sm"
                            >
                              No
                            </Button>
                          </div>
                        </div>

                        {/* Medication Taken Question (Interactive) */}
                        <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800/70">
                          <span className="flex items-center text-sm font-medium">
                            <Pill className="mr-2 h-4 w-4 text-blue-500" />
                            Medication taken?
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setMedicationTaken(true)}
                              variant={
                                medicationTaken === true ? "default" : "outline"
                              }
                              size="sm"
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() => setMedicationTaken(false)}
                              variant={
                                medicationTaken === false
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={submitQuickAssessment}
                        disabled={isSubmitting}
                        className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Logging..." : "Log Today's Status"}
                      </Button>

                      {quickError && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {quickError}
                        </p>
                      )}

                      {quickResult && (
                        <div className="mt-4 rounded-md border border-slate-200 bg-white/70 p-4 text-sm leading-6 dark:border-slate-700 dark:bg-slate-900/40">
                          <div className="mb-2 font-semibold text-base">AI Summary & Next Steps</div>
                          <div className="whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200 text-base leading-relaxed" 
                               dangerouslySetInnerHTML={{ 
                                 __html: removeHashtags(quickResult)
                                   .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>')
                                   .replace(/\n/g, '<br>')
                               }} 
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Conditionally render AI Analysis Panel with animation */}
                  {analysisResults && (
                    <div className="animate-fade-in">
                      <AIAnalysisPanel results={analysisResults} />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6 space-y-6">
                <Card className="rounded-xl border border-slate-200/80 bg-white/60 p-4 shadow-md backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span>AI Health Analysis</span>
                      {healthAnalysis?.hasPatientData && (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Personalized
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {healthAnalysis?.hasPatientData 
                        ? `Get personalized health insights based on your medical history, ${healthAnalysis.patientName}`
                        : "Get AI-powered health insights and recommendations"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!healthAnalysis ? (
                      <form onSubmit={handleDetailedAnalysis} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="feeling">How are you feeling today?</Label>
                            <Select value={detailedFormData.feeling} onValueChange={(value) => handleDetailedInputChange('feeling', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select feeling" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Excellent">Excellent</SelectItem>
                                <SelectItem value="Good">Good</SelectItem>
                                <SelectItem value="Okay">Okay</SelectItem>
                                <SelectItem value="Bad">Bad</SelectItem>
                                <SelectItem value="Terrible">Terrible</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="painLevel">Pain Level (1-5)</Label>
                            <Select value={detailedFormData.painLevel} onValueChange={(value) => handleDetailedInputChange('painLevel', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pain level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Minimal</SelectItem>
                                <SelectItem value="2">2 - Mild</SelectItem>
                                <SelectItem value="3">3 - Moderate</SelectItem>
                                <SelectItem value="4">4 - Severe</SelectItem>
                                <SelectItem value="5">5 - Extreme</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="newSymptoms"
                              checked={detailedFormData.newSymptoms}
                              onCheckedChange={(checked) => handleDetailedInputChange('newSymptoms', checked as boolean)}
                            />
                            <Label htmlFor="newSymptoms">New symptoms today?</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="medicationTaken"
                              checked={detailedFormData.medicationTaken}
                              onCheckedChange={(checked) => handleDetailedInputChange('medicationTaken', checked as boolean)}
                            />
                            <Label htmlFor="medicationTaken">Medication taken?</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="symptomsText">Additional symptoms or notes</Label>
                          <Textarea
                            id="symptomsText"
                            placeholder="Describe any symptoms, concerns, or observations..."
                            value={detailedFormData.symptomsText}
                            onChange={(e) => handleDetailedInputChange('symptomsText', e.target.value)}
                            rows={3}
                          />
                        </div>

                        <Button type="submit" disabled={isLoadingAnalysis || !detailedFormData.feeling} className="w-full">
                          {isLoadingAnalysis ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Get AI Health Analysis
                            </>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
                          <div className="flex items-start space-x-3">
                            <Brain className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                {healthAnalysis.hasPatientData ? 'Personalized Health Analysis' : 'AI Health Insights'}
                              </h4>
                              <div className="prose prose-sm max-w-none text-blue-800 dark:text-blue-200">
                                <div className="whitespace-pre-wrap text-base leading-relaxed" 
                                     dangerouslySetInnerHTML={{ 
                                       __html: removeHashtags(healthAnalysis.result)
                                         .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-900 dark:text-blue-100">$1</strong>')
                                         .replace(/\n/g, '<br>')
                                     }} 
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setHealthAnalysis(null)}
                            className="flex-1"
                          >
                            New Analysis
                          </Button>
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(healthAnalysis.result)
                              alert('Analysis copied to clipboard!')
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            Copy Analysis
                          </Button>
                        </div>
                      </div>
                    )}

                    {user?.id && (
                      <div className="text-xs text-muted-foreground text-center">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        This analysis uses your medical history for personalized insights
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="mt-6">
                <ImageComparison onAnalysisComplete={handleImageAnalysis} />
              </TabsContent>

              <TabsContent value="log" className="mt-6">
                <SymptomLogger />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <SymptomHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
