import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-start space-x-2 rounded-md border border-red-200 bg-red-50/50 p-3 text-xs text-red-650 dark:border-red-950/20 dark:bg-red-950/10 dark:text-red-400">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="font-semibold leading-normal">{message}</span>
    </div>
  );
};

export default FormError;
