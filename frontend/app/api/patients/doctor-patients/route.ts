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

    // Validate session and get doctor info
    const session = await sessionsCollection.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
      userType: 'doctor'
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session. Only doctors can access patient data.' },
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

    const doctorId = doctorPatientDoc.doctor.did;

    // Find all patients assigned to this doctor
    const patients = await patientsCollection.find({
      "doctor.did": doctorId
    }).toArray();

    // Transform data to match the exact schema structure
    const transformedPatients = patients.map(patient => {
      const visitCount = patient.visits ? patient.visits.length : 0;
      const lastVisit = patient.visits && patient.visits.length > 0 
        ? patient.visits[patient.visits.length - 1] 
        : null;

      // Determine status based on last visit condition
      let status = "stable";
      if (lastVisit) {
        if (lastVisit.condition?.toLowerCase().includes("critical")) {
          status = "critical";
        } else if (lastVisit.condition?.toLowerCase().includes("attention") || 
                   lastVisit.condition?.toLowerCase().includes("observation")) {
          status = "attention";
        }
      }

      // Get latest vitals from last visit
      const latestVitals = lastVisit?.vital || { bp: "", hr: "", spo2: "" };

      // Get medications from last visit
      const medications = lastVisit?.medications?.map((med: any) => 
        `${med.medication} ${med.dosage}`
      ) || [];

      // Get symptoms from last visit
      const symptoms = lastVisit?.symptoms?.map((symptom: any) => 
        `${symptom.name} (Level ${symptom.pain_level})`
      ) || [];

      return {
        id: patient._id.toString(),
        pid: patient.pid,
        pname: patient.pname,
        pemail: patient.pemail,
        ppassword: patient.ppassword, // Note: This should be hidden in production
        doctor: {
          did: patient.doctor.did,
          dname: patient.doctor.dname,
          demail: patient.doctor.demail,
          dpassword: patient.doctor.dpassword // Note: This should be hidden in production
        },
        visits: patient.visits || [],
        symptomLogs: patient.symptomLogs || [],
        // Additional display fields for UI
        condition: lastVisit?.disease || "No condition specified",
        status: status,
        lastContact: lastVisit ? new Date(lastVisit.visit_date).toLocaleDateString() : "No visits",
        riskLevel: status === "critical" ? "high" : status === "attention" ? "medium" : "low",
        vitals: {
          heartRate: latestVitals.hr || 0,
          bloodPressure: latestVitals.bp || "N/A",
          spo2: latestVitals.spo2 || 0
        },
        medications: medications,
        symptoms: symptoms,
        notes: lastVisit?.report || "No notes available",
        visitCount: visitCount,
        lastVisitDate: lastVisit?.visit_date || null
      };
    });

    return NextResponse.json({
      success: true,
      patients: transformedPatients,
      totalCount: transformedPatients.length
    });

  } catch (error: any) {
    console.error('Get doctor patients error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
