import { GeminiProvider } from './GeminiProvider.js';

/**
 * AIProvider — exports the active provider instance.
 * To change providers, simply instantiate and assign a different class implementation here.
 */
const activeProvider = new GeminiProvider();

export default activeProvider;
