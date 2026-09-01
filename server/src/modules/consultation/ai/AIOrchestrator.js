import aiProvider from './providers/AIProvider.js';
import { PromptBuilder } from './PromptBuilder.js';
import { ResponseParser } from './ResponseParser.js';

export class AIOrchestrator {
  /**
   * Orchestrate the next conversation message reply.
   * @param {object} opts
   * @param {object} opts.patient - Patient model
   * @param {object[]} opts.messages - Ordered message history
   * @param {object[]} opts.attachments - Uploaded files
   * @param {object|null} opts.consultationState - JSON state blob
   * @param {string} opts.currentMessage - Latest patient message
   * @returns {Promise<string>} AI follow-up text reply
   */
  static async getConversationReply({ patient, messages, attachments, consultationState, currentMessage }) {
    const prompt = PromptBuilder.buildConversationPrompt({
      patient,
      messages,
      attachments,
      consultationState,
      currentMessage,
    });
    
    return await aiProvider.generateConversationReply(prompt, currentMessage);
  }

  /**
   * Orchestrate the background synthesis of clinical context.
   * @param {object} opts
   * @param {object} opts.patient - Patient model
   * @param {object[]} opts.messages - Full transcript messages
   * @param {object[]} opts.attachments - Session attachments
   * @param {object[]} opts.pastHistory - Past clinical history context
   * @returns {Promise<object>} Validated clinical context ready for Prisma
   */
  static async synthesizeClinicalContext({ patient, messages, attachments, pastHistory }) {
    const prompt = PromptBuilder.buildSynthesisPrompt({
      patient,
      messages,
      attachments,
      pastHistory,
    });

    const rawText = await aiProvider.generateClinicalContext(prompt);
    return ResponseParser.parseClinicalContext(rawText);
  }
}
