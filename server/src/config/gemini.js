import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV === 'production') {
  throw new Error('Critical Error: GEMINI_API_KEY environment variable is missing in production.');
}

// Instantiate Google GenAI SDK Client
const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy_api_key_for_local_testing',
});

export default ai;
