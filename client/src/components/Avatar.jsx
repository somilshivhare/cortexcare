import React, { useState } from 'react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-14 w-14 text-sm font-bold',
    xl: 'h-20 w-20 text-lg font-bold',
  };

  const initials = getInitials(name);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-neutral-200/80 bg-neutral-100 font-semibold text-neutral-600 dark:border-neutral-850 dark:bg-neutral-800 dark:text-neutral-350 select-none ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
