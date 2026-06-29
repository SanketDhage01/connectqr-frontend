import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';
import { notificationService } from '../services/notificationService';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  // Play a premium synthesized alert beep using Web Audio API
  const playAlertSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Node 1: Oscillator (Freq = 880Hz, a high-pitch clear ring)
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      
      // Node 2: Gain Node (to control volume decay)
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); // decay in 0.5s
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('AudioContext beep blocked by browser policy:', e);
    }
  }, []);

  const addLocalToast = useCallback((title, body, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, body, type }]);
    
    // Auto-remove toast
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await notificationService.getNotifications();
      if (response?.status === 'success') {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [user]);

  // Request browser notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch notifications on user load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen to Socket.io events
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
      
      // Play audible alert
      playAlertSound();
      
      // Display UI toast
      addLocalToast(notification.title, notification.body, 'message');

      // Display Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico'
        });
      }
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket, playAlertSound, addLocalToast]);

  const markAsRead = async (id) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response?.status === 'success') {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response?.status === 'success') {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        addLocalToast('Cleared alerts', 'All notifications marked as read', 'success');
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const value = {
    notifications,
    unreadCount,
    toasts,
    markAsRead,
    markAllAsRead,
    addLocalToast,
    removeToast,
    refreshNotifications: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Dynamic Toast overlay container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className="cursor-pointer animate-slide-up bg-slate-900/90 border border-slate-800 text-slate-100 p-4 rounded-xl shadow-glass backdrop-blur-md flex flex-col hover:border-brand-500/50 transition-all"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="font-semibold text-sm text-brand-400">{toast.title}</span>
              <span className="text-[10px] text-slate-500 hover:text-slate-300">✕</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.body}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
export default NotificationContext;
