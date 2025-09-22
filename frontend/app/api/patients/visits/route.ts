import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

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

// Get all visits for a patient
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    const patient = await patientsCollection.findOne(
      { pid: patientId },
      { projection: { visits: 1, pname: 1 } }
    );

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      patientName: patient.pname,
      visits: patient.visits || []
    });

  } catch (error: any) {
    console.error('Get visits error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a new visit for a patient
export async function POST(request: NextRequest) {
  try {
    const { patientId, visitData } = await request.json();

    if (!patientId || !visitData) {
      return NextResponse.json(
        { success: false, error: 'Patient ID and visit data are required' },
        { status: 400 }
      );
    }

    // Validate required visit fields
    const requiredFields = ['visit_date', 'condition', 'disease'];
    for (const field of requiredFields) {
      if (!visitData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    // Add the new visit to the patient's visits array
    const result = await patientsCollection.updateOne(
      { pid: patientId },
      { 
        $push: { 
          visits: {
            ...visitData,
            visit_date: visitData.visit_date,
            vital: visitData.vital || { bp: "", hr: "", spo2: "" },
            symptoms: visitData.symptoms || [],
            medications: visitData.medications || [],
            report: visitData.report || ""
          }
        } 
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
      message: 'Visit added successfully'
    });

  } catch (error: any) {
    console.error('Add visit error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
