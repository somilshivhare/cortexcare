import { GeminiClient } from '../GeminiClient.js';

export class GeminiProvider {
  /**
   * Request conversational follow-up from Gemini.
   */
  async generateConversationReply(prompt, currentMessage = '') {
    return await GeminiClient.generateConversationReply(prompt, currentMessage);
  }

  /**
   * Request structured clinical synthesis from Gemini.
   */
  async generateClinicalContext(prompt) {
    return await GeminiClient.generateClinicalContext(prompt);
  }
}
