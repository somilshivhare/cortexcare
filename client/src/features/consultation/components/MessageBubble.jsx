import React from 'react';
import { Bot, User, FileText } from 'lucide-react';

const SPEAKER_LABELS = {
  PATIENT: 'You',
  AI: 'CortexCare AI',
  SYSTEM: 'System',
};

/**
 * MessageBubble — a single message in the AI Consultation conversation.
 * Handles PATIENT, AI, and SYSTEM speaker types distinctly.
 */
const MessageBubble = ({ message }) => {
  const { speaker, text, createdAt } = message;

  // System notification (file upload indicator etc.)
  if (speaker === 'SYSTEM') {
    return (
      <div className="flex justify-center my-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
          <FileText className="h-3 w-3" />
          {text}
        </span>
      </div>
    );
  }

  const isPatient = speaker === 'PATIENT';
  const label = SPEAKER_LABELS[speaker] || speaker;

  const timestamp = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className={`flex gap-3 max-w-[88%] ${isPatient ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
      {/* Avatar */}
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
        isPatient
          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
          : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
      }`}>
        {isPatient ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div className="space-y-1">
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
          {label}
        </span>

        <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
          isPatient
            ? 'bg-indigo-600 text-white dark:bg-indigo-600'
            : 'bg-white border border-neutral-200/80 text-neutral-800 dark:bg-neutral-850 dark:border-neutral-800 dark:text-neutral-300'
        }`}>
          <p className="whitespace-pre-line">{text}</p>
        </div>

        {timestamp && (
          <span className="text-[9px] text-neutral-400 block px-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
