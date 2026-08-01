import { GoogleGenAI } from '@google/genai';

const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
const hasGoogleKey = Boolean(process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim());

let selectedSource = 'NONE';
let apiKey = undefined;

if (hasGeminiKey) {
  selectedSource = 'GEMINI_API_KEY';
  apiKey = process.env.GEMINI_API_KEY.trim();
} else if (hasGoogleKey) {
  selectedSource = 'GOOGLE_API_KEY';
  apiKey = process.env.GOOGLE_API_KEY.trim();
}

console.log('[Gemini Auth Diagnostic]');
console.log(`- GEMINI_API_KEY exists: ${hasGeminiKey}`);
console.log(`- GOOGLE_API_KEY exists: ${hasGoogleKey}`);
console.log(`- Selected Source: ${selectedSource}`);
if (apiKey) {
  console.log(`- Prefix: ${apiKey.substring(0, 6)}`);
  console.log(`- Length: ${apiKey.length}`);
} else {
  console.log(`- Prefix: NONE`);
  console.log(`- Length: 0`);
}

const isProduction = process.env.NODE_ENV?.toLowerCase() === 'production';

if (!apiKey) {
  if (isProduction) {
    throw new Error('Critical Error: GEMINI_API_KEY or GOOGLE_API_KEY environment variable is missing in production.');
  } else {
    console.warn('[Gemini Config] WARNING: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set. Local testing will fall back to mock AI responses.');
  }
}

// Instantiate Google GenAI SDK Client explicitly using API key authentication
const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy_api_key_for_local_testing',
});

export default ai;


