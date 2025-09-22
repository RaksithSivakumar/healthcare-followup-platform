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

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json(
        { success: false, error: 'ID and password are required' },
        { status: 400 }
      );
    }

    // Auto-detect role from ID prefix
    const role = id.toUpperCase().startsWith('P') ? "patient" : 
                 id.toUpperCase().startsWith('D') ? "doctor" : 
                 "patient"; // default fallback

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    let user = null;
    let userType = '';

    if (role === "patient") {
      // Find patient by PID
      const patient = await patientsCollection.findOne({ pid: id.toUpperCase() });
      if (patient && patient.ppassword === password) {
        user = {
          id: patient._id,
          pid: patient.pid,
          name: patient.pname,
          email: patient.pemail,
          role: "patient",
          avatar: "/patient-avatar.png"
        };
        userType = 'patient';
      }
    } else {
      // Find doctor by DID within any patient's doctor field
      const patientWithDoctor = await patientsCollection.findOne({
        "doctor.did": id.toUpperCase()
      });
      
      if (patientWithDoctor && patientWithDoctor.doctor.dpassword === password) {
        user = {
          id: patientWithDoctor._id,
          did: patientWithDoctor.doctor.did,
          name: patientWithDoctor.doctor.dname,
          email: patientWithDoctor.doctor.demail,
          role: "doctor",
          avatar: "/doctor-avatar.png",
          specialization: patientWithDoctor.doctor.specialization || "General Medicine"
        };
        userType = 'doctor';
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store session in database
    const sessionsCollection = db.collection('sessions');
    await sessionsCollection.insertOne({
      token: sessionToken,
      userId: user.id,
      userType: userType,
      role: user.role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    const response = NextResponse.json({
      success: true,
      user: user,
      sessionToken
    });

    // Set HTTP-only cookie
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
