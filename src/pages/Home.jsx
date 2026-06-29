import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import { ShieldCheck, MessageSquare, QrCode, Smartphone, Car, ShieldAlert } from 'lucide-react';

export const Home = () => {
  return (
    <div className="flex flex-col gap-16 py-10 md:py-16 text-slate-100">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-6 animate-slide-up">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-brand-500/10 text-brand-400 border border-brand-500/25 self-center">
          <ShieldAlert className="h-3.5 w-3.5" />
          Privacy-First Vehicle Incident Gateway
        </span>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
          Secure Vehicle Messaging <br className="hidden sm:inline" />
          Without Sharing <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Personal Data</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
          Generate a unique QR code for your vehicle. People can scan it to contact you instantly in emergencies, and your phone number remains 100% private.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Link
            to="/register"
            className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand-600/20 hover:scale-[1.02]"
          >
            Register My Vehicle
          </Link>
          <Link
            to="/login"
            className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-200 px-6 py-3 rounded-xl transition-all hover:scale-[1.02]"
          >
            Owner Login
          </Link>
        </div>
      </div>

      {/* Grid: How It Works */}
      <div className="flex flex-col gap-8">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How It Works</h2>
          <p className="text-sm text-slate-500 mt-1">Get set up in less than 3 minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <GlassCard className="flex flex-col gap-4 items-start" hoverEffect={true}>
            <span className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400">
              <QrCode className="h-6 w-6" />
            </span>
            <h3 className="font-bold text-lg">1. Generate QR Code</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create an account and register your vehicle plate number. ConnectQR instantly generates a high-resolution, secure scan link.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 items-start" hoverEffect={true}>
            <span className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Smartphone className="h-6 w-6" />
            </span>
            <h3 className="font-bold text-lg">2. Scan & Alert</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Print the QR and place it on your windshield. If someone blocks your vehicle, they simply scan to contact you directly.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 items-start" hoverEffect={true}>
            <span className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <MessageSquare className="h-6 w-6" />
            </span>
            <h3 className="font-bold text-lg">3. Secure Chat</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Message the scanner in real-time. No phone numbers, emails, or personal databases are ever exposed. Privacy is guaranteed.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Trust banner */}
      <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-950/15 border-brand-950/20 p-8 sm:p-10">
        <div className="flex flex-col gap-1.5 md:max-w-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold text-slate-200">100% Privacy Focused</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
            We encrypt conversations and purge them regularly. We never distribute plate numbers, personal profiles, or user records to third parties.
          </p>
        </div>
        <Link
          to="/register"
          className="bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all self-stretch md:self-auto text-center"
        >
          Secure My Car Now
        </Link>
      </GlassCard>
    </div>
  );
};
export default Home;
