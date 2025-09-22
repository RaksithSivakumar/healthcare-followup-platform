import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const mongoUri = process.env.MONGO_URI as string
const databaseName = process.env.MONGO_DB as string

let cachedClient: MongoClient | null = null

async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient
  const client = new MongoClient(mongoUri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  })
  await client.connect()
  cachedClient = client
  return client
}

// Export authenticated user's data as a minimal FHIR Bundle (JSON)
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const client = await getMongoClient()
    const db = client.db(databaseName)
    const sessionsCollection = db.collection('sessions')
    const patientsCollection = db.collection('patients')

    const session = await sessionsCollection.findOne({ token: sessionToken, expiresAt: { $gt: new Date() } })
    if (!session) {
      return NextResponse.json({ success: false, error: 'Invalid or expired session' }, { status: 401 })
    }

    const patientDoc = await patientsCollection.findOne({ _id: new ObjectId(session.userId) })
    if (!patientDoc) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 })
    }

    // Minimal FHIR-like bundle
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: patientDoc.pid,
            name: [{ text: patientDoc.pname }],
            telecom: [{ system: 'email', value: patientDoc.pemail }],
          },
        },
        ...(Array.isArray(patientDoc.visits)
          ? patientDoc.visits.map((v: any, idx: number) => ({
              resource: {
                resourceType: 'Encounter',
                id: `${patientDoc.pid}-enc-${idx + 1}`,
                period: { start: v.visit_date },
                reasonCode: [{ text: v.condition }],
                diagnosis: [{ condition: { text: v.disease } }],
                note: v.report ? [{ text: v.report }] : [],
              },
            }))
          : []),
      ],
    }

    return NextResponse.json({ success: true, bundle })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


