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
  FolderPlus,
  Layers,
  LogOut,
  PhoneCall,
  PlusCircle,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { calculateCaseReadiness } from '../../services/caseReadinessEngine';
import { StatusProgressBadge, RiskBadge } from '../common/Badge';

export const UserDashboard: React.FC = () => {
  const {
    user,
    cases,
    selectCase,
    setActiveTab,
    setIntakeStep,
    notifications,
    markNotificationRead,
    loadDemoElectricityScenario
  } = useIncident();

  const [activeSidebarTab, setActiveSidebarTab] = useState<'cases' | 'notifications' | 'profile'>('cases');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Top Welcome Header */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
            <Shield size={14} />
            <span>NIVARAN CASE INTELLIGENCE DASHBOARD</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-text-primary">
            My Cases{user ? ` &bull; ${user.name}` : ''}
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
            className="px-4 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <FolderPlus size={14} />
            <span>Build New Case</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 3 Cols: Dashboard Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <div className="p-2 rounded-card bg-surface border border-surface-border shadow-subtle space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSidebarTab('cases')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activeSidebarTab === 'cases'
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20 font-bold'
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
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20 font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bell size={15} />
                <span>Case Updates</span>
              </span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-red text-white font-bold">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSidebarTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activeSidebarTab === 'profile'
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/20 font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <span className="flex items-center gap-2">
                <User size={15} />
                <span>Profile &amp; Settings</span>
              </span>
            </button>
          </div>

          {/* Quick Demo Reset Card */}
          <div className="p-3.5 rounded-card bg-surface-subtle border border-surface-border text-xs space-y-2">
            <div className="text-[11px] font-mono font-bold text-text-primary uppercase flex items-center gap-1.5">
              <Sparkles size={13} className="text-brand-primary" />
              <span>Evaluation Preset</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Load the benchmark electricity impersonation fraud case (₹18,500 loss with full evidence).
            </p>
            <button
              type="button"
              onClick={loadDemoElectricityScenario}
              className="w-full py-2 rounded-lg bg-surface hover:bg-surface-elevated text-brand-primary border border-surface-border font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <span>Load Electricity Demo Case</span>
            </button>
          </div>
        </div>

        {/* Right 9 Cols: Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: MY CASES (Specification #12) */}
          {activeSidebarTab === 'cases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-extrabold text-text-primary">
                    Active Fraud Cases ({cases.length})
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Select a case to inspect evidence reconciliation, linked official tickets, and response interpretations.
                  </p>
                </div>
              </div>

              {/* Case Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.map((c) => {
                  const readiness = calculateCaseReadiness(c);
                  const totalAmt = c.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);
                  const primaryBank = c.transactions[0]?.senderBank || 'Bank';
                  const pendingItem = readiness.items.find(i => !i.available)?.label || 'All core items complete';

                  return (
                    <div
                      key={c.caseId}
                      className="p-5 rounded-card-lg bg-surface border border-surface-border hover:border-brand-primary/40 transition-all shadow-subtle flex flex-col justify-between space-y-4 group"
                    >
                      {/* Top Strip */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-brand-primary bg-brand-soft px-2 py-0.5 rounded border border-brand-primary/20">
                            {c.caseId}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            Last update: {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ', ' + new Date(c.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '24 Aug, 14:20'}
                          </span>
                        </div>

                        <div>
                          <div className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                            {c.category === 'upi_fraud' ? 'UPI / Social Engineering' : c.category === 'fake_customer_care' ? 'Search Engine Customer Care Scam' : c.category.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-xs text-text-muted line-clamp-1 mt-0.5">
                            {c.whatHappenedSummary}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="pt-1">
                          <span className="text-xl font-bold font-mono text-text-primary">
                            ₹{totalAmt.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-text-muted font-sans ml-1.5">
                            ({primaryBank})
                          </span>
                        </div>
                      </div>

                      {/* Middle Data Stats */}
                      <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted text-[11px]">Nivaran Case Readiness:</span>
                          <span className="font-bold text-brand-primary text-xs">
                            {readiness.availableCount} / {readiness.totalCount} ({readiness.percentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted text-[11px]">Pending:</span>
                          <span className="text-text-secondary text-[11px] truncate max-w-[160px]">
                            {pendingItem}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted text-[11px]">External References:</span>
                          <span className="font-bold text-text-primary text-xs">
                            {c.externalReferences.length} Connected
                          </span>
                        </div>
                        {c.responses.length > 0 && (
                          <div className="flex justify-between items-center pt-1 border-t border-surface-border/60">
                            <span className="text-brand-amber font-semibold text-[11px]">Latest Response:</span>
                            <span className="text-text-primary font-bold text-[11px] truncate max-w-[150px]">
                              {c.responses[0].decision.split('(')[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action */}
                      <div className="pt-1 flex items-center justify-between border-t border-surface-border">
                        <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                          <FileCheck size={13} className="text-brand-primary" />
                          {c.evidence.length} Evidence Items
                        </span>
                        <button
                          onClick={() => selectCase(c.caseId)}
                          className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
                        >
                          <span>Open Case</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CASE NOTIFICATIONS */}
          {activeSidebarTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-display font-extrabold text-text-primary">
                  Case Activity &amp; Updates
                </h2>
                <p className="text-xs text-text-secondary">
                  Notifications regarding official references, response interpretations, and evidence alerts.
                </p>
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-card border transition-all text-xs space-y-1.5 ${
                      n.read ? 'bg-surface border-surface-border opacity-75' : 'bg-surface border-brand-primary/30 shadow-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${n.read ? 'bg-slate-300' : 'bg-brand-primary'}`} />
                        <span className="font-bold text-text-primary text-sm font-sans">{n.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-text-muted">{n.timestamp}</span>
                    </div>
                    <p className="text-text-secondary font-sans leading-relaxed">
                      {n.message}
                    </p>
                    {n.caseId && (
                      <div className="pt-2 flex items-center justify-between border-t border-surface-border/60">
                        <span className="font-mono text-[11px] text-brand-primary">Case: {n.caseId}</span>
                        <button
                          onClick={() => {
                            markNotificationRead(n.id);
                            selectCase(n.caseId!);
                          }}
                          className="text-xs font-bold text-brand-primary hover:underline"
                        >
                          Open Case Details &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & SETTINGS */}
          {activeSidebarTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-display font-extrabold text-text-primary">
                  Citizen Profile &amp; Privacy Configuration
                </h2>
                <p className="text-xs text-text-secondary">
                  Manage your authenticated profile and client-side encryption settings.
                </p>
              </div>

              <div className="p-6 rounded-card bg-surface border border-surface-border space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-text-muted uppercase font-bold block mb-1">Full Name</label>
                    <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-semibold text-text-primary">
                      {user?.name || 'Rajesh Sharma'}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase font-bold block mb-1">Email</label>
                    <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-text-primary">
                      {user?.email || 'rajesh.sharma@example.com'}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase font-bold block mb-1">Mobile Phone</label>
                    <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-text-primary">
                      {user?.phone || '+91 98451 92837'}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase font-bold block mb-1">Environment Mode</label>
                    <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-brand-primary font-bold">
                      {user?.isDemo ? 'Evaluation Demo Citizen' : 'Registered Citizen Account'}
                    </div>
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
