import React from 'react';
import { motion } from 'framer-motion';

const EngineeringHighlights = () => {
  const stack = [
    { name: 'React 19', category: 'Frontend' },
    { name: 'Tailwind CSS v4', category: 'Styling' },
    { name: 'shadcn/ui', category: 'Components' },
    { name: 'Framer Motion', category: 'Animation' },
    { name: 'Node.js', category: 'Runtime' },
    { name: 'Express 5', category: 'Backend' },
    { name: 'Prisma ORM', category: 'Database Layer' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Redis Cache', category: 'Memory Cache' },
    { name: 'BullMQ', category: 'Background Queue' },
    { name: 'LiveKit Client/SDK', category: 'WebRTC Audio' },
    { name: 'Google Gemini', category: 'AI Inference' },
  ];

  return (
    <section className="bg-neutral-50/50 py-32 dark:bg-neutral-950/20 border-t border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-mono">
            Engineering
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Built With Modern Technologies
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-450">
            A production-ready stack designed for sub-second database queries and non-blocking asynchronous AI background tasks.
          </p>
        </div>

        {/* Tech Badges Grid */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          {stack.map((tech, idx) => (
            <motion.div
              key={tech.name}
              whileHover={{ scale: 1.02, y: -2 }}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 flex flex-col items-center justify-center text-center transition-colors min-w-[140px]"
            >
              <span className="text-xs font-bold text-neutral-900 dark:text-white">{tech.name}</span>
              <span className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase mt-1 tracking-wider">{tech.category}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EngineeringHighlights;
