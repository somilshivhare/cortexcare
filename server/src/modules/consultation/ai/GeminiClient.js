import ai from '../../../config/gemini.js';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * GeminiClient — the ONLY module that communicates with the Gemini SDK.
 * No controller, worker, or service should import @google/genai directly.
 */
export class GeminiClient {
  /**
   * Generate a conversational follow-up reply from a patient message.
   * @param {string} prompt - Compiled prompt from PromptBuilder
   * @returns {Promise<string>} AI text response
   */
  static async generateConversationReply(prompt) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      return response.text?.trim() || "Thank you for sharing that. Could you tell me more about when these symptoms started?";
    } catch (err) {
      console.error('[GeminiClient] generateConversationReply error:', err.message);
      if (process.env.NODE_ENV !== 'production') {
        return "I'm having trouble connecting to the Gemini AI service (please check your GEMINI_API_KEY in server/.env). Could you share more details about your symptoms in the meantime?";
      }
      throw new Error('AI service temporarily unavailable. Please try again.');
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
      throw new Error('Failed to generate clinical context from transcript.');
    }
  }
}
