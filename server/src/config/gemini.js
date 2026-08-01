import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const isProduction = process.env.NODE_ENV?.toLowerCase() === 'production';

if (!apiKey) {
  if (isProduction) {
    throw new Error('Critical Error: GEMINI_API_KEY or GOOGLE_API_KEY environment variable is missing in production.');
  } else {
    console.warn('[Gemini Config] WARNING: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set. Local testing will fall back to mock AI responses.');
  }
}

if (apiKey && (apiKey.startsWith('AQ.') || apiKey.startsWith('ya29.'))) {
  console.warn('[Gemini Config] WARNING: Provided API key appears to be a Google OAuth Access Token instead of a Gemini API Key (AIzaSy...). The Gemini Developer API requires an API key.');
}

// Instantiate Google GenAI SDK Client explicitly using API key authentication
const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy_api_key_for_local_testing',
});

export default ai;

