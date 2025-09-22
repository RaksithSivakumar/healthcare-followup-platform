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
      expiresAt: { $gt: new Date() } // Check if session hasn't expired
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get patient document
    const patientDoc = await patientsCollection.findOne({ _id: session.userId });
    if (!patientDoc) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    let user;

    if (session.userType === 'patient') {
      user = {
        id: patientDoc._id,
        pid: patientDoc.pid,
        name: patientDoc.pname,
        email: patientDoc.pemail,
        role: "patient",
        avatar: "/patient-avatar.png"
      };
    } else if (session.userType === 'doctor' && patientDoc.doctor) {
      user = {
        id: patientDoc._id,
        did: patientDoc.doctor.did,
        name: patientDoc.doctor.dname,
        email: patientDoc.doctor.demail,
        role: "doctor",
        avatar: "/doctor-avatar.png",
        specialization: patientDoc.doctor.specialization || "General Medicine"
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'User data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error: any) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
