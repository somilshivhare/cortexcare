import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ value = '', onChange, name = 'password', error, label = 'Password', placeholder = 'Enter password' }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
          {label}
        </label>
      </div>

      {/* Input container */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-md border bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors pr-10 focus:border-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:border-white ${
            error ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Input Level Errors */}
      {error && <span className="text-[10px] font-semibold text-red-550 leading-none">{error.message}</span>}
    </div>
  );
};

export default PasswordInput;
