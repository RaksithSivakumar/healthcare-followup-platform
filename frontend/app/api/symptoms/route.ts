import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGO_URI as string;
const databaseName = process.env.MONGO_DB as string;

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

interface SymptomLog {
  symptomName: string;
  intensity: number;
}

interface SymptomData {
  symptoms: SymptomLog[];
  notes: string;
  timestamp: string;
  returnVisit: boolean;
  visitDate?: string;
}

// GET: Retrieve existing symptom data for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session token found' },
        { status: 401 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const sessionsCollection = db.collection('sessions');
    const patientsCollection = db.collection('patients');

    // Find and validate session
    const session = await sessionsCollection.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get patient document with symptom logs
    const patientDoc = await patientsCollection.findOne(
      { _id: session.userId },
      { 
        projection: { 
          pname: 1, 
          symptomLogs: 1,
          visits: 1,
          _id: 1
        } 
      }
    );

    if (!patientDoc) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get today's symptom log if it exists
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const todayLog = patientDoc.symptomLogs?.find((log: any) => 
      log.timestamp.startsWith(today)
    );

    // Get the most recent visit data
    const latestVisit = patientDoc.visits && patientDoc.visits.length > 0 
      ? patientDoc.visits[patientDoc.visits.length - 1] 
      : null;

    return NextResponse.json({
      success: true,
      patientName: patientDoc.pname,
      todayLog: todayLog || null,
      latestVisit: latestVisit ? {
        date: latestVisit.visit_date,
        condition: latestVisit.condition,
        disease: latestVisit.disease,
        report: latestVisit.report
      } : null,
      hasExistingData: !!todayLog
    });

  } catch (error: any) {
    console.error('Get symptom data error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create new symptom log entry (duplicate entry)
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session token found' },
        { status: 401 }
      );
    }

    const { symptoms, notes, returnVisit, visitDate } = await request.json();

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { success: false, error: 'Symptoms data is required' },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const sessionsCollection = db.collection('sessions');
    const patientsCollection = db.collection('patients');

    // Find and validate session
    const session = await sessionsCollection.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Create new symptom log entry
    const newSymptomLog = {
      symptoms,
      notes: notes || '',
      timestamp: new Date().toISOString(),
      returnVisit: returnVisit || false,
      visitDate: visitDate || null
    };

    // Add the new symptom log to the patient's symptomLogs array
    const result = await patientsCollection.updateOne(
      { _id: session.userId },
      { 
        $push: { 
          symptomLogs: newSymptomLog
        } as any
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Symptom log created successfully',
      logId: newSymptomLog.timestamp
    });

  } catch (error: any) {
    console.error('Create symptom log error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
