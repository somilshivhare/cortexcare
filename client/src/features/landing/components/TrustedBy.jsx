import React from 'react';

const TrustedBy = () => {
  const technologies = [
    'Google Gemini',
    'LiveKit WebRTC',
    'PostgreSQL',
    'Prisma ORM',
    'Redis Cache',
    'BullMQ Queue',
  ];

  return (
    <section className="border-b border-neutral-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Powered & Secured By Modern Infrastructure
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs font-semibold tracking-tight text-neutral-400 dark:text-neutral-550 select-none cursor-default hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
