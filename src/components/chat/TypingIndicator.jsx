import React from 'react';

export const TypingIndicator = ({ visitorName = 'Visitor' }) => {
  return (
    <div className="flex flex-col gap-1 max-w-[150px]">
      <span className="text-[10px] text-slate-500 font-semibold px-1">
        {visitorName} is typing
      </span>
      <div className="bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
};
export default TypingIndicator;
