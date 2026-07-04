import React from 'react';

const reviews = [
  {
    quote: "CortexCare has eliminated my post-consultation charting. The AI accurately captures orthostatic and vestibular complaints.",
    author: "Dr. Sarah Jenkins",
    role: "Neurologist, Aura Clinical Group",
  },
  {
    quote: "The clinic onboarding flow was extremely simple. Setting up invite codes took seconds, and our data remains fully isolated.",
    author: "Dr. Robert Chen",
    role: "Clinic Director, Beacon Health",
  },
  {
    quote: "Having a unified chronological timeline mapping system logs alongside physician notes provides excellent clinical continuity.",
    author: "Dr. Amanda Ross",
    role: "General Practitioner, Apex Medicine",
  },
];

const Testimonials = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
          Reviews
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Practitioner Endorsements
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
          See what medical professionals are saying about documentation savings.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className="text-sm italic leading-relaxed text-neutral-600 dark:text-neutral-300">
              "{rev.quote}"
            </p>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{rev.author}</h4>
              <p className="text-xs text-neutral-400">{rev.role}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Testimonials;
