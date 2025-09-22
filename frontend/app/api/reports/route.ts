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

// GET: Retrieve complete medical data for the logged-in user
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

    // Get patient document with complete medical data
    const patientDoc = await patientsCollection.findOne(
      { _id: session.userId },
      { 
        projection: { 
          pname: 1, 
          pemail: 1,
          doctor: 1,
          visits: 1,
          symptomLogs: 1,
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

    // Transform the data to match the required structure
    const transformedData = {
      patientInfo: {
        id: patientDoc._id,
        name: patientDoc.pname,
        email: patientDoc.pemail
      },
      doctor: patientDoc.doctor ? {
        did: patientDoc.doctor.did || '',
        dname: patientDoc.doctor.dname || '',
        demail: patientDoc.doctor.demail || '',
        specialization: patientDoc.doctor.specialization || ''
      } : null,
      visits: patientDoc.visits ? patientDoc.visits.map((visit: any) => ({
        visit_date: visit.visit_date || '',
        condition: visit.condition || '',
        disease: visit.disease || '',
        vital: visit.vital ? {
          bp: visit.vital.bp || '',
          hr: visit.vital.hr || '',
          spo2: visit.vital.spo2 || ''
        } : {
          bp: '',
          hr: '',
          spo2: ''
        },
        symptoms: visit.symptoms ? visit.symptoms.map((symptom: any) => ({
          name: symptom.name || '',
          pain_level: symptom.pain_level || '',
          notes: symptom.notes || ''
        })) : [],
        medications: visit.medications ? visit.medications.map((med: any) => ({
          medication: med.medication || '',
          dosage: med.dosage || '',
          duration: med.duration || '',
          route: med.route || '',
          notes: med.notes || ''
        })) : [],
        report: visit.report || ''
      })) : [],
      symptomLogs: patientDoc.symptomLogs || [],
      summary: {
        totalVisits: patientDoc.visits ? patientDoc.visits.length : 0,
        totalSymptoms: patientDoc.symptomLogs ? patientDoc.symptomLogs.length : 0,
        lastVisit: patientDoc.visits && patientDoc.visits.length > 0 
          ? patientDoc.visits[patientDoc.visits.length - 1].visit_date 
          : null,
        hasDoctor: !!patientDoc.doctor
      }
    };

    return NextResponse.json({
      success: true,
      data: transformedData
    });

  } catch (error: any) {
    console.error('Get reports data error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
