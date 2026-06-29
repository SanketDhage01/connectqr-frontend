import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import NotificationCenter from '../notification/NotificationCenter';
import { Bell, Menu, X, LogOut, ShieldAlert, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-[#070b13]/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-tr from-brand-500 to-indigo-500 text-white p-2 rounded-xl shadow-glass-glow">
                <ShieldAlert className="h-6 w-6" />
              </span>
              <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Connect<span className="text-brand-500 font-extrabold">QR</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LayoutDashboard className="h-4 w-4 text-brand-400" />
                  Dashboard
                </Link>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-800/50 rounded-lg"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-[9px] font-bold text-white flex items-center justify-center rounded-full ring-2 ring-[#070b13]">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 z-50">
                      <NotificationCenter onClose={() => setShowNotifications(false)} />
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-brand-600/10"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-[9px] font-bold text-white flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 z-50">
                    <NotificationCenter onClose={() => setShowNotifications(false)} />
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#070b13] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-slate-300 hover:text-white px-3 py-2 rounded-lg text-base font-medium"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-slate-300 hover:text-white px-3 py-2 rounded-lg text-base font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full text-left text-slate-400 hover:text-white px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-slate-300 hover:text-white px-3 py-2 rounded-lg text-base font-medium border border-slate-800 bg-slate-900/50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-center bg-gradient-to-r from-brand-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-base font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
