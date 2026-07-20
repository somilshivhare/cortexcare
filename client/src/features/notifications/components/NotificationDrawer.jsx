import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckSquare } from 'lucide-react';
import NotificationCard from './NotificationCard.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

const NotificationDrawer = ({ isOpen, onClose, notifications = [], onNotificationClick, onMarkAllRead }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/20 backdrop-blur-xs">
        {/* Backdrop click closer */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative flex w-full max-w-sm flex-col bg-white h-full shadow-2xl border-l border-neutral-200/80 dark:bg-neutral-900 dark:border-neutral-800/80 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Alert Center</h3>
            </div>
            
            <div className="flex items-center gap-2.5">
              {notifications.some((n) => !n.read) && (
                <button
                  onClick={onMarkAllRead}
                  className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800/50 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  title="Mark all as read"
                >
                  <CheckSquare className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-450"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none">
            {notifications.length === 0 ? (
              <div className="pt-20">
                <EmptyState
                  title="All caught up!"
                  description="You have no notifications or outstanding alerts at this time."
                  icon={Bell}
                />
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onClick={() => onNotificationClick(n)}
                />
              ))
            )}
          </div>
          
          {/* Footer note */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Socket.io Ready
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationDrawer;
