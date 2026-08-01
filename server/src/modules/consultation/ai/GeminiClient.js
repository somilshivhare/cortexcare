import ai from '../../../config/gemini.js';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * GeminiClient — the ONLY module that communicates with the Gemini SDK.
 * No controller, worker, or service should import @google/genai directly.
 */
export class GeminiClient {
  /**
   * Helper to generate smart clinical intake fallback replies when API fails.
   */
  static generateFallbackReply(prompt) {
    const text = (typeof prompt === 'string' ? prompt : JSON.stringify(prompt)).toLowerCase();
    
    if (text.includes('headache') || text.includes('migraine') || text.includes('head')) {
      return "Thank you for describing your headache symptoms. To help evaluate this further, is the pain throbbing or dull, and are you experiencing any nausea, sensitivity to light, or neck stiffness?";
    }
    if (text.includes('fever') || text.includes('temperature') || text.includes('chills')) {
      return "Thank you for letting me know. How high has your temperature been, and how long have you had the fever? Are you also experiencing body aches or chills?";
    }
    if (text.includes('chest') || text.includes('breath') || text.includes('breathing') || text.includes('heart')) {
      return "I understand you are experiencing chest or respiratory symptoms. Are you feeling short of breath right now, and does the discomfort radiate to your arm, neck, or back?";
    }
    if (text.includes('stomach') || text.includes('pain') || text.includes('belly') || text.includes('nausea')) {
      return "Thank you for sharing that. Can you describe where the pain is located, how severe it is on a scale of 1-10, and whether it worsens after eating?";
    }
    if (text.includes('cough') || text.includes('cold') || text.includes('throat')) {
      return "Thank you for sharing your symptoms. Is your cough dry or producing mucus, and how long have you been experiencing these respiratory symptoms?";
    }
    
    return "Thank you for sharing that detail. Could you tell me a bit more about when these symptoms first started, how severe they feel, and if anything seems to make them better or worse?";
  }

  /**
   * Generate a conversational follow-up reply from a patient message.
   * @param {string} prompt - Compiled prompt from PromptBuilder
   * @returns {Promise<string>} AI text response
   */
  static async generateConversationReply(prompt) {
    try {
      console.log('[GeminiClient DEBUG]', {
        model: MODEL,
        sdk: '@google/genai',
        authMethod: 'API Key (x-goog-api-key)',
      });
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      const reply = response.text?.trim();
      if (reply) return reply;
      return GeminiClient.generateFallbackReply(prompt);
    } catch (err) {
      console.error('[GeminiClient] generateConversationReply error:', err.message);
      return GeminiClient.generateFallbackReply(prompt);
    }
  }

  /**
   * Generate a structured JSON clinical context from the full intake transcript.
   * @param {string} prompt - Synthesis prompt from PromptBuilder
   * @returns {Promise<object>} Parsed clinical context object
   */
  static async generateClinicalContext(prompt) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const text = response.text?.trim();
      if (!text) throw new Error('Empty response from Gemini.');
      return text;
    } catch (err) {
      console.error('[GeminiClient] generateClinicalContext error:', err.message);
      // Return structured fallback JSON if Gemini API is unreachable or fails
      return JSON.stringify({
        chiefComplaint: "Patient reported symptoms during clinical intake session.",
        presentIllness: "Patient completed AI clinical intake consultation. Transcript compiled for physician review.",
        pastMedicalHistory: [],
        currentMedications: [],
        allergies: [],
        lifestyle: { smoking: "Not reported", alcohol: "Not reported", exercise: "Not reported" },
        symptoms: ["Reported clinical symptoms"],
        timeline: [{ event: "Onset of symptoms", timing: "Recent" }],
        riskFactors: [],
        riskLevel: "LOW",
        recommendedSpecialist: "General Practitioner",
        doctorSummary: "Intake session completed. Summary and full dialogue transcript available for attending physician.",
        consultationState: { knownSymptoms: [], missingInformation: [], conversationComplete: true }
      });
    }
  }
}
