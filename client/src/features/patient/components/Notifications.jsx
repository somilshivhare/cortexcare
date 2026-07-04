import React from 'react';
import { Bell, Heart, ShieldAlert, Award } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      title: 'Clinic Connection Verified',
      description: 'Your patient account was successfully associated with Mercy General Clinic.',
      icon: Award,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
    },
    {
      title: 'Ambient Voice Audio Consent',
      description: 'Please review and accept our secure biometric and audio collection policy prior to next intake.',
      icon: ShieldAlert,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20',
    },
    {
      title: 'General Health Guide Updated',
      description: 'The CortexCare AI platform published a new cardiovascular lifestyle digest.',
      icon: Heart,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-xs">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-neutral-400 dark:text-neutral-500 animate-swing" />
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Active Alerts</h3>
      </div>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Notifications, policy consents, and clinician reminders.
      </p>

      <div className="mt-4 divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
        {notifications.map((notif, index) => {
          const Icon = notif.icon;
          return (
            <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${notif.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{notif.title}</h4>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{notif.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
