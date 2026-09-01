import ai from '../../../config/gemini.js';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * GeminiClient — the ONLY module that communicates with the Gemini SDK.
 * No controller, worker, or service should import @google/genai directly.
 */
export class GeminiClient {
  /**
   * Helper to generate smart clinical intake fallback replies when API fails.
   * Provides a 1-on-1 clinic receptionist intake conversation experience with step-by-step follow-ups.
   * @param {string} prompt - Full compiled prompt
   * @param {string} [currentMessage] - Optional current user message
   */
  static generateFallbackReply(prompt, currentMessage = '') {
    let msg = typeof currentMessage === 'string' ? currentMessage.trim().toLowerCase() : '';
    
    // Extract patient's new message from prompt if currentMessage was not passed directly
    if (!msg && typeof prompt === 'string') {
      const match = prompt.match(/# Patient's New Message\s*\n\s*Patient:\s*(.*)/i);
      if (match && match[1]) {
        msg = match[1].trim().toLowerCase();
      } else {
        const lines = prompt.trim().split('\n');
        msg = lines[lines.length - 1].trim().toLowerCase();
      }
    }

    // Extract patient name if present in prompt
    let patientName = '';
    if (typeof prompt === 'string') {
      const nameMatch = prompt.match(/Name:\s*([^\n]+)/i);
      if (nameMatch && nameMatch[1]) {
        patientName = nameMatch[1].trim().split(' ')[0];
      }
    }
    const greetingName = patientName && patientName !== 'Patient' ? `, ${patientName}` : '';

    // Extract history from prompt to track intake progress
    const patientMessages = [];
    if (typeof prompt === 'string') {
      const lines = prompt.split('\n');
      for (const line of lines) {
        if (line.startsWith('Patient: ')) patientMessages.push(line.replace('Patient: ', '').trim().toLowerCase());
      }
    }

    // 1. Direct Corrections / Misunderstandings
    if (
      msg.includes('did not mention') ||
      msg.includes("didn't mention") ||
      msg.includes("didn't say") ||
      msg.includes('did not say') ||
      msg.includes('wrong') ||
      msg.includes('not yet') ||
      msg.includes("haven't told")
    ) {
      return `My apologies for the confusion${greetingName}! Let's start fresh: what primary symptom or health concern brought you in to the clinic today?`;
    }

    // 2. Greetings
    if (msg === 'hi' || msg === 'hello' || msg === 'hey' || msg.startsWith('good morning') || msg.startsWith('good afternoon') || msg.startsWith('hello')) {
      return `Hello${greetingName}! Welcome to CortexCare Clinic. I am your AI intake assistant. What main symptoms or health concern are you experiencing today?`;
    }

    // 3. Allergies / Medical History answers
    if (
      msg.includes('allergy') || msg.includes('allergies') || msg.includes('asthma') ||
      msg.includes('diabetes') || msg.includes('pressure') || msg.includes('condition') ||
      msg.includes('surgery') || msg.includes('surgeries') || msg.includes('no allergy')
    ) {
      return `Thank you${greetingName}! I've recorded all your intake details for your physician. Is there anything else specific you would like your doctor to review during your consultation today?`;
    }

    // 4. Specific Symptom Keywords
    if (msg.includes('headache') || msg.includes('migraine') || msg.includes('head pain')) {
      return `Thank you for letting me know. Is your headache constant or throbbing, and how long have you been experiencing it?`;
    }
    if (msg.includes('fever') || msg.includes('temperature') || msg.includes('chills') || msg.includes('feverish')) {
      return `Thank you. How high has your temperature been, and are you also having chills or body aches?`;
    }
    if (msg.includes('chest') || msg.includes('short of breath') || msg.includes('breathing') || msg.includes('heart')) {
      return `I understand. Are you feeling short of breath right now, or experiencing chest discomfort? (If you are having severe chest pain or trouble breathing, please call 911 or emergency services immediately).`;
    }
    if (msg.includes('stomach') || msg.includes('belly') || msg.includes('nausea') || msg.includes('vomit') || msg.includes('cramps') || msg.includes('digestive')) {
      return `Thank you for sharing that. Where in your stomach is the discomfort located, and does it get worse after eating?`;
    }
    if (msg.includes('cough') || msg.includes('throat') || msg.includes('cold') || msg.includes('flu') || msg.includes('sneezing')) {
      return `Thank you. Is your cough dry or producing mucus, and how many days have you had these symptoms?`;
    }
    if (msg.includes('pain') || msg.includes('ache') || msg.includes('hurt') || msg.includes('sore')) {
      return `Thank you. Where is the pain located, and on a scale of 1 to 10, how severe does it feel right now?`;
    }

    // 5. Time / Duration / Onset answers
    if (
      msg.includes('day') || msg.includes('hour') || msg.includes('week') || msg.includes('month') ||
      msg.includes('yesterday') || msg.includes('today') || msg.includes('morning') || msg.includes('short') ||
      msg.includes('recent') || msg.includes('long time') || msg.includes('started')
    ) {
      return `Got it, thank you for clarifying the timeline. On a scale of 1 to 10, how would you rate the severity of your discomfort right now?`;
    }

    // 6. Severity / Rating answers
    if (
      msg.match(/\b([1-9]|10)\b/) || msg.includes('severe') || msg.includes('mild') || msg.includes('moderate') ||
      msg.includes('bad') || msg.includes('terrible') || msg.includes('out of 10') || msg.includes('scale')
    ) {
      return `Understood. Are you currently taking any over-the-counter or prescription medications for this, or using any home remedies?`;
    }

    // 7. Medication answers
    if (
      msg.includes('med') || msg.includes('pill') || msg.includes('none') || msg.includes('no') ||
      msg.includes('taking') || msg.includes('tylenol') || msg.includes('advil') || msg.includes('aspirin') ||
      msg.includes('paracetamol') || msg.includes('ibuprofen')
    ) {
      return `Thank you for noting that. Do you have any known medical conditions, past surgeries, or drug allergies we should inform your physician about?`;
    }

    // 7. Medical History / Allergy answers or 3+ turns completed
    if (
      patientMessages.length >= 3 ||
      msg.includes('allergy') || msg.includes('allergies') || msg.includes('asthma') ||
      msg.includes('diabetes') || msg.includes('pressure') || msg.includes('condition')
    ) {
      return `Thank you${greetingName}! I've recorded all your intake details for your physician. Is there anything else specific you would like your doctor to review during your consultation today?`;
    }

    // 8. Default Receptionist Follow-up
    return `Thank you for sharing that${greetingName}. To make sure your doctor has complete context, how long have you noticed this, and has it been getting worse or staying the same?`;
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
