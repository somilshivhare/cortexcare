/**
 * ResponseParser — validates and maps raw Gemini JSON output into a
 * strongly-typed ClinicalContext object ready for database insertion.
 *
 * Never parse Gemini responses inside controllers, workers, or routes.
 */
export class ResponseParser {
  /**
   * Parse and validate a raw Gemini synthesis response string.
   * Falls back to safe defaults for any missing or invalid field.
   * @param {string} rawText - The raw string response from Gemini
   * @returns {object} Validated clinical context data ready for Prisma
   */
  static parseClinicalContext(rawText) {
    let raw = {};
    try {
      const cleaned = (rawText || '')
        .replace(/^```(?:json)?\n?/, '')
        .replace(/\n?```$/, '')
        .trim();
      raw = JSON.parse(cleaned);
    } catch (e) {
      console.error('[ResponseParser] Failed to parse JSON from raw text:', e.message);
    }

    const ensureArray = (val) => (Array.isArray(val) ? val : []);
    const ensureString = (val, fallback = '') => (typeof val === 'string' && val.trim() ? val.trim() : fallback);
    const validRiskLevels = ['LOW', 'MEDIUM', 'HIGH'];

    const riskLevel = validRiskLevels.includes(raw?.riskLevel?.toUpperCase?.())
      ? raw.riskLevel.toUpperCase()
      : 'LOW';

    const lifestyle = raw?.lifestyle && typeof raw.lifestyle === 'object'
      ? raw.lifestyle
      : { smoking: 'Not reported', alcohol: 'Not reported', exercise: 'Not reported' };

    const consultationState = raw?.consultationState && typeof raw.consultationState === 'object'
      ? {
          knownSymptoms: ensureArray(raw.consultationState.knownSymptoms),
          missingInformation: ensureArray(raw.consultationState.missingInformation),
          conversationComplete: raw.consultationState.conversationComplete === true,
        }
      : { knownSymptoms: [], missingInformation: [], conversationComplete: false };

    return {
      chiefComplaint: ensureString(raw?.chiefComplaint, 'No chief complaint reported.'),
      presentIllness: ensureString(raw?.presentIllness, 'No history of present illness recorded.'),
      pastMedicalHistory: ensureArray(raw?.pastMedicalHistory),
      currentMedications: ensureArray(raw?.currentMedications),
      allergies: ensureArray(raw?.allergies),
      lifestyle,
      symptoms: ensureArray(raw?.symptoms),
      timeline: ensureArray(raw?.timeline),
      riskFactors: ensureArray(raw?.riskFactors),
      riskLevel,
      recommendedSpecialist: ensureString(raw?.recommendedSpecialist, 'General Practitioner'),
      doctorSummary: ensureString(raw?.doctorSummary, 'No clinical summary generated.'),
      consultationState,
    };
  }
}
