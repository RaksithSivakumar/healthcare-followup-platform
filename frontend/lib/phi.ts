// Simple PHI redaction and safety checks for prompts/results

const NAME_REGEX = /\b([A-Z][a-z]+\s[A-Z][a-z]+)\b/g
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const PHONE_REGEX = /\b(?:\+\d{1,3}[- ]?)?(?:\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{4}\b/g
const LOCATION_REGEX = /\b(Street|St\.|Road|Rd\.|Avenue|Ave\.|Lane|Ln\.|Hospital|Clinic)\b/gi
const ID_REGEX = /\b(?:SSN|Aadhar|Passport|PID|DID)[:\s]*[A-Z0-9-]{3,}\b/gi

export type SafetyFinding = {
  type: 'phi' | 'toxicity' | 'hallucination'
  detail: string
}

export function redactPhi(input: string): { redacted: string; findings: SafetyFinding[] } {
  let redacted = input
  const findings: SafetyFinding[] = []

  const apply = (regex: RegExp, label: string) => {
    if (regex.test(redacted)) {
      redacted = redacted.replace(regex, `[REDACTED_${label}]`)
      findings.push({ type: 'phi', detail: label })
    }
  }

  apply(EMAIL_REGEX, 'EMAIL')
  apply(PHONE_REGEX, 'PHONE')
  apply(ID_REGEX, 'ID')
  apply(LOCATION_REGEX, 'LOCATION')
  apply(NAME_REGEX, 'NAME')

  return { redacted, findings }
}

export function basicToxicityCheck(text: string): SafetyFinding[] {
  const bad = /(idiot|stupid|hate|kill|violence)/i
  return bad.test(text) ? [{ type: 'toxicity', detail: 'toxic_language' }] : []
}

export function hallucinationGuardrails(text: string): SafetyFinding[] {
  const unsafe = /(diagnosis|prescription|dose)/i
  return unsafe.test(text) ? [{ type: 'hallucination', detail: 'medical_authority_claim' }] : []
}

export function combineFindings(...lists: SafetyFinding[][]): SafetyFinding[] {
  return lists.flat()
}


