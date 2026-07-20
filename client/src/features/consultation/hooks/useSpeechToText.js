import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook wrapping browser-native SpeechRecognition API.
 */
export const useSpeechToText = (onTranscriptResult) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      rec.onresult = (event) => {
        const resultText = event.results[0]?.[0]?.transcript;
        if (resultText && onTranscriptResult) {
          onTranscriptResult(resultText);
        }
      };
      recognitionRef.current = rec;
    }
  }, [onTranscriptResult]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Failed to stop speech recognition:', err);
      }
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    hasSupport: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  };
};
