import React from 'react';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';

export const MessageList = ({
  conversations,
  selectedId,
  onSelectConversation,
  loading
}) => {
  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const diffMins = Math.round(diff / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 py-6 justify-center items-center text-slate-500">
        <svg className="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs">Fetching threads...</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center gap-2">
        <MessageSquare className="h-10 w-10 text-slate-600 stroke-[1.5]" />
        <div>
          <span className="text-sm font-semibold text-slate-400">No Incidents Reported</span>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px]">When a scan triggers a contact form, it will display here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-1">
      {conversations.map((c) => {
        const isSelected = selectedId === c._id;
        
        return (
          <div
            key={c._id}
            onClick={() => onSelectConversation(c._id)}
            className={`group text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              isSelected
                ? 'bg-brand-500/10 border-brand-500/30'
                : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-850/60 hover:border-slate-700/60'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <span className={`font-semibold text-sm truncate ${
                  isSelected ? 'text-brand-400' : 'text-slate-200 group-hover:text-white'
                }`}>
                  {c.visitorName}
                </span>
                <span className="text-[10px] text-slate-500 flex-shrink-0 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {getRelativeTime(c.lastMessageTime)}
                </span>
              </div>
              
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase block mt-1">
                {c.vehicle?.brand} {c.vehicle?.model} • {c.vehicle?.vehicleNumber}
              </span>
              
              <p className="text-xs text-slate-400 truncate mt-1 leading-relaxed">
                {c.lastMessage}
              </p>
            </div>
            
            <ChevronRight className={`h-4 w-4 text-slate-600 transition-transform ${
              isSelected ? 'text-brand-400 translate-x-0.5' : 'group-hover:translate-x-0.5'
            }`} />
          </div>
        );
      })}
    </div>
  );
};
export default MessageList;
