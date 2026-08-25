import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  FolderOpen,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Shield,
  ShieldCheck,
  TrendingUp,
  User,
  X,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    openLoginModal,
    logoutUser,
    cases,
    unreadCount
  } = useIncident();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'My Cases', count: cases.length },
    { id: 'track_case', label: 'Track Case', icon: TrendingUp },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'learn', label: 'Learn & Prevent', icon: BookOpen },
    { id: 'bank_directory', label: 'Bank Helplines', icon: Building2 },
    { id: 'privacy_security', label: 'Privacy & Security', icon: ShieldCheck },
    { id: 'about', label: 'How it Works' }
  ];

  return (
    <>
      {/* Floating Translucent Frosted Glass Navbar */}
      <div className="sticky top-2 z-40 w-full px-3 sm:px-6 pointer-events-none mt-2">
        <header
          className={`container mx-auto max-w-6xl pointer-events-auto rounded-2xl transition-all duration-200 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgba(30,40,50,0.08)]'
              : 'bg-white/90 backdrop-blur-lg border border-slate-200/80 shadow-[0_4px_20px_rgba(30,40,50,0.04)]'
          } px-4 py-2.5 flex items-center justify-between gap-3`}
        >
          {/* Left: Brand Logo & Title */}
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 focus:outline-none group shrink-0"
            aria-label="NIVARAN Home"
          >
            <div className="h-9 w-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <Shield size={20} className="stroke-[2.2]" />
            </div>
            <div className="text-left">
              <div className="font-display text-base font-extrabold tracking-tight text-slate-900 leading-none">
                NIVARAN
              </div>
              <div className="text-[10px] font-mono text-brand-primary font-semibold tracking-wider uppercase mt-0.5">
                CASE INTELLIGENCE
              </div>
            </div>
          </button>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-800" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-soft/80 text-brand-primary font-bold shadow-sm'
                      : 'text-slate-700 hover:text-brand-primary hover:bg-slate-100/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-brand-primary text-white font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Auth Button / User Dropdown & Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Citizen Auth Button / Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  className="px-2.5 py-1.5 rounded-lg bg-surface border border-surface-border hover:bg-surface-subtle text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <User size={13} className="text-brand-primary" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface border border-surface-border shadow-card p-1 text-xs space-y-0.5 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-surface-border font-mono text-[11px]">
                      <div className="text-slate-400 uppercase text-[9px]">Logged In Citizen:</div>
                      <div className="font-bold text-slate-900 truncate">{user.name}</div>
                    </div>
                    <button
                      onClick={() => { setActiveTab('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-subtle text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      My Cases Dashboard
                    </button>
                    <button
                      onClick={() => { logoutUser(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-red-soft text-brand-red transition-colors flex items-center gap-1.5"
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle text-slate-700 hover:text-slate-900 border border-surface-border text-xs font-semibold transition-colors"
              >
                Citizen Login
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Navigation Drawer Panel */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-16 left-4 right-4 bg-surface rounded-2xl border border-surface-border shadow-card p-5 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-brand-primary" />
                <span className="font-display font-bold text-slate-900">NIVARAN Case Intelligence</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-1 text-sm font-semibold text-slate-800">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-brand-soft text-brand-primary font-bold'
                        : 'text-slate-700 hover:bg-surface-subtle'
                    }`}
                  >
                    <span>{item.label}</span>
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-brand-primary text-white font-bold">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
