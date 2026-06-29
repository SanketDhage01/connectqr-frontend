import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import { ShieldAlert } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto w-full py-16 text-center animate-slide-up">
      <GlassCard className="flex flex-col items-center gap-4">
        <span className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400">
          <ShieldAlert className="h-8 w-8" />
        </span>
        <h2 className="text-2xl font-bold text-white">404 - Page Not Found</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The secure gateway page you are looking for does not exist or has been archived.
        </p>
        <Link
          to="/"
          className="mt-4 bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all"
        >
          Go Back Home
        </Link>
      </GlassCard>
    </div>
  );
};
export default NotFound;
