import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b13] flex flex-col justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-400 mt-4 text-sm font-medium">Securing session...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#070b13]">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col z-10">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};
export default DashboardLayout;
