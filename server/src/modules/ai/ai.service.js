import aiClient from '../../config/gemini.js';

/**
 * Format raw transcript chunks into a single readable conversation block.
 * @param {Array} chunks 
 * @returns {string} Compiled conversation transcript
 */
export const compileTranscript = (chunks) => {
  return chunks
    .map((chunk) => `[${chunk.speaker}]: ${chunk.text}`)
    .join('\n');
};

/**
 * Send the compiled transcript to Gemini to extract structured clinical context.
 * @param {string} transcript - The compiled transcript text
 * @returns {Promise<object>} Structured clinical summary data
 */
export const generateClinicalContext = async (transcript) => {
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const systemInstruction = `
    You are a professional clinical documentation assistant.
    Your goal is to analyze the following voice intake transcript between a patient and an AI/System/Clinician.
    Provide a structured clinical context summary. Do not diagnose or make medical decisions.
    
    Extract:
    1. A concise, professional summary of the consultation (2-4 sentences).
    2. A list of key symptoms reported by the patient.
    3. Any risk flags or safety concerns (e.g. suicidal thoughts, severe chest pain, red flags). If none, return an empty list.
    4. Key recommendations or recovery pathway suggestions for the patient.
    5. Key mood emotional markers observed (e.g. anxious, cooperative, frustrated, calm).
    6. A confidence score between 0.0 and 1.0 representing your certainty of the extracted information.
  `;

  // Define JSON schema constraints to enforce structured JSON output from Gemini
  const responseSchema = {
    type: 'OBJECT',
    properties: {
      summary: {
        type: 'STRING',
        description: 'A clinical summary of the patient consultation.',
      },
      symptoms: {
        type: 'ARRAY',
        items: { type: 'STRING' },
        description: 'Key symptoms mentioned by the patient.',
      },
      riskFlags: {
        type: 'ARRAY',
        items: { type: 'STRING' },
        description: 'Any red flags, severe pain warnings, or safety concerns.',
      },
      recommendations: {
        type: 'ARRAY',
        items: { type: 'STRING' },
        description: 'Suggested key recommendations or next steps for the patient.',
      },
      mood: {
        type: 'ARRAY',
        items: { type: 'STRING' },
        description: 'Observed patient emotional states or mood markers.',
      },
      confidenceScore: {
        type: 'NUMBER',
        description: 'Confidence score between 0.0 and 1.0 of the extraction.',
      },
    },
    required: ['summary', 'symptoms', 'riskFlags', 'recommendations', 'mood', 'confidenceScore'],
  };

  const response = await aiClient.models.generateContent({
    model: modelName,
    contents: `Transcript:\n${transcript}`,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.1, // Low temperature for high reproducibility and accuracy
    },
  });

  const rawJson = response.text;
  
  try {
    return JSON.parse(rawJson);
  } catch (err) {
    console.error('Failed to parse Gemini output:', rawJson);
    throw new Error('AI output was not in valid JSON format.');
  }
};
