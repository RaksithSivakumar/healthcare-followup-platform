import { NextResponse } from 'next/server';
import Groq from 'groq-sdk/index.mjs';
import { redactPhi, basicToxicityCheck, hallucinationGuardrails, combineFindings } from '@/lib/phi';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

type AssessmentInput = {
  feeling: string; // e.g., "Good", "Okay", "Bad"
  painLevel: number; // 1-5
  newSymptoms: boolean;
  medicationTaken: boolean;
  symptomsText?: string; // optional free text description
  userId?: string; // for personalized analysis
};

interface VisitData {
  visit_date: string;
  condition: string;
  disease: string;
  report?: string;
  vital?: {
    bp: string;
    hr: string;
    spo2: string;
  };
  symptoms?: string[];
  medications?: string[];
}

interface PatientData {
  name: string;
  visits: VisitData[];
  totalVisits: number;
}

const groqApiKey = process.env.GROQ_API_KEY as string;
const mongoUri = process.env.MONGO_URI as string;
const databaseName = process.env.MONGO_DB as string;

if (!groqApiKey) {
  throw new Error('Missing GROQ_API_KEY environment variable');
}

if (!mongoUri) {
  throw new Error('Missing MONGO_URI environment variable');
}

if (!databaseName) {
  throw new Error('Missing MONGO_DB environment variable');
}

let cachedClient: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  return client;
}

async function getPatientData(userId: string): Promise<PatientData | null> {
  try {
    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    const patient = await patientsCollection.findOne(
      { _id: new ObjectId(userId) },
      { 
        projection: { 
          pname: 1, 
          visits: 1,
          _id: 1
        } 
      }
    );

    if (!patient) {
      return null;
    }

    return {
      name: patient.pname,
      visits: patient.visits || [],
      totalVisits: patient.visits ? patient.visits.length : 0
    };
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AssessmentInput>;

    const feeling = (body.feeling ?? '').toString();
    const painLevel = Number(body.painLevel);
    const newSymptoms = Boolean(body.newSymptoms);
    const medicationTaken = Boolean(body.medicationTaken);
    const symptomsText = (body.symptomsText ?? '').toString();
    const userId = body.userId;

    if (!feeling || Number.isNaN(painLevel)) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: feeling, painLevel' },
        { status: 400 }
      );
    }

    // Get patient data if userId is provided
    let patientData: PatientData | null = null;
    if (userId) {
      patientData = await getPatientData(userId);
    }

    const groq = new Groq({ apiKey: groqApiKey });

    // Create personalized context based on patient data
    let patientContext = '';
    if (patientData && patientData.visits.length > 0) {
      const recentVisits = patientData.visits.slice(-3); // Get last 3 visits
      const conditions = [...new Set(recentVisits.map((v: VisitData) => v.condition))];
      const diseases = [...new Set(recentVisits.map((v: VisitData) => v.disease))];
      
      patientContext = `
Patient Context:
- Name: ${patientData.name}
- Total visits: ${patientData.totalVisits}
- Recent conditions: ${conditions.join(', ')}
- Recent diseases: ${diseases.join(', ')}
- Last visit: ${recentVisits[recentVisits.length - 1]?.visit_date || 'Unknown'}

Recent visit details:
${recentVisits.map((v: VisitData) => `- ${v.visit_date}: ${v.condition} (${v.disease}) - ${v.report || 'No report'}`).join('\n')}
      `.trim();
    }

    const userSummaryRaw = `
User quick assessment:
- Feeling: ${feeling}
- Pain level (1-5): ${painLevel}
- New symptoms: ${newSymptoms ? 'Yes' : 'No'}
- Medication taken: ${medicationTaken ? 'Yes' : 'No'}
- Additional symptoms/notes: ${symptomsText || 'None provided'}
    `.trim();

    // Safety: redact PHI and run simple content checks
    const { redacted: userSummary, findings: phiFindings } = redactPhi(userSummaryRaw)
    const safetyFindings = combineFindings(phiFindings, basicToxicityCheck(userSummary), hallucinationGuardrails(userSummary))

    const systemPrompt = `You are a caring and empathetic healthcare assistant 🏥 analyzing a patient's daily health log. Your role is to provide supportive, actionable guidance while maintaining a warm and encouraging tone.

${patientContext ? "🎯 You have access to the patient's medical history and recent visits. Use this context to provide more personalized and relevant advice." : "💡 Provide general health guidance based on the symptoms described."}

Create a comprehensive analysis with proper markdown formatting. Your response should be structured exactly as follows:

### 🏥 Today's Health Summary
[2-3 sentences analyzing the patient's current status, considering their symptoms and any patterns from their medical history. Be encouraging and supportive!]

### 🔍 Condition-Specific Insights
[${patientContext ? "Based on their medical history, provide insights related to their known conditions and diseases." : "Provide general insights about the reported symptoms."} Focus on what's improving and what needs attention.]

### 💊 Immediate Recommendations
* 💊 Medication reminders (if applicable)  
* 🧘 Self-care measures and comfort techniques  
* 🚶 Activity modifications and lifestyle adjustments  
* 👀 Monitoring suggestions and what to watch for  
* 🌟 Additional relevant recommendations for better health  

### ⚠️ When to Seek Help
Brief intro sentence about when to contact healthcare providers or seek immediate attention:
  - 🚨 Red-flag symptom 1  
  - 🚨 Red-flag symptom 2  
  - 🚨 Red-flag symptom 3  
  - 🚨 Additional warning signs if relevant  

### 📋 Follow-up Actions
In the next 24-48 hours, please track and report:
  - 📊 What the patient should monitor regarding their symptoms  
  - 💊 What the patient should track about their treatments/medications  
  - 🔍 Any specific changes or patterns to watch for  
  - 📞 Communication or reporting requirements  

[End with a supportive and encouraging closing message that emphasizes progress and hope] ✨

**CRITICAL FORMATTING RULES:**
- Always wrap your entire response in triple backticks (\`\`\`)
- Use ### headers for each section with relevant emojis
- Use * for main bullet points under Immediate Recommendations
- Use "  - " (two spaces + dash) for sub-items under When to Seek Help and Follow-up Actions
- Maintain consistent spacing and line breaks between sections
- Keep tone empathetic, actionable, supportive, and avoid making medical diagnoses
- Focus on supporting self-management and knowing when to escalate care
- Use encouraging language that empowers the patient to take positive health actions
- Always end on a positive note that reinforces hope and progress`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userSummary },
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = completion.choices?.[0]?.message?.content ?? '';

    return NextResponse.json({ 
      ok: true, 
      result: text,
      hasPatientData: !!patientData,
      patientName: patientData?.name || null,
      safety: safetyFindings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}


