import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#070b13] px-4 py-12">
      {/* Background glow effects */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-brand-500/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-md flex flex-col gap-6 animate-slide-up">
        {/* Logo Banner */}
        <div className="flex flex-col items-center gap-2">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="bg-gradient-to-tr from-brand-500 to-indigo-500 text-white p-2.5 rounded-xl shadow-glass-glow">
              <ShieldAlert className="h-7 w-7" />
            </span>
            <span className="font-sans font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Connect<span className="text-brand-500 font-extrabold">QR</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Privacy-First Incident Gateways</p>
        </div>

        {/* Viewport Card */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 shadow-glass">
          <Outlet />
        </div>
        
        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
