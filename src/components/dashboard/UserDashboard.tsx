import React, { useState } from 'react';
import {
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileDown,
  FileText,
  FolderOpen,
  Layers,
  LogOut,
  PhoneCall,
  PlusCircle,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  User,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { StatusProgressBadge, RiskBadge, UrgencyBadge } from '../common/Badge';
import { StatCard } from '../common/StatCard';
import { SensitiveDataMask } from '../common/SensitiveDataMask';

export const UserDashboard: React.FC = () => {
  const {
    user,
    cases,
    selectCase,
    setActiveTab,
    setIntakeStep,
    notifications,
    markNotificationRead,
    openLoginModal
  } = useIncident();

  const [activeSidebarTab, setActiveSidebarTab] = useState<'overview' | 'cases' | 'notifications' | 'profile'>('overview');

  const totalDisputedLoss = cases.reduce(
    (sum, c) => sum + c.transactions.reduce((tSum, tx) => tSum + (tx.amount || 0), 0),
    0
  );

  const activeCasesCount = cases.filter(c => c.statusProgress !== 'closed').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Top Welcome Header */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
            <Shield size={14} />
            <span>MY NIVARAN CITIZEN DASHBOARD</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-text-primary">
            Welcome back{user ? `, ${user.name}` : ''}
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your registered financial fraud reports, download legal dossiers, and track bank escalation progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setIntakeStep(1);
              setActiveTab('intake');
            }}
            className="px-4 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>Report New Incident</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 3 Cols: Dashboard Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <div className="p-2 rounded-card bg-surface border border-surface-border shadow-subtle space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSidebarTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activeSidebarTab === 'overview'
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers size={15} />
                <span>Overview</span>
              </span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('cases')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activeSidebarTab === 'cases'
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderOpen size={15} />
                <span>My Cases</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-primary/10 text-brand-primary">
                {cases.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('notifications')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activeSidebarTab === 'notifications'
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bell size={15} />
                <span>Notifications</span>
              </span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-red text-white font-bold">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSidebarTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                activeSidebarTab === 'profile'
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <User size={15} />
              <span>Profile & Security</span>
            </button>
          </div>

          {/* Quick 1930 Box */}
          <div className="p-4 rounded-card bg-brand-red-soft border border-brand-red/20 space-y-2">
            <div className="text-xs font-bold font-mono text-brand-red flex items-center gap-1.5">
              <PhoneCall size={13} />
              EMERGENCY 1930
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              If an unauthorized debit just happened, dial 1930 immediately to freeze funds before mule layering occurs.
            </p>
          </div>
        </div>

        {/* Right 9 Cols: Dynamic Content */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW & ACTIVE CASES */}
          {(activeSidebarTab === 'overview' || activeSidebarTab === 'cases') && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Stat Summary Row */}
              {activeSidebarTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    label="Active Incidents"
                    value={activeCasesCount}
                    subValue={`${cases.length} total registered case(s)`}
                    badge={<span className="text-xs font-mono font-bold text-brand-blue">TRACKING</span>}
                  />

                  <StatCard
                    label="Total Disputed Loss"
                    value={`₹${totalDisputedLoss.toLocaleString('en-IN')}`}
                    subValue="Across all active banking complaints"
                    badge={<span className="text-xs font-mono font-bold text-brand-red">DISPUTED</span>}
                  />

                  <StatCard
                    label="Primary Next Action"
                    value="Call 1930"
                    subValue="Quote 12-digit UTR to I4C"
                    highlight
                    badge={<span className="text-xs font-mono font-bold text-brand-red">URGENT</span>}
                  />
                </div>
              )}

              {/* Active Cases List Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary font-display">
                    {activeSidebarTab === 'cases' ? 'All Registered Cases' : 'Active Fraud Cases'}
                  </h2>
                  <p className="text-xs text-text-muted">
                    Click on any case to view progress timeline, evidence, and official handover documents.
                  </p>
                </div>
              </div>

              {/* Cases Grid */}
              {cases.length === 0 ? (
                <div className="p-10 rounded-card-lg bg-surface border border-surface-border text-center space-y-3 shadow-subtle">
                  <FolderOpen size={28} className="mx-auto text-text-muted opacity-60" />
                  <div className="text-sm font-bold text-text-primary">No active cases registered</div>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    If you have lost money to financial cyber fraud, report an incident to create a structured case dossier.
                  </p>
                  <button
                    onClick={() => {
                      setIntakeStep(1);
                      setActiveTab('intake');
                    }}
                    className="px-5 py-2 rounded-lg bg-brand-primary text-white font-semibold text-xs shadow-subtle"
                  >
                    Report an Incident
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cases.map((c) => {
                    const cTotal = c.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);
                    return (
                      <div
                        key={c.caseId}
                        className="p-5 rounded-card-lg bg-surface border border-surface-border hover:border-surface-border-active hover:shadow-card transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/60 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-bold text-brand-primary">
                              {c.caseId}
                            </span>
                            <StatusProgressBadge status={c.statusProgress} />
                            <RiskBadge level={c.analysis.riskLevel} size="sm" />
                          </div>

                          <div className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                            <Calendar size={13} />
                            <span>Filed: {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                          <div className="sm:col-span-8 space-y-1">
                            <div className="font-bold text-text-primary">
                              {c.analysis.likelyType}
                            </div>
                            <p className="text-text-secondary line-clamp-2 leading-relaxed font-sans">
                              {c.whatHappenedSummary}
                            </p>
                          </div>

                          <div className="sm:col-span-4 flex flex-col justify-between sm:items-end font-mono">
                            <div className="text-right">
                              <span className="text-[10px] text-text-muted uppercase block">Disputed Amount</span>
                              <span className="text-base font-bold text-brand-red">
                                ₹{cTotal.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <button
                              onClick={() => selectCase(c.caseId)}
                              className="mt-2 px-3.5 py-1.5 rounded-lg bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-semibold text-xs transition-colors flex items-center gap-1 self-start sm:self-end"
                            >
                              <span>View Case Dossier</span>
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-surface-border/50 flex flex-wrap items-center justify-between text-[11px] font-mono text-text-muted">
                          <span>Evidence: {c.evidence.length} items verified</span>
                          <span>Bank: {c.transactions[0]?.senderBank || 'SBI'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeSidebarTab === 'notifications' && (
            <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
                <h2 className="text-base font-bold text-text-primary">
                  Case Activity & Alerts
                </h2>
                <span className="text-xs text-text-muted font-mono">
                  {notifications.length} total alert(s)
                </span>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer space-y-1 ${
                      n.read
                        ? 'bg-surface border-surface-border text-text-secondary'
                        : 'bg-brand-soft/40 border-brand-primary/30 text-text-primary font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold font-sans">
                        {!n.read && <span className="h-2 w-2 rounded-full bg-brand-primary" />}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-text-muted">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-text-secondary font-sans leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & SECURITY */}
          {activeSidebarTab === 'profile' && (
            <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-5 animate-in fade-in">
              <div className="border-b border-surface-border/60 pb-3">
                <h2 className="text-base font-bold text-text-primary">
                  Citizen Profile & Verification Details
                </h2>
                <p className="text-xs text-text-muted">
                  Your registered contact details used when generating legal case packages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-text-muted font-medium mb-1">Full Name</label>
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-semibold text-text-primary">
                    {user?.name || 'Rajesh Sharma'}
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted font-medium mb-1">Registered Mobile Number</label>
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-text-primary">
                    {user?.phone || '+91 98451 92837'}
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted font-medium mb-1">Email Address</label>
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-text-primary">
                    {user?.email || 'rajesh.sharma@example.com'}
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted font-medium mb-1">Data Storage Status</label>
                  <div className="p-2.5 rounded-lg bg-brand-green-soft border border-brand-green/20 font-mono text-brand-green font-semibold">
                    Client Browser Storage (Local Only)
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
