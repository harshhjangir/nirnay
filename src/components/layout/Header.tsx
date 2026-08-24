import React, { useState } from 'react';
import {
  Bell,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  PhoneCall,
  PlusCircle,
  Search,
  Shield,
  User,
  X,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMasked,
    toggleMasking,
    user,
    openLoginModal,
    logoutUser,
    cases,
    unreadCount,
    setIntakeStep
  } = useIncident();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'intake', label: 'Report Incident', icon: PlusCircle },
    { id: 'track_case', label: 'Track Case', icon: Search },
    { id: 'dashboard', label: 'My Dashboard', count: cases.length },
    { id: 'tools', label: 'Nivaran Tools', icon: Zap },
    { id: 'learn', label: 'Learn & Prevent', icon: HelpCircle },
    { id: 'bank_directory', label: 'Bank Helplines', icon: Building2 },
    { id: 'about', label: 'How it Works' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface shadow-subtle">
      {/* Top 1930 Emergency Helpline Ribbon */}
      <div className="border-b border-brand-red/15 bg-brand-red-soft px-4 py-1.5 text-xs text-brand-red font-medium">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand-red" />
            <span className="font-semibold">NATIONAL FINANCIAL CYBER FRAUD HELPLINE:</span>
            <a
              href="tel:1930"
              className="font-bold underline hover:text-red-800 flex items-center gap-1 font-mono"
            >
              <PhoneCall size={12} />
              DIAL 1930
            </a>
            <span className="hidden md:inline text-text-muted">| Operates 24x7 under Ministry of Home Affairs (I4C)</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Sensitive Data Masking Toggle */}
            <button
              onClick={toggleMasking}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface border border-surface-border text-text-secondary hover:text-text-primary transition-colors focus:ring-1 focus:ring-brand-primary"
              title="Toggle masking of bank accounts, UPI IDs, and phone numbers"
              aria-label={isMasked ? 'Unmask sensitive numbers' : 'Mask sensitive numbers'}
            >
              {isMasked ? <EyeOff size={12} className="text-brand-amber" /> : <Eye size={12} className="text-brand-green" />}
              <span className="font-medium">{isMasked ? 'Data Masked' : 'Data Visible'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg p-1"
            aria-label="NIVARAN Home"
          >
            <div className="h-9 w-9 rounded-lg bg-brand-soft border border-brand-primary/30 flex items-center justify-center text-brand-primary">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-text-primary">
                  NIVARAN
                </span>
                <span className="rounded bg-brand-blue-soft px-1.5 py-0.2 text-[10px] font-mono font-semibold uppercase text-brand-blue border border-brand-blue/20">
                  CIVIC TECH
                </span>
              </div>
              <p className="text-[10px] font-medium text-text-muted tracking-tight">
                Financial Fraud Response Platform
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'intake') {
                      setIntakeStep(1);
                    }
                    setActiveTab(item.id);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-soft text-brand-primary border border-brand-primary/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                  }`}
                >
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-brand-primary/15 text-brand-primary font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* User Login or Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:bg-surface-subtle text-xs text-text-primary font-medium transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-brand-soft border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-[11px]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  {unreadCount > 0 && (
                    <span className="h-2 w-2 rounded-full bg-brand-red" />
                  )}
                  <ChevronDown size={14} className="text-text-muted" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-surface border border-surface-border shadow-dialog p-2 space-y-1 text-xs z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-surface-border">
                      <div className="font-bold text-text-primary truncate">{user.name}</div>
                      <div className="text-[11px] text-text-muted font-mono truncate">{user.email}</div>
                    </div>

                    <button
                      onClick={() => { setActiveTab('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-surface-subtle text-text-primary font-medium flex items-center justify-between"
                    >
                      <span>My Cases</span>
                      <span className="font-mono text-brand-primary font-bold">{cases.length}</span>
                    </button>

                    <button
                      onClick={() => { logoutUser(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-brand-red-soft text-brand-red font-medium flex items-center gap-2"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-subtle border border-surface-border transition-colors flex items-center gap-1.5"
              >
                <User size={14} />
                <span>Login</span>
              </button>
            )}

            {/* Primary CTA */}
            <button
              onClick={() => {
                setIntakeStep(1);
                setActiveTab('intake');
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white transition-colors shadow-subtle flex items-center gap-1.5 focus:ring-2 focus:ring-brand-primary"
            >
              <PlusCircle size={14} />
              <span>Report Incident</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface border border-surface-border text-text-secondary hover:text-text-primary focus:ring-2 focus:ring-brand-primary"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-surface-border bg-surface px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'intake') setIntakeStep(1);
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-primary/15 text-brand-primary font-bold">
                  {item.count} Active
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-surface-border flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-xs font-semibold rounded bg-surface-subtle text-brand-red border border-surface-border"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <button
                onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-xs font-semibold rounded bg-surface-subtle text-text-primary border border-surface-border"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => {
                setIntakeStep(1);
                setActiveTab('intake');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-bold rounded-lg bg-brand-primary text-white"
            >
              Report New Incident
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
