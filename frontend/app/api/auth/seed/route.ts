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
    const client = await getMongoClient();
    const db = client.db(databaseName);
    const patientsCollection = db.collection('patients');

    // Check if patients already exist
    const existingPatients = await patientsCollection.countDocuments();
    if (existingPatients > 0) {
      return NextResponse.json({
        success: false,
        error: 'Database already seeded with patients'
      });
    }

    // Seed data according to the new schema
    const seedPatients = [
      {
        pid: "P001",
        pname: "John Doe",
        pemail: "john.doe@example.com",
        ppassword: "password123", // In production, hash this
        doctor: {
          did: "D001",
          dname: "Dr. Sarah Wilson",
          demail: "dr.wilson@hospital.com",
          dpassword: "password123", // In production, hash this
          specialization: "Cardiology"
        },
        visits: [
          {
            visit_date: "2024-01-15",
            condition: "Stable",
            disease: "Hypertension",
            vital: {
              bp: "140/90",
              hr: "72",
              spo2: "98"
            },
            symptoms: [
              {
                name: "Headache",
                pain_level: "3",
                notes: "Mild headache in the morning"
              },
              {
                name: "Dizziness",
                pain_level: "2",
                notes: "Occasional dizziness"
              }
            ],
            medications: [
              {
                medication: "Amlodipine",
                dosage: "5mg",
                duration: "30 days",
                route: "Oral",
                notes: "Take once daily in the morning"
              }
            ],
            report: "Patient shows improvement in blood pressure control. Continue current medication regimen."
          },
          {
            visit_date: "2024-02-01",
            condition: "Improving",
            disease: "Hypertension",
            vital: {
              bp: "130/85",
              hr: "68",
              spo2: "99"
            },
            symptoms: [
              {
                name: "Headache",
                pain_level: "1",
                notes: "Significantly reduced"
              }
            ],
            medications: [
              {
                medication: "Amlodipine",
                dosage: "5mg",
                duration: "30 days",
                route: "Oral",
                notes: "Continue current dosage"
              }
            ],
            report: "Excellent progress. Blood pressure is now well-controlled. Schedule follow-up in 3 months."
          }
        ]
      },
      {
        pid: "P002",
        pname: "Jane Smith",
        pemail: "jane.smith@example.com",
        ppassword: "password123", // In production, hash this
        doctor: {
          did: "D002",
          dname: "Dr. Michael Brown",
          demail: "dr.brown@hospital.com",
          dpassword: "password123", // In production, hash this
          specialization: "Neurology"
        },
        visits: [
          {
            visit_date: "2024-01-20",
            condition: "Under Observation",
            disease: "Migraine",
            vital: {
              bp: "120/80",
              hr: "75",
              spo2: "97"
            },
            symptoms: [
              {
                name: "Severe Headache",
                pain_level: "8",
                notes: "Intense pain on left side of head"
              },
              {
                name: "Nausea",
                pain_level: "6",
                notes: "Accompanied by vomiting"
              }
            ],
            medications: [
              {
                medication: "Sumatriptan",
                dosage: "50mg",
                duration: "As needed",
                route: "Oral",
                notes: "Take at onset of migraine"
              },
              {
                medication: "Propranolol",
                dosage: "40mg",
                duration: "30 days",
                route: "Oral",
                notes: "Take twice daily for prevention"
              }
            ],
            report: "Patient experiencing frequent migraines. Started preventive medication. Monitor frequency and intensity."
          }
        ]
      },
      {
        pid: "P003",
        pname: "Robert Johnson",
        pemail: "robert.johnson@example.com",
        ppassword: "password123", // In production, hash this
        doctor: null, // No doctor assigned yet
        visits: []
      }
    ];

    // Insert seed patients
    const result = await patientsCollection.insertMany(seedPatients);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} patients`,
      patients: seedPatients.map(patient => ({
        pid: patient.pid,
        pname: patient.pname,
        pemail: patient.pemail,
        doctor: patient.doctor ? {
          did: patient.doctor.did,
          dname: patient.doctor.dname,
          demail: patient.doctor.demail,
          specialization: patient.doctor.specialization
        } : null,
        visitCount: patient.visits.length
      }))
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
