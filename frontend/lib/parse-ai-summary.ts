// /lib/parse-ai-summary.ts

interface ParsedAIResults {
    overallChange: string;
    confidence: number;
    changes: Array<{ area: string; change: string; type: "positive" | "negative" | "neutral" }>;
    recommendations: string[];
    riskLevel: "low" | "medium" | "high";
  }
  
  export function parseAiSummary(markdownContent: string): ParsedAIResults | null {
    try {
      // Remove code block markers and extra whitespace
      const cleanContent = markdownContent.replace(/```[\s\S]*?```/g, '').trim();
      
      if (!cleanContent) {
        return null;
      }
  
      // Initialize result object
      const result: ParsedAIResults = {
        overallChange: '',
        confidence: 85, // Default confidence
        changes: [],
        recommendations: [],
        riskLevel: 'low'
      };
  
      // Split content into sections
      const sections = cleanContent.split(/###\s+/);
  
      sections.forEach(section => {
        const lines = section.trim().split('\n');
        const title = lines[0]?.toLowerCase().trim();
  
        if (title.includes('health summary') || title.includes("today's health")) {
          // Extract overall health summary
          const summaryText = lines.slice(1).join('\n').trim();
          result.overallChange = summaryText;
          
          // Determine risk level based on content
          const lowerContent = summaryText.toLowerCase();
          if (lowerContent.includes('severe') || lowerContent.includes('urgent') || lowerContent.includes('emergency')) {
            result.riskLevel = 'high';
          } else if (lowerContent.includes('moderate') || lowerContent.includes('concern') || lowerContent.includes('monitor')) {
            result.riskLevel = 'medium';
          } else {
            result.riskLevel = 'low';
          }
          
          // Extract confidence from pain level mentions or set based on content
          const painMatch = summaryText.match(/pain level of (\d+)/i);
          if (painMatch) {
            const painLevel = parseInt(painMatch[1]);
            // Higher pain = lower confidence in stability
            result.confidence = Math.max(60, 95 - (painLevel * 10));
          }
        }
  
        if (title.includes('condition-specific') || title.includes('insights')) {
          // Extract condition insights as changes
          const insightText = lines.slice(1).join('\n').trim();
          if (insightText) {
            const changeType = insightText.toLowerCase().includes('severe') || insightText.toLowerCase().includes('increase') ? 'negative' :
                             insightText.toLowerCase().includes('improv') || insightText.toLowerCase().includes('better') ? 'positive' : 'neutral';
            
            result.changes.push({
              area: 'Condition Assessment',
              change: insightText,
              type: changeType
            });
          }
        }
  
        if (title.includes('immediate recommendations') || title.includes('recommendations')) {
          // Extract recommendations
          const recText = lines.slice(1).join('\n');
          const recommendations = recText.split(/\*\s+/).filter(rec => rec.trim().length > 0);
          
          recommendations.forEach(rec => {
            const cleanRec = rec.trim().replace(/\n/g, ' ');
            if (cleanRec) {
              result.recommendations.push(cleanRec);
            }
          });
        }
  
        if (title.includes('when to seek help')) {
          // Extract warning signs as a change entry
          const helpText = lines.slice(1).join('\n').trim();
          if (helpText) {
            result.changes.push({
              area: 'Warning Signs',
              change: helpText,
              type: 'negative'
            });
          }
        }
  
        if (title.includes('follow-up actions')) {
          // Extract follow-up actions as recommendations
          const followUpText = lines.slice(1).join('\n');
          const actions = followUpText.split(/[-*]\s+/).filter(action => action.trim().length > 0);
          
          actions.forEach(action => {
            const cleanAction = action.trim().replace(/\n/g, ' ');
            if (cleanAction && !cleanAction.toLowerCase().includes('in the next')) {
              result.recommendations.push(`**Follow-up:** ${cleanAction}`);
            }
          });
        }
      });
  
      // If no changes were extracted, create a default one
      if (result.changes.length === 0) {
        result.changes.push({
          area: 'Overall Status',
          change: 'Current health status appears stable with manageable symptoms.',
          type: 'neutral'
        });
      }
  
      // If no recommendations were extracted, create defaults
      if (result.recommendations.length === 0) {
        result.recommendations.push(
          'Continue current medication regimen as prescribed',
          'Monitor symptoms and report any significant changes',
          'Maintain regular follow-up appointments with healthcare provider'
        );
      }
  
      return result;
  
    } catch (error) {
      console.error('Error parsing AI summary:', error);
      return null;
    }
  }