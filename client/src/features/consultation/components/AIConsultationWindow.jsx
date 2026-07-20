import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';

/**
 * AIConsultationWindow — the scrollable conversation transcript display.
 * Renders message history using MessageBubble and shows a typing indicator.
 */
const AIConsultationWindow = ({ messages, isTyping }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-none min-h-[40vh] max-h-[50vh]">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-neutral-400 dark:text-neutral-500 py-12 gap-3">
          <Bot className="h-10 w-10 text-indigo-500 animate-bounce" />
          <p className="text-xs italic">Intake session ready. Type a message to begin.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id || `${msg.speaker}-${msg.sequence}`} message={msg} />
        ))
      )}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex gap-3 max-w-[85%] mr-auto">
          <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4 animate-spin" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              CortexCare AI
            </span>
            <div className="bg-white border border-neutral-200/80 rounded-2xl px-4 py-3 dark:bg-neutral-855 dark:border-neutral-800 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
};

export default AIConsultationWindow;
