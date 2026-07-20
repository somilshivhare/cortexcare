import React from 'react';
import { Bell, Heart, ShieldAlert, Award, X } from 'lucide-react';

const NotificationCard = ({ notification, onClick }) => {
  const { id, title, description, time, read, type } = notification;

  const icons = {
    success: <Award className="h-4.5 w-4.5 text-emerald-500" />,
    warning: <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />,
    info: <Bell className="h-4.5 w-4.5 text-indigo-500" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50/50 border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-950/20',
    warning: 'bg-rose-50/50 border-rose-100/50 dark:bg-rose-950/10 dark:border-rose-950/20',
    info: 'bg-indigo-50/50 border-indigo-100/50 dark:bg-indigo-950/10 dark:border-indigo-950/20',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 select-none cursor-pointer hover:border-neutral-350 dark:hover:border-neutral-600 ${
        read 
          ? 'bg-white border-neutral-150 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-450' 
          : `shadow-2xs border ${bgStyles[type] || 'bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800'}`
      }`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        read ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600' : 'bg-white dark:bg-neutral-950 shadow-3xs'
      }`}>
        {icons[type] || <Bell className="h-4 w-4 text-neutral-450" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-xs font-bold truncate ${read ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-950 dark:text-white'}`}>
            {title}
          </h4>
          {!read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500 animate-pulse" />
          )}
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
        <span className="mt-2 block text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
          {time}
        </span>
      </div>
    </div>
  );
};

export default NotificationCard;
