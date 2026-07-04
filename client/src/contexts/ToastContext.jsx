import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />,
    error: <AlertCircle className="h-4.5 w-4.5 text-rose-500" />,
    info: <Info className="h-4.5 w-4.5 text-indigo-500" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-250 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-350',
    error: 'bg-rose-50 border-rose-250 text-rose-950 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-350',
    info: 'bg-indigo-50 border-indigo-250 text-indigo-950 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-350',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Floating Toasts Anchor */}
      <div className="fixed top-6 right-6 z-55 w-full max-w-xs space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start justify-between gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto ${bgStyles[toast.type]}`}
            >
              <div className="flex gap-2.5">
                <div className="mt-0.5 shrink-0">{icons[toast.type]}</div>
                <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="mt-0.5 text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
