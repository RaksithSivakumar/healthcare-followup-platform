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
    // Get session token from cookie
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(databaseName);
    const sessionsCollection = db.collection('sessions');
    const patientsCollection = db.collection('patients');

    // Validate session and get doctor info
    const session = await sessionsCollection.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
      userType: 'doctor'
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session. Only doctors can add patients.' },
        { status: 401 }
      );
    }

    // Get doctor's patient document to extract doctor info
    const doctorPatientDoc = await patientsCollection.findOne({ _id: session.userId });
    if (!doctorPatientDoc || !doctorPatientDoc.doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor information not found' },
        { status: 404 }
      );
    }

    const { patientData } = await request.json();

    // Validate required fields
    if (!patientData.pname || !patientData.pemail || !patientData.ppassword) {
      return NextResponse.json(
        { success: false, error: 'Patient name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!patientData.visits || !Array.isArray(patientData.visits) || patientData.visits.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one visit is required' },
        { status: 400 }
      );
    }

    // Validate visit data
    const visit = patientData.visits[0];
    if (!visit.visit_date || !visit.condition || !visit.disease) {
      return NextResponse.json(
        { success: false, error: 'Visit date, condition, and disease are required' },
        { status: 400 }
      );
    }

    // Generate unique PID
    const generatePID = () => {
      const timestamp = Date.now().toString().slice(-6);
      return `P${timestamp}`;
    };

    let pid = generatePID();
    let attempts = 0;
    
    // Ensure PID is unique
    while (attempts < 10) {
      const existingPatient = await patientsCollection.findOne({ pid });
      if (!existingPatient) break;
      pid = generatePID();
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Unable to generate unique patient ID. Please try again.' },
        { status: 500 }
      );
    }

    // Check if email already exists
    const existingEmail = await patientsCollection.findOne({ pemail: patientData.pemail.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Patient with this email already exists' },
        { status: 409 }
      );
    }

    // Create new patient document
    const newPatient = {
      pid: pid,
      pname: patientData.pname,
      pemail: patientData.pemail.toLowerCase(),
      ppassword: patientData.ppassword, // In production, hash this password
      doctor: {
        did: doctorPatientDoc.doctor.did,
        dname: doctorPatientDoc.doctor.dname,
        demail: doctorPatientDoc.doctor.demail,
        dpassword: doctorPatientDoc.doctor.dpassword,
        specialization: doctorPatientDoc.doctor.specialization || "General Medicine"
      },
      visits: patientData.visits.map((visit: any) => ({
        visit_date: visit.visit_date,
        condition: visit.condition,
        disease: visit.disease,
        vital: {
          bp: visit.vital?.bp || "",
          hr: visit.vital?.hr || 0,
          spo2: visit.vital?.spo2 || 0,
          temperature: visit.vital?.temperature || null,
          weight: visit.vital?.weight || null,
          height: visit.vital?.height || null,
          ...visit.vital // Include any additional custom vitals
        },
        symptoms: visit.symptoms?.map((symptom: any) => ({
          name: symptom.name || "",
          pain_level: symptom.pain_level || 1,
          notes: symptom.notes || ""
        })) || [],
        medications: visit.medications?.map((medication: any) => ({
          medication: medication.medication || "",
          dosage: medication.dosage || "",
          duration: medication.duration || "",
          route: medication.route || "Oral",
          notes: medication.notes || ""
        })) || [],
        report: visit.report || ""
      }))
    };

    // Insert new patient
    const result = await patientsCollection.insertOne(newPatient);

    if (!result.insertedId) {
      return NextResponse.json(
        { success: false, error: 'Failed to create patient' },
        { status: 500 }
      );
    }

    // Return success response without sensitive data
    const { ppassword, ...patientWithoutPassword } = newPatient;
    const { dpassword, ...doctorWithoutPassword } = patientWithoutPassword.doctor;
    patientWithoutPassword.doctor = doctorWithoutPassword as any;

    return NextResponse.json({
      success: true,
      message: 'Patient added successfully',
      patient: {
        ...patientWithoutPassword,
        _id: result.insertedId
      }
    });

  } catch (error: any) {
    console.error('Add patient error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
