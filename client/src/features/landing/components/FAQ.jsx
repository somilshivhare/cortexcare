import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How does the Voice Consultation feature capture audio?',
    answer: 'CortexCare uses the LiveKit WebRTC client SDK to stream microphone data. Chronological audio segments are stored as immutable conversation chunks in the database to maintain records.',
  },
  {
    question: 'Is the Gemini AI model accurate for medical terminology?',
    answer: 'CortexCare uses Gemini 2.5 Flash with strict JSON schema outputs. It extracts symptoms and flags potential risk issues, but all notes must be reviewed and approved by the assigned clinician.',
  },
  {
    question: 'How are clinic boundaries enforced in the database?',
    answer: 'Clinic groupings are managed via invite codes. Doctors and Patients are mapped to a clinic, and backend middlewares block clinicians from accessing data outside their clinic boundary.',
  },
  {
    question: 'Where are session tokens stored to prevent XSS theft?',
    answer: 'Unlike traditional apps that store JWTs in localStorage, CortexCare stores long-lived refresh tokens in HttpOnly secure cookies that JavaScript cannot access, preventing token theft.',
  },
  {
    question: 'Can I edit clinical context after the AI generates it?',
    answer: 'No, the AI-generated Clinical Context is immutable. However, clinicians can write and update their own separate DoctorNote associated with the consultation.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
          FAQ
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
          Learn about our WebRTC architecture, LLM validation, and security protocols.
        </p>
      </div>

      {/* Accordion list */}
      <div className="mt-16 space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-neutral-200/80 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="flex w-full items-center justify-between text-left focus:outline-none"
              >
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{faq.question}</span>
                {isOpen ? <Minus className="h-4 w-4 text-neutral-500" /> : <Plus className="h-4 w-4 text-neutral-500" />}
              </button>
              
              {isOpen && (
                <div className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default FAQ;
