import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { parseAiSummary } from "../../lib/parse-ai-summary"; // Import the parser

// Interface for the structured data
interface AIAnalysisPanelProps {
  results: {
    overallChange: string;
    confidence: number;
    changes: Array<{
      area: string;
      change: string;
      type: "positive" | "negative" | "neutral";
    }>;
    recommendations: string[];
    riskLevel: "low" | "medium" | "high";
  };
}

// Your original AIAnalysisPanel component (no changes needed)
export function AIAnalysisPanel({ results }: AIAnalysisPanelProps) {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return CheckCircle;
      case "medium": return Info;
      case "high": return AlertTriangle;
      default: return Info;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "positive": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-blue-600" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive": return "bg-green-50 border-green-200";
      case "negative": return "bg-red-50 border-red-200";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  const RiskIcon = getRiskIcon(results.riskLevel);
  const riskColorClass = getRiskColor(results.riskLevel);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 overflow-hidden animate-fade-in-up relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full translate-y-12 -translate-x-12"></div>
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <span>AI Analysis Insights</span>
          </CardTitle>
          <Badge variant="outline" className={`flex items-center space-x-1 border ${riskColorClass} py-1`}>
            <RiskIcon className="h-3 w-3" />
            <span className="font-medium capitalize">{results.riskLevel} Risk</span>
          </Badge>
        </div>
        <CardDescription className="text-slate-600">
          AI-powered assessment with {results.confidence}% confidence
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
            <Info className="h-4 w-4 text-blue-600 mr-2" />
            Overall Assessment
          </h3>
          <MarkdownRenderer content={results.overallChange} className="text-sm text-slate-700" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 text-blue-600 mr-2" />
            Key Changes Detected
          </h3>
          <div className="space-y-3">
            {results.changes.map((change, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getChangeColor(change.type)} flex items-start space-x-3 transition-all hover:shadow-sm`}>
                <div className="flex-shrink-0 mt-0.5">{getChangeIcon(change.type)}</div>
                <div>
                  <h4 className="font-medium text-sm text-slate-800">{change.area}</h4>
                  <MarkdownRenderer content={change.change} className="text-sm text-slate-600 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
            Recommendations
          </h3>
          <div className="space-y-2">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <MarkdownRenderer content={rec} className="text-sm text-slate-700" />
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Analysis Confidence</span>
            <span className="text-sm font-semibold text-blue-600">{results.confidence}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${results.confidence}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Based on comparison with medical data and pattern recognition</p>
        </div>
      </CardContent>
    </Card>
  )
}


// --- The Wrapper Component ---
interface AIAnalysisContainerProps {
  markdownContent: string; // This component takes the raw string
}

export function AIAnalysisContainer({ markdownContent }: AIAnalysisContainerProps) {
  // Use the parser to convert the string to structured data
  const parsedResults = parseAiSummary(markdownContent);

  // If parsing fails or content is empty, show a fallback message
  if (!parsedResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The AI-generated summary could not be displayed at this time.</p>
        </CardContent>
      </Card>
    );
  }

  // If parsing is successful, render the main panel with the parsed data
  return <AIAnalysisPanel results={parsedResults} />;
}