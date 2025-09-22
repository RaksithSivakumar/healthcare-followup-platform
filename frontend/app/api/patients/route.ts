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

// Get all patients (for doctors)
export async function GET(request: NextRequest) {
  try {
    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    const patients = await patientsCollection.find(
      {},
      { 
        projection: { 
          pid: 1, 
          pname: 1, 
          pemail: 1, 
          doctor: 1, 
          visits: 1 
        } 
      }
    ).toArray();

    // Transform data to include visit count and last visit
    const transformedPatients = patients.map(patient => {
      const visitCount = patient.visits ? patient.visits.length : 0;
      const lastVisit = patient.visits && patient.visits.length > 0 
        ? patient.visits[patient.visits.length - 1].visit_date 
        : null;

      return {
        pid: patient.pid,
        pname: patient.pname,
        pemail: patient.pemail,
        doctor: patient.doctor ? {
          did: patient.doctor.did,
          dname: patient.doctor.dname,
          specialization: patient.doctor.specialization
        } : null,
        visitCount,
        lastVisit,
        hasDoctor: !!patient.doctor
      };
    });

    return NextResponse.json({
      success: true,
      patients: transformedPatients
    });

  } catch (error: any) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get a specific patient by ID
export async function POST(request: NextRequest) {
  try {
    const { patientId } = await request.json();

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    const patient = await patientsCollection.findOne({ pid: patientId });

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Remove password fields for security
    const { ppassword, ...patientWithoutPassword } = patient;
    if (patient.doctor) {
      const { dpassword, ...doctorWithoutPassword } = patient.doctor;
      patientWithoutPassword.doctor = doctorWithoutPassword;
    }

    return NextResponse.json({
      success: true,
      patient: patientWithoutPassword
    });

  } catch (error: any) {
    console.error('Get patient error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
