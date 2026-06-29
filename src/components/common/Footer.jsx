import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#04060b] border-t border-slate-900 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-slate-800 text-brand-400 p-1.5 rounded-lg border border-slate-700">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <span className="text-slate-400 text-sm">
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">ConnectQR</span>. All rights reserved.
          </span>
        </div>
        <div className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
