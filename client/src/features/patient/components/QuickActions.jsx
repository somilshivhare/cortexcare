import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, User, PlusCircle } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Start Consultation',
      description: 'Begin a secure AI clinical intake consultation.',
      icon: Sparkles,
      path: '/patient/consultation',
      color: 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
      actionLabel: 'Launch Session',
    },
    {
      title: 'View Health Records',
      description: 'Access clinical context summaries and recommendations.',
      icon: FileText,
      path: '/patient/clinical-context',
      color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white',
      actionLabel: 'Open History',
    },
    {
      title: 'Update Profile',
      description: 'Manage clinical demographics and clinic associations.',
      icon: User,
      path: '/patient/profile',
      color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white',
      actionLabel: 'Manage Demographics',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((act, index) => {
        const Icon = act.icon;
        return (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => navigate(act.path)}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 p-6 bg-white dark:bg-neutral-900 dark:border-neutral-800/80 shadow-xs cursor-pointer select-none transition-colors duration-300 hover:border-neutral-400 dark:hover:border-neutral-600"
          >
            <div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${act.color}`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
                {act.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                {act.description}
              </p>
            </div>
            
            <div className="mt-6 flex items-center text-[11px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              <span>{act.actionLabel}</span>
              <span className="ml-1.5 font-normal">→</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickActions;
