import React from 'react';

const NotificationBadge = ({ count, className = '' }) => {
  if (!count || count <= 0) return null;

  return (
    <span
      className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-900 animate-pulse select-none ${className}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default NotificationBadge;
