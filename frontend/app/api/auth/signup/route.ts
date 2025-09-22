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
    const { name, email, password, role, customId, consentGiven, consentPurpose } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { success: false, error: 'Consent is required to create an account' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['patient', 'doctor'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be "patient" or "doctor"' },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    // Generate ID based on role and custom input
    const prefix = role === "patient" ? "P" : "D";
    const idNumber = customId?.trim() || Math.floor(Math.random() * 900) + 100; // 100-999
    const finalId = `${prefix}${idNumber.toString().padStart(3, '0')}`; // P001, D001, etc.

    let result;
    let user;

    if (role === "patient") {
      // Check if patient ID already exists
      const existingPatient = await patientsCollection.findOne({ pid: finalId });
      if (existingPatient) {
        return NextResponse.json(
          { success: false, error: 'Patient ID already exists. Please try a different number.' },
          { status: 409 }
        );
      }

      // Create new patient document
      const newPatient = {
        pid: finalId,
        pname: name,
        pemail: email.toLowerCase(),
        ppassword: password, // In production, hash this password
        doctor: null, // Will be assigned when doctor signs up
        visits: [],
        consent: {
          given: true,
          purpose: consentPurpose || 'care',
          timestamp: new Date(),
        },
      };

      result = await patientsCollection.insertOne(newPatient);
      user = {
        id: result.insertedId,
        pid: finalId,
        name: name,
        email: email.toLowerCase(),
        role: "patient",
        avatar: "/patient-avatar.png"
      };
    } else {
      // For doctors, we need to find an existing patient or create a new one
      // Check if doctor ID already exists in any patient's doctor field
      const existingDoctor = await patientsCollection.findOne({
        "doctor.did": finalId
      });
      
      if (existingDoctor) {
        return NextResponse.json(
          { success: false, error: 'Doctor ID already exists. Please try a different number.' },
          { status: 409 }
        );
      }

      // Find a patient without a doctor assigned
      const patientWithoutDoctor = await patientsCollection.findOne({
        doctor: null
      });

      if (patientWithoutDoctor) {
        // Update existing patient with doctor info
        const updateResult = await patientsCollection.updateOne(
          { _id: patientWithoutDoctor._id },
          {
            $set: {
              doctor: {
                did: finalId,
                dname: name,
                demail: email.toLowerCase(),
                dpassword: password, // In production, hash this password
              specialization: "General Medicine",
              consent: {
                given: true,
                purpose: consentPurpose || 'care',
                timestamp: new Date(),
              },
              }
            }
          }
        );

        if (updateResult.modifiedCount > 0) {
          user = {
            id: patientWithoutDoctor._id,
            did: finalId,
            name: name,
            email: email.toLowerCase(),
            role: "doctor",
            avatar: "/doctor-avatar.png",
            specialization: "General Medicine"
          };
        }
      } else {
        // Create new patient document with doctor
        const newPatientWithDoctor = {
          pid: `P${Math.floor(Math.random() * 900) + 100}`.padStart(4, '0'),
          pname: "Unassigned Patient",
          pemail: "unassigned@example.com",
          ppassword: "temp123",
          doctor: {
            did: finalId,
            dname: name,
            demail: email.toLowerCase(),
            dpassword: password, // In production, hash this password
            specialization: "General Medicine"
          },
          visits: [],
          consent: {
            given: true,
            purpose: consentPurpose || 'care',
            timestamp: new Date(),
          },
        };

        result = await patientsCollection.insertOne(newPatientWithDoctor);
        user = {
          id: result.insertedId,
          did: finalId,
          name: name,
          email: email.toLowerCase(),
          role: "doctor",
          avatar: "/doctor-avatar.png",
          specialization: "General Medicine"
        };
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store session in database
    const sessionsCollection = db.collection('sessions');
    await sessionsCollection.insertOne({
      token: sessionToken,
      userId: user.id,
      userType: role,
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
