import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Database, Cpu, MessageSquare, Zap, Cloud, Globe } from 'lucide-react';

const technologies = [
  {
    name: 'React',
    description: 'Frontend Interface',
    icon: Globe,
    color: 'text-sky-500',
    bg: 'bg-sky-500/5',
  },
  {
    name: 'Node.js & Express',
    description: 'Backend API Gateway',
    icon: Layers,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/5',
  },
  {
    name: 'Google Gemini',
    description: 'AI Clinical Synthesis',
    icon: Cpu,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/5',
  },
  {
    name: 'PostgreSQL',
    description: 'Relational Database',
    icon: Database,
    color: 'text-blue-500',
    bg: 'bg-blue-500/5',
  },
  {
    name: 'Prisma',
    description: 'Database ORM Layer',
    icon: Layers,
    color: 'text-teal-500',
    bg: 'bg-teal-500/5',
  },
  {
    name: 'Redis',
    description: 'Intake Job Queue & Cache',
    icon: Zap,
    color: 'text-red-500',
    bg: 'bg-red-500/5',
  },
  {
    name: 'Socket.IO',
    description: 'Real-Time Alert Dispatch',
    icon: MessageSquare,
    color: 'text-pink-500',
    bg: 'bg-pink-500/5',
  },
  {
    name: 'Cloudinary',
    description: 'Medical File Assets Storage',
    icon: Cloud,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/5',
  },
];

const TechGrid = () => {
  return (
    <section id="technology" className="py-24 bg-neutral-50/40 dark:bg-neutral-950/20 border-t border-neutral-100 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3">
            Technology Stack
          </h2>
          <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
            Modern, Secure, & Highly Scalable
          </h3>
          <p className="mt-4 text-sm text-neutral-550 dark:text-neutral-400">
            Powered by a production-ready technology stack built to prioritize reliability and data protection.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="flex flex-col items-center p-6 rounded-2xl border border-neutral-200/60 bg-white hover:border-neutral-350 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:hover:border-neutral-700 shadow-3xs transition-all duration-200 cursor-default"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tech.bg} shrink-0 mb-4`}>
                  <Icon className={`h-5 w-5 ${tech.color}`} />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {tech.name}
                </h4>
                <p className="text-[10px] text-neutral-450 mt-1 font-semibold">
                  {tech.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TechGrid;
