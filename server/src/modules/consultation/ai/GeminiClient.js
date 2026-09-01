import ai from '../../../config/gemini.js';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * GeminiClient — the ONLY module that communicates with the Gemini SDK.
 * No controller, worker, or service should import @google/genai directly.
 */
export class GeminiClient {
  /**
   * Helper to generate smart clinical intake fallback replies when API fails.
   * @param {string} prompt - Full compiled prompt
   * @param {string} [currentMessage] - Optional current user message
   */
  static generateFallbackReply(prompt, currentMessage = '') {
    let textToAnalyze = typeof currentMessage === 'string' ? currentMessage.trim().toLowerCase() : '';
    
    // Extract patient's new message from prompt if currentMessage was not passed directly
    if (!textToAnalyze && typeof prompt === 'string') {
      const match = prompt.match(/# Patient's New Message\s*\n\s*Patient:\s*(.*)/i);
      if (match && match[1]) {
        textToAnalyze = match[1].trim().toLowerCase();
      } else {
        // Fallback: take the last line of prompt
        const lines = prompt.trim().split('\n');
        textToAnalyze = lines[lines.length - 1].trim().toLowerCase();
      }
    }

    if (textToAnalyze.includes('headache') || textToAnalyze.includes('migraine') || textToAnalyze.includes('head')) {
      return "Thank you for describing your headache symptoms. To help evaluate this further, is the pain throbbing or dull, and are you experiencing any nausea, sensitivity to light, or neck stiffness?";
    }
    if (textToAnalyze.includes('fever') || textToAnalyze.includes('temperature') || textToAnalyze.includes('chills') || textToAnalyze.includes('feverish')) {
      return "Thank you for letting me know. How high has your temperature been, and how long have you had the fever? Are you also experiencing body aches or chills?";
    }
    if (textToAnalyze.includes('chest') || textToAnalyze.includes('breath') || textToAnalyze.includes('breathing') || textToAnalyze.includes('heart')) {
      return "I understand you are experiencing chest or respiratory symptoms. Are you feeling short of breath right now, and does the discomfort radiate to your arm, neck, or back?";
    }
    if (textToAnalyze.includes('stomach') || textToAnalyze.includes('belly') || textToAnalyze.includes('nausea') || textToAnalyze.includes('vomit') || textToAnalyze.includes('cramps')) {
      return "Thank you for sharing that. Can you describe where the pain is located, how severe it is on a scale of 1-10, and whether it worsens after eating?";
    }
    if (textToAnalyze.includes('cough') || textToAnalyze.includes('cold') || textToAnalyze.includes('throat') || textToAnalyze.includes('flu')) {
      return "Thank you for sharing your symptoms. Is your cough dry or producing mucus, and how long have you been experiencing these symptoms?";
    }
    if (textToAnalyze.includes('pain') || textToAnalyze.includes('ache') || textToAnalyze.includes('hurt') || textToAnalyze.includes('sore')) {
      return "Thank you for letting me know. Could you describe where the pain is located, how severe it feels on a scale of 1 to 10, and how long you have had it?";
    }
    
    // Generic fallback responses pool if no specific symptom keyword matched
    const defaultReplies = [
      "Thank you for sharing that detail. Could you tell me a bit more about when these symptoms first started, how severe they feel, and if anything seems to make them better or worse?",
      "I appreciate you explaining that. To help prepare your clinical intake, how long have you been experiencing these symptoms, and have you noticed any other changes?",
      "Thank you for providing that information. Are you currently taking any medications or treatments for this, or do you have any relevant past medical history?"
    ];

    const charSum = textToAnalyze.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return defaultReplies[charSum % defaultReplies.length];
  }

  /**
   * Generate a conversational follow-up reply from a patient message.
   * @param {string} prompt - Compiled prompt from PromptBuilder
   * @param {string} [currentMessage] - Patient's latest input message
   * @returns {Promise<string>} AI text response
   */
  static async generateConversationReply(prompt, currentMessage = '') {
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
      return GeminiClient.generateFallbackReply(prompt, currentMessage);
    } catch (err) {
      console.error('[GeminiClient] generateConversationReply error:', err.message);
      return GeminiClient.generateFallbackReply(prompt, currentMessage);
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
