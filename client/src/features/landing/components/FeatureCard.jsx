import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, accentClass = 'border-neutral-200/80', iconClass = 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex flex-col justify-between rounded-xl border p-6 bg-white shadow-sm dark:bg-neutral-900 transition-colors duration-300 ${accentClass}`}
    >
      <div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-neutral-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
      <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer select-none">
        <span>Explore details</span>
        <span className="ml-1">→</span>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
