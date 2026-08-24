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
import { calculateCaseReadiness } from '../../services/caseReadinessEngine';

export const UserDashboard: React.FC = () => {
  const {
    user,
    cases,
    selectCase,
    setActiveTab,
    setIntakeStep,
    notifications,
    markNotificationRead
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
            <span>MY NIVARAN CASE INTELLIGENCE DASHBOARD</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-text-primary">
            Welcome back{user ? `, ${user.name}` : ''}
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your persistent fraud cases, track official reference numbers, and resolve evidence gaps.
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
                <span>Alerts & Notifications</span>
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
              <span>Citizen Profile</span>
            </button>
          </div>

          {/* Quick Investigation Tools Prompt */}
          <div className="p-4 rounded-card bg-surface border border-surface-border shadow-subtle space-y-2 text-xs">
            <div className="font-bold text-text-primary flex items-center gap-1.5">
              <Zap size={14} className="text-brand-primary" />
              <span>Nivaran Mini-Tools</span>
            </div>
            <p className="text-text-muted leading-relaxed font-sans text-[11px]">
              Evaluate UPI handles, phone numbers, or parse bank debit SMS alerts directly into your case.
            </p>
            <button
              onClick={() => setActiveTab('tools')}
              className="pt-1 text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Open Tool Suite</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Right 9 Cols: Content */}
        <div className="lg:col-span-9 space-y-6">
          
          {(activeSidebarTab === 'overview' || activeSidebarTab === 'cases') && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Stat Row */}
              {activeSidebarTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    label="Active Cases"
                    value={activeCasesCount}
                    subValue={`${cases.length} total registered case file(s)`}
                    badge={<span className="text-xs font-mono font-bold text-brand-blue">TRACKING</span>}
                  />

                  <StatCard
                    label="Total Disputed Loss"
                    value={`₹${totalDisputedLoss.toLocaleString('en-IN')}`}
                    subValue="Across all registered incident records"
                    badge={<span className="text-xs font-mono font-bold text-brand-red">DISPUTED</span>}
                  />

                  <StatCard
                    label="Active Intelligence"
                    value="4 References"
                    subValue="Bank, 1930 & NCRP tracked"
                    highlight
                    badge={<span className="text-xs font-mono font-bold text-brand-green">SYNCED</span>}
                  />
                </div>
              )}

              {/* Cases List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text-primary font-display">
                    {activeSidebarTab === 'cases' ? 'All Case Dossiers' : 'Active Cases'}
                  </h2>
                </div>

                {cases.map((c) => {
                  const cTotal = c.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);
                  const readiness = calculateCaseReadiness(c);

                  return (
                    <div
                      key={c.caseId}
                      className="p-5 rounded-card-lg bg-surface border border-surface-border hover:border-surface-border-active hover:shadow-card transition-all space-y-3.5"
                    >
                      {/* Top Bar */}
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
                          <span>Filed: {new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Main Data Layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                        
                        <div className="sm:col-span-8 space-y-2">
                          <div className="font-bold text-text-primary text-sm">
                            {c.analysis.likelyType}
                          </div>
                          <p className="text-text-secondary line-clamp-2 leading-relaxed font-sans">
                            {c.whatHappenedSummary}
                          </p>

                          {/* Prioritized Next Action Callout */}
                          <div className="p-2.5 rounded bg-brand-red-soft/60 border border-brand-red/20 font-sans">
                            <span className="font-mono text-[10px] font-bold text-brand-red uppercase block mb-0.5">NEXT ACTION:</span>
                            <span className="text-text-primary font-medium text-xs">{c.nextAction.title}</span>
                          </div>
                        </div>

                        <div className="sm:col-span-4 flex flex-col justify-between sm:items-end font-mono">
                          <div className="text-right">
                            <span className="text-[10px] text-text-muted uppercase block">Disputed Loss</span>
                            <span className="text-base font-bold text-brand-red">
                              ₹{cTotal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="text-right text-[11px] text-text-muted mt-2">
                            <span>Readiness: <strong className="text-brand-primary">{readiness.availableCount} / {readiness.totalCount} items</strong></span>
                          </div>

                          <button
                            onClick={() => selectCase(c.caseId)}
                            className="mt-3 px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold text-xs shadow-subtle hover:bg-brand-hover transition-colors flex items-center gap-1 self-start sm:self-end"
                          >
                            <span>Open Case Intelligence</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>

                      </div>

                      {/* Bottom Footer Info */}
                      <div className="pt-2 border-t border-surface-border/50 flex flex-wrap items-center justify-between text-[11px] font-mono text-text-muted">
                        <span>External References: <strong className="text-text-primary">{c.externalReferences.length} Tracked</strong></span>
                        <span>Evidence: {c.evidence.length} Artifacts</span>
                        <span>Debited: {c.transactions[0]?.senderBank || 'Bank'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Notifications Tab */}
          {activeSidebarTab === 'notifications' && (
            <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
                <h2 className="text-base font-bold text-text-primary">
                  Case Activity & Escalation Alerts
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

          {/* Profile Tab */}
          {activeSidebarTab === 'profile' && (
            <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-5 animate-in fade-in">
              <div className="border-b border-surface-border/60 pb-3">
                <h2 className="text-base font-bold text-text-primary">
                  Citizen Identification Profile
                </h2>
                <p className="text-xs text-text-muted">
                  Used when generating formal bank dispute letters and NCRP legal dossier packages.
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
                  <label className="block text-text-muted font-medium mb-1">Registered Mobile</label>
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-text-primary">
                    {user?.phone || '+91 98451 92837'}
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted font-medium mb-1">Email</label>
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-text-primary">
                    {user?.email || 'rajesh.sharma@example.com'}
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted font-medium mb-1">Case Encryption & Storage</label>
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
