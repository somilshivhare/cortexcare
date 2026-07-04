import React from 'react';
import { Lock, UserCheck, ShieldAlert, KeyRound, Key, RefreshCw } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Privacy-First Architecture',
    description: 'Generative AI acts strictly as an assistant. Final review, diagnostic alignment, and note submissions remain with the doctor.',
  },
  {
    icon: ShieldAlert,
    title: 'Enterprise-grade Secure Authentication',
    description: 'Session validations use secure cookie channels to protect practitioner logins from browser extraction.',
  },
  {
    icon: UserCheck,
    title: 'Role-Based Access Control',
    description: 'Strict routing layers ensure separate, role-restricted dashboard consoles for Patients and Doctors.',
  },
  {
    icon: KeyRound,
    title: 'Clinic Session Isolation',
    description: 'Authentication boundaries enforce that clinicians can only query consultation records of patients in their own clinic.',
  },
  {
    icon: RefreshCw,
    title: 'Background AI Processing',
    description: 'Offloads complex processing to isolated background worker threads to guarantee high performance and non-blocking APIs.',
  },
  {
    icon: Key,
    title: 'Encrypted Communication',
    description: 'All system transactions, API lookups, and real-time audio streams are routed through encrypted socket tunnels.',
  },
];

const Security = () => {
  return (
    <section id="security" className="bg-neutral-900 py-32 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center">
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-400 font-mono">
            Security & Trust
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built for Secure Clinical Operations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-400">
            CortexCare integrates structural data boundaries and authorization protocols to keep clinical workflows secure.
          </p>
        </div>

        {/* Features List */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="flex flex-col items-start rounded-xl bg-neutral-800/30 p-6 border border-neutral-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-900">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{feat.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Security;
