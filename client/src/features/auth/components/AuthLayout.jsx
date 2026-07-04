import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen w-full bg-white dark:bg-neutral-900 transition-colors duration-300">
      
      {/* Left Pane: Premium visual branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-6 bg-neutral-950 p-16 text-white relative overflow-hidden flex-col justify-between select-none">
        {/* Soft background ambient gradient glow blobs */}
        <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-neutral-900/30 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-neutral-900/30 blur-[130px]" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center space-x-2">
          <div className="h-5 w-5 rounded bg-white" />
          <span className="font-bold tracking-tight text-white text-sm">CortexCare</span>
        </div>

        {/* Floating animated dashboard preview preview */}
        <div className="relative z-10 max-w-md mx-auto my-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Ambient Wave Engine</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">ACTIVE</span>
            </div>
            
            {/* Pulsing visualizer wave */}
            <div className="flex h-8 items-center justify-center space-x-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: [8, 28, 12, 22, 6, 32, 10][(i + 3) % 7],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }}
                />
              ))}
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed italic text-center">
              "Ambient intelligence captures the patient consultation, structures symptoms, and auto-fills clinic EHR files."
            </p>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[10px] text-neutral-500 font-medium">
          &copy; {new Date().getFullYear()} CortexCare. Secure ambient workflows.
        </div>

      </div>

      {/* Right Pane: Login/Register forms column */}
      <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Soft light background glowing blobs */}
        <div className="absolute top-0 right-1/4 h-[250px] w-[250px] rounded-full bg-neutral-100/50 blur-[100px] dark:bg-neutral-850/10" />
        <div className="absolute bottom-0 left-1/4 h-[250px] w-[250px] rounded-full bg-neutral-100/50 blur-[100px] dark:bg-neutral-850/10" />

        {/* Small branding wrapper (visible on mobile only) */}
        <div className="mb-6 flex flex-col items-center text-center lg:hidden relative z-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded bg-neutral-900 dark:bg-white" />
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">CortexCare</span>
          </Link>
          <p className="mt-1 text-[10px] text-neutral-450">Ambient AI Clinical Console</p>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
