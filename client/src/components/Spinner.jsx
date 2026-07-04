import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`animate-spin rounded-full border-t-neutral-900 border-r-transparent border-b-transparent border-l-transparent dark:border-t-white ${currentSize} ${className}`}
      style={{ borderColor: 'rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.1) currentColor' }}
      aria-label="Loading"
    />
  );
};

export default Spinner;
