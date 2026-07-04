import React from 'react';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 px-1 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
