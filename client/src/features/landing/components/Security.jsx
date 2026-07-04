import React from 'react';
import { Lock, UserCheck, ShieldAlert, KeyRound, Key, RefreshCw } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Privacy-First Architecture',
    description: 'Generative AI acts strictly as an administrative assistant. Final diagnostic and note decisions remain with the clinician.',
  },
  {
    icon: ShieldAlert,
    title: 'Cross-Site Scripting (XSS) Block',
    description: 'Refresh tokens are stored inside HttpOnly secure cookies. JavaScript is blocked from extracting sessions.',
  },
  {
    icon: UserCheck,
    title: 'Role-Based Access Control',
    description: 'Strict authorization middlewares restrict routes. Patients and Doctors are separated by strict JWT payload rules.',
  },
  {
    icon: KeyRound,
    title: 'Clinic Session Isolation',
    description: 'Security rules enforce that clinicians can only query consultation records of patients registered under the same clinic.',
  },
  {
    icon: RefreshCw,
    title: 'Stateless Token Rotation',
    description: 'Short-lived access keys (15 minutes) rotate statelessly via silent browser refresh interceptors.',
  },
  {
    icon: Key,
    title: 'Encrypted Communication',
    description: 'CORS credentials configurations guard incoming origins and require secure channel cookies.',
  },
];

const Security = () => {
  return (
    <section id="security" className="bg-neutral-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center">
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-400">
            Security & Trust
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built for Secure Clinical Operations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-400">
            CortexCare integrates structural database constraints and cookie token parameters to secure patient records.
          </p>
        </div>

        {/* Features list */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="flex flex-col items-start rounded-xl bg-neutral-800/40 p-6 border border-neutral-850">
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
