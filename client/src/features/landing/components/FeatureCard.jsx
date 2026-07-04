import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
      <div className="mt-4 text-xs font-semibold text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center">
        <span>Learn More</span>
        <span className="ml-1 select-none">→</span>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
