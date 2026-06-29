import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext';
import { Mail, Settings, Circle, CheckCheck } from 'lucide-react';

export const NotificationCenter = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleNotificationClick = async (n) => {
    // Mark as read
    if (!n.isRead) {
      await markAsRead(n._id);
    }
    
    // Navigate to conversation
    if (n.data?.conversationId) {
      navigate(`/dashboard?chat=${n.data.conversationId}`);
    }
    
    if (onClose) onClose();
  };

  const getRelativeTime = (dateStr) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = new Date(dateStr) - new Date();
    const diffMinutes = Math.round(diff / (1000 * 60));
    
    if (Math.abs(diffMinutes) < 1) return 'Just now';
    if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, 'minute');
    
    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    
    const diffDays = Math.round(diffHours / 24);
    return rtf.format(diffDays, 'day');
  };

  return (
    <div className="glass-panel border border-slate-800 rounded-2xl shadow-glass overflow-hidden w-full max-h-[380px] flex flex-col animate-slide-up text-slate-200">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
        <span className="font-semibold text-sm">Alerts & Incidents</span>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Body List */}
      <div className="overflow-y-auto flex-1 divide-y divide-slate-800/40">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
            <Mail className="h-8 w-8 opacity-40 text-slate-400" />
            <span>You're all caught up!</span>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3 text-left cursor-pointer transition-all flex items-start gap-2.5 text-xs hover:bg-slate-800/20 ${
                !n.isRead ? 'bg-brand-500/5' : ''
              }`}
            >
              {/* Icon Indicator */}
              <div className="mt-0.5 p-1 rounded bg-slate-850 border border-slate-700/60">
                {n.type === 'new_message' ? (
                  <Mail className="h-3.5 w-3.5 text-brand-400" />
                ) : (
                  <Settings className="h-3.5 w-3.5 text-indigo-400" />
                )}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className={`font-medium ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                    {n.title}
                  </span>
                  {!n.isRead && (
                    <span className="flex-shrink-0 mt-1">
                      <Circle className="h-2 w-2 fill-brand-500 stroke-transparent animate-pulse" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{n.body}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {getRelativeTime(n.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default NotificationCenter;
