import { GeminiClient } from '../GeminiClient.js';

export class GeminiProvider {
  /**
   * Request conversational follow-up from Gemini.
   */
  async generateConversationReply(prompt) {
    return await GeminiClient.generateConversationReply(prompt);
  }

  /**
   * Request structured clinical synthesis from Gemini.
   */
  async generateClinicalContext(prompt) {
    return await GeminiClient.generateClinicalContext(prompt);
  }
}
