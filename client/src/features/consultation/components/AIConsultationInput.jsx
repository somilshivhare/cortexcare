import React, { useState } from 'react';
import { Send, Mic, MicOff, Paperclip, Loader2 } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText.js';

/**
 * AIConsultationInput — input bar for AI intake conversation with text entry and dictation support.
 */
const AIConsultationInput = ({ onSend, onFileSelect, isUploadingFile, disabled }) => {
  const [text, setText] = useState('');

  // Callback to append Speech Recognition result to input box
  const handleTranscript = (transcriptText) => {
    setText((prev) => `${prev} ${transcriptText}`.trim());
  };

  const { isListening, startListening, stopListening, hasSupport } = useSpeechToText(handleTranscript);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleSend} className="border-t border-neutral-100 p-4 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-b-2xl">
      <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-3 py-2 dark:bg-neutral-950 dark:border-neutral-800 focus-within:border-indigo-500/80 transition-colors">
        
        {/* Attachment clip */}
        <label className="cursor-pointer text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1.5 shrink-0 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
              e.target.value = ''; // Reset file input
            }}
            disabled={disabled || isUploadingFile}
            className="hidden"
            accept=".pdf,.docx,.jpg,.png,image/*"
          />
          {isUploadingFile ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin text-indigo-500" />
          ) : (
            <Paperclip className="h-4.5 w-4.5" />
          )}
        </label>

        {/* Message Input Box */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening..." : "Describe symptoms or ask follow-up questions..."}
          disabled={disabled}
          className="flex-1 text-xs text-neutral-900 bg-transparent border-none outline-none dark:text-white"
        />

        {/* Speech to text mic button */}
        {hasSupport && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={disabled}
            className={`p-1.5 rounded-lg transition-all duration-300 shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
          </button>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg p-1.5 shrink-0 transition-colors disabled:opacity-40 disabled:hover:bg-indigo-650"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </form>
  );
};

export default AIConsultationInput;
