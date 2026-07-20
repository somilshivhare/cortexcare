import { useState, useCallback } from 'react';

/**
 * Custom hook managing active alerts.
 * Prepared for future Socket.IO connection to stream live events.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Biometric Audio Consent Required',
      description: 'Please review and accept our ambient audio collection policies before starting your next session.',
      time: '10 mins ago',
      read: false,
      type: 'warning',
    },
    {
      id: '2',
      title: 'Clinic Link Active',
      description: 'Your patient account has successfully associated with Mercy General Hospital.',
      time: '1 hour ago',
      read: true,
      type: 'info',
    },
    {
      id: '3',
      title: 'Gemini Analysis Finalized',
      description: 'Your clinical context history for session #5928 has been computed.',
      time: '2 days ago',
      read: true,
      type: 'success',
      consultationId: '5928',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
  };
};
