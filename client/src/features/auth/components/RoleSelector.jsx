import React from 'react';
import { User, Activity } from 'lucide-react';

const RoleSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        Choose Account Profile Type
      </label>
      <div className="grid grid-cols-2 gap-4">
        
        {/* Patient Card */}
        <button
          type="button"
          onClick={() => onChange('PATIENT')}
          className={`flex flex-col items-center justify-center rounded-lg border p-4 text-center transition-all ${
            value === 'PATIENT'
              ? 'border-neutral-900 bg-neutral-50/50 dark:border-white dark:bg-neutral-950/50'
              : 'border-neutral-200 bg-white hover:bg-neutral-50/30 dark:border-neutral-800 dark:bg-neutral-900'
          }`}
        >
          <User className={`h-5 w-5 ${value === 'PATIENT' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`} />
          <span className="mt-2 text-xs font-bold text-neutral-900 dark:text-white">Patient</span>
          <span className="mt-0.5 text-[9px] text-neutral-450 leading-normal">Describe symptoms ambiently</span>
        </button>

        {/* Doctor Card */}
        <button
          type="button"
          onClick={() => onChange('DOCTOR')}
          className={`flex flex-col items-center justify-center rounded-lg border p-4 text-center transition-all ${
            value === 'DOCTOR'
              ? 'border-neutral-900 bg-neutral-50/50 dark:border-white dark:bg-neutral-950/50'
              : 'border-neutral-200 bg-white hover:bg-neutral-50/30 dark:border-neutral-800 dark:bg-neutral-900'
          }`}
        >
          <Activity className={`h-5 w-5 ${value === 'DOCTOR' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`} />
          <span className="mt-2 text-xs font-bold text-neutral-900 dark:text-white">Practician</span>
          <span className="mt-0.5 text-[9px] text-neutral-450 leading-normal">Claim logs and review notes</span>
        </button>

      </div>
    </div>
  );
};

export default RoleSelector;
