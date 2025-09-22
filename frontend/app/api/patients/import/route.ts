import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ServerApiVersion } from 'mongodb'

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

function toStringIfNumber(n: any): string | undefined {
  if (n == null) return undefined
  if (typeof n === 'string') return n
  if (typeof n === 'number') return String(n)
  if (typeof n === 'object' && ('$numberInt' in n || '$numberDouble' in n)) {
    return String((n as any)['$numberInt'] ?? (n as any)['$numberDouble'])
  }
  return undefined
}

// Upsert a patient by pid. Only for authenticated doctors.
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const client = await getMongoClient()
    const db = client.db(databaseName)
    const sessionsCollection = db.collection('sessions')
    const patientsCollection = db.collection('patients')

    const session = await sessionsCollection.findOne({ token: sessionToken, expiresAt: { $gt: new Date() }, userType: 'doctor' })
    if (!session) {
      return NextResponse.json({ success: false, error: 'Only doctors can import patients' }, { status: 403 })
    }

    const body = await request.json()
    const raw = body?.patient ?? body
    if (!raw || !raw.pid || !raw.pname || !raw.pemail) {
      return NextResponse.json({ success: false, error: 'Missing required fields: pid, pname, pemail' }, { status: 400 })
    }

    const visits = Array.isArray(raw.visits)
      ? raw.visits.map((v: any) => ({
          visit_date: v.visit_date,
          condition: v.condition,
          disease: v.disease,
          vital: {
            bp: v?.vital?.bp ?? '',
            hr: toStringIfNumber(v?.vital?.hr) ?? '',
            spo2: toStringIfNumber(v?.vital?.spo2) ?? '',
          },
          symptoms: Array.isArray(v?.symptoms)
            ? v.symptoms.map((s: any) => ({
                name: s.name ?? s.symptomName ?? '',
                pain_level: toStringIfNumber(s.pain_level ?? s.intensity) ?? '0',
                notes: s.notes ?? '',
              }))
            : [],
          medications: Array.isArray(v?.medications)
            ? v.medications.map((m: any) => ({
                medication: m.medication ?? m.name ?? '',
                dosage: m.dosage ?? m.dose ?? '',
                duration: m.duration ?? '',
                route: m.route ?? '',
                notes: m.notes ?? '',
              }))
            : [],
          report: typeof v.report === 'string' ? v.report : v.report ? String(v.report) : '',
        }))
      : []

    const doc = {
      pid: String(raw.pid),
      pname: String(raw.pname),
      pemail: String(raw.pemail).toLowerCase(),
      ppassword: raw.ppassword ?? 'temp123',
      doctor: raw.doctor
        ? {
            did: raw.doctor.did,
            dname: raw.doctor.dname,
            demail: raw.doctor.demail?.toLowerCase?.() ?? raw.doctor.demail,
            dpassword: raw.doctor.dpassword ?? 'temp123',
            specialization: raw.doctor.specialization ?? 'General Medicine',
          }
        : null,
      visits,
      symptomLogs: Array.isArray(raw.symptomLogs) ? raw.symptomLogs : [],
    }

    await patientsCollection.updateOne(
      { pid: doc.pid },
      { $set: doc },
      { upsert: true }
    )

    return NextResponse.json({ success: true, patient: { pid: doc.pid, pname: doc.pname } })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


