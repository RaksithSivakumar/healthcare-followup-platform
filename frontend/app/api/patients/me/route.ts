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

    // Validate session and get patient info
    const session = await sessionsCollection.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
      userType: 'patient'
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session. Only patients can access their data.' },
        { status: 401 }
      );
    }

    // Get patient document
    const patientDoc = await patientsCollection.findOne({ _id: session.userId });
    if (!patientDoc) {
      return NextResponse.json(
        { success: false, error: 'Patient information not found' },
        { status: 404 }
      );
    }

    // Transform patient data for frontend
    const transformPatientData = (patient: any) => {
      const latestVisit = patient.visits && patient.visits.length > 0 
        ? patient.visits[patient.visits.length - 1] 
        : null;

      const latestVitals = latestVisit?.vital || { bp: "0/0", hr: "0", spo2: "0" };
      
      // Calculate additional display fields
      const condition = latestVisit?.condition || "No visits recorded";
      const status = latestVisit?.condition?.toLowerCase().includes('stable') ? "stable" : 
                    latestVisit?.condition?.toLowerCase().includes('critical') ? "critical" : "attention";
      const lastContact = latestVisit?.visit_date || "No visits";
      const riskLevel = latestVisit?.condition?.toLowerCase().includes('critical') ? "high" : 
                       latestVisit?.condition?.toLowerCase().includes('stable') ? "low" : "medium";
      
      const vitals = {
        heartRate: parseInt(latestVitals.hr) || 0,
        bloodPressure: latestVitals.bp || "0/0",
        spo2: parseInt(latestVitals.spo2) || 0
      };

      const medications = latestVisit?.medications?.map((med: any) => med.medication) || [];
      const symptoms = latestVisit?.symptoms?.map((symp: any) => symp.name) || [];
      const notes = latestVisit?.report || "";
      const visitCount = patient.visits?.length || 0;
      const lastVisitDate = latestVisit?.visit_date || null;

      return {
        id: patient._id.toString(),
        pid: patient.pid,
        pname: patient.pname,
        pemail: patient.pemail,
        ppassword: patient.ppassword,
        doctor: patient.doctor,
        visits: patient.visits || [],
        symptomLogs: patient.symptomLogs || [],
        // Additional display fields
        condition,
        status,
        lastContact,
        riskLevel,
        vitals,
        medications,
        symptoms,
        notes,
        visitCount,
        lastVisitDate
      };
    };

    const transformedPatient = transformPatientData(patientDoc);

    // Remove sensitive data before sending response
    const { ppassword, ...patientWithoutPassword } = transformedPatient;
    const { dpassword, ...doctorWithoutPassword } = patientWithoutPassword.doctor;
    patientWithoutPassword.doctor = doctorWithoutPassword as any;

    return NextResponse.json({
      success: true,
      patient: patientWithoutPassword
    });

  } catch (error: any) {
    console.error('Get patient data error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
