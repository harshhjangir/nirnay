import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  FolderOpen,
  FolderPlus,
  Layers,
  PhoneCall,
  Play,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { SensitiveDataMask } from '../common/SensitiveDataMask';

export const CommandHero: React.FC = () => {
  const {
    setActiveTab,
    setIntakeStep,
    activeCase,
    selectCase,
    caseReadiness,
    hasActiveDemoSession,
    activeDemoScenario,
    loadDemoScenario,
    loadDemoElectricityScenario,
    loadDemoAirlineScenario,
    loadDemoTelegramScenario,
    clearActiveDemoSession
  } = useIncident();

  const totalAmount = activeCase.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);
  const primaryTx = activeCase.transactions[0];

  return (
    <section className="relative pt-6 pb-12 overflow-hidden border-b border-surface-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mission, Copy, 3-Path Entry */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* System Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft border border-brand-primary/20 text-xs font-semibold tracking-wide text-brand-primary">
              <Shield size={14} className="text-brand-primary shrink-0" />
              <span className="truncate">NIRNAY &bull; Privacy-Preserving Fraud Case Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-text-primary tracking-tight leading-[1.15]">
              Something went wrong financially. <br />
              <span className="text-brand-primary">
                Let Nirnay organize the case.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
              Bring together your transaction, evidence, complaint references and responses in one place. Nirnay helps identify what is missing, what conflicts, and what needs attention next.
            </p>

            {/* Primary, Secondary, Third CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  setIntakeStep(1);
                  setActiveTab('intake');
                }}
                className="px-5 py-3 rounded-lg text-xs sm:text-sm font-bold bg-brand-primary hover:bg-brand-hover text-white transition-all shadow-card flex items-center gap-2"
              >
                <FolderPlus size={15} />
                <span>Build My Case</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold bg-surface hover:bg-surface-elevated text-text-primary border border-surface-border transition-colors flex items-center gap-2 shadow-subtle"
              >
                <FolderOpen size={15} className="text-brand-primary" />
                <span>I Already Reported It</span>
              </button>

              <button
                onClick={() => setActiveTab('track_case')}
                className="px-3.5 py-3 rounded-lg text-xs font-semibold bg-surface-subtle hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border transition-colors flex items-center gap-1.5"
              >
                <TrendingUp size={13} className="text-brand-blue" />
                <span>Track Case</span>
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className="px-3.5 py-3 rounded-lg text-xs font-semibold bg-surface-subtle hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border transition-colors flex items-center gap-1.5"
              >
                <Search size={13} className="text-brand-amber" />
                <span>Check Something</span>
              </button>
            </div>

            {/* 3-Path Entry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIntakeStep(1);
                  setActiveTab('intake');
                }}
                className="p-3.5 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border hover:border-brand-primary/40 text-left transition-all shadow-subtle group"
              >
                <div className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-wider mb-0.5">
                  JUST HAPPENED
                </div>
                <div className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                  <span>Build a Case</span>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary" />
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  Upload screenshot, SMS, or statement. Extract parameters automatically.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="p-3.5 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border hover:border-brand-primary/40 text-left transition-all shadow-subtle group"
              >
                <div className="text-[10px] font-mono font-bold text-brand-blue uppercase tracking-wider mb-0.5">
                  ALREADY REPORTED
                </div>
                <div className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-blue transition-colors flex items-center justify-between">
                  <span>Manage My Case</span>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue" />
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  Link 1930, Bank, and NCRP references in one continuous record.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tools')}
                className="p-3.5 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border hover:border-brand-primary/40 text-left transition-all shadow-subtle group"
              >
                <div className="text-[10px] font-mono font-bold text-brand-amber uppercase tracking-wider mb-0.5">
                  NOT SURE
                </div>
                <div className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-amber transition-colors flex items-center justify-between">
                  <span>Check Evidence</span>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-amber" />
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  Evaluate suspicious UPI IDs, phone numbers, links, or scam SMS.
                </p>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Demo Selector or Active Case Preview */}
          <div className="lg:col-span-5 w-full">
            
            {/* STATE A: User has NOT loaded a demo or created a case yet -> Show Interactive Demo Launcher */}
            {!hasActiveDemoSession ? (
              <div className="rounded-card-lg bg-surface border border-surface-border shadow-card overflow-hidden">
                <div className="px-5 py-3.5 border-b border-surface-border bg-surface-elevated flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                      CASE INTELLIGENCE SANDBOX
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-text-muted bg-surface-subtle px-2 py-0.5 rounded border border-surface-border">
                    Select a Demo to Run
                  </span>
                </div>

                <div className="p-5 space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary">
                      Test Case Intelligence with Realistic Scenarios
                    </h3>
                    <p className="text-text-muted leading-relaxed text-[11px]">
                      Click any scenario below to populate a full fraud case record, reconcile multi-document evidence, and test the bank response interpreter:
                    </p>
                  </div>

                  {/* 3 Distinct Demo Scenarios */}
                  <div className="space-y-2.5 pt-1">
                    
                    {/* Demo 1: Electricity Impersonation */}
                    <button
                      type="button"
                      onClick={loadDemoElectricityScenario}
                      className="w-full p-3 rounded-lg bg-surface-subtle hover:bg-brand-soft border border-surface-border hover:border-brand-primary/40 text-left transition-all group flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary group-hover:text-brand-primary">
                          <Zap size={13} className="text-brand-primary shrink-0" />
                          <span>Demo 1: Electricity Impersonation Call</span>
                        </div>
                        <div className="text-[11px] text-text-muted font-mono">
                          ₹18,500 &bull; UTR 423719820491 &bull; Bank Dispute Rejection
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-brand-primary bg-surface px-2 py-1 rounded border border-brand-primary/20 shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors flex items-center gap-1">
                        <Play size={10} />
                        Run
                      </span>
                    </button>

                    {/* Demo 2: Fake Customer Care / Collect Request */}
                    <button
                      type="button"
                      onClick={loadDemoAirlineScenario}
                      className="w-full p-3 rounded-lg bg-surface-subtle hover:bg-brand-blue-soft border border-surface-border hover:border-brand-blue/40 text-left transition-all group flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary group-hover:text-brand-blue">
                          <Search size={13} className="text-brand-blue shrink-0" />
                          <span>Demo 2: Fake Airline Customer Care Scam</span>
                        </div>
                        <div className="text-[11px] text-text-muted font-mono">
                          ₹7,200 &bull; Search Engine Poisoning &bull; UPI Collect Request
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-brand-blue bg-surface px-2 py-1 rounded border border-brand-blue/20 shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors flex items-center gap-1">
                        <Play size={10} />
                        Run
                      </span>
                    </button>

                    {/* Demo 3: Telegram Task / Job Scam */}
                    <button
                      type="button"
                      onClick={loadDemoTelegramScenario}
                      className="w-full p-3 rounded-lg bg-surface-subtle hover:bg-brand-amber-soft border border-surface-border hover:border-brand-amber/40 text-left transition-all group flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary group-hover:text-brand-amber">
                          <Layers size={13} className="text-brand-amber shrink-0" />
                          <span>Demo 3: Telegram Task / Rating Scam</span>
                        </div>
                        <div className="text-[11px] text-text-muted font-mono">
                          ₹65,000 &bull; 2 Sequential Transfers &bull; Mule Merchant Accounts
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-brand-amber bg-surface px-2 py-1 rounded border border-brand-amber/20 shrink-0 group-hover:bg-brand-amber group-hover:text-white transition-colors flex items-center gap-1">
                        <Play size={10} />
                        Run
                      </span>
                    </button>

                  </div>

                  <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-text-muted">
                    <span>Or start fresh with your own evidence:</span>
                    <button
                      onClick={() => {
                        setIntakeStep(1);
                        setActiveTab('intake');
                      }}
                      className="font-bold text-brand-primary hover:underline"
                    >
                      Build Real Case &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* STATE B: User HAS clicked a demo or created a case -> Show Active Case Intelligence Preview */
              <div className="rounded-card-lg bg-surface border border-surface-border shadow-card overflow-hidden animate-in fade-in">
                
                {/* Card Top Header */}
                <div className="px-5 py-3.5 border-b border-surface-border bg-surface-elevated flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-brand-primary" />
                    <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                      ACTIVE CASE INTELLIGENCE RECORD
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-brand-primary bg-brand-soft px-2 py-0.5 rounded border border-brand-primary/20">
                      {activeCase.caseId}
                    </span>
                    <button
                      onClick={clearActiveDemoSession}
                      className="p-1 text-text-muted hover:text-text-primary"
                      title="Reset Sandbox"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                {/* Card Data Content */}
                <div className="p-5 space-y-4 text-xs">
                  
                  {/* Category & Disputed Loss */}
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-surface-border">
                    <div>
                      <span className="text-[11px] text-text-muted uppercase font-medium block mb-0.5 font-mono">
                        Category Pattern
                      </span>
                      <span className="text-text-primary font-bold truncate block text-xs">
                        {activeCase.category === 'upi_fraud' ? 'UPI / Social Engineering' : activeCase.category.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">{activeCase.transactions[0]?.senderBank || 'Bank'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-muted uppercase font-medium block mb-0.5 font-mono">
                        Disputed Amount
                      </span>
                      <span className="text-xl font-bold font-mono text-text-primary">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-brand-green font-semibold flex items-center gap-1 font-mono">
                        <CheckCircle2 size={10} />
                        Reconciled in Case
                      </span>
                    </div>
                  </div>

                  {/* Case Readiness & Official References */}
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-surface-border">
                    <div>
                      <span className="text-[11px] text-text-muted uppercase font-medium block mb-0.5 font-mono">
                        Nirnay Readiness
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-brand-primary">
                          {caseReadiness.availableCount} / {caseReadiness.totalCount}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-green-soft text-brand-green font-bold font-mono">
                          {caseReadiness.percentage}% Ready
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-muted uppercase font-medium block mb-0.5 font-mono">
                        External References
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold font-mono text-text-primary">
                          {activeCase.externalReferences.length} Connected
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Parameters */}
                  {primaryTx && (
                    <div className="bg-surface-subtle p-3 rounded-lg border border-surface-border space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Originating Bank:</span>
                        <span className="text-text-primary font-semibold">{primaryTx.senderBank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Beneficiary VPA:</span>
                        <SensitiveDataMask value={primaryTx.recipientUpiOrAcc} type="upi" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">12-Digit UTR:</span>
                        <span className="text-text-primary font-bold">{primaryTx.utrNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Next Action Box */}
                  <div className="p-3.5 rounded-lg bg-brand-soft border border-brand-primary/25 space-y-2">
                    <span className="text-[11px] text-brand-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle size={13} />
                      RECOMMENDED NEXT ACTION
                    </span>
                    <div>
                      <div className="text-xs font-bold text-text-primary">
                        {activeCase.nextAction.title}
                      </div>
                      <div className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">
                        {activeCase.nextAction.why}
                      </div>
                    </div>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => selectCase(activeCase.caseId)}
                        className="px-3.5 py-1.5 rounded-md bg-brand-primary text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-subtle flex items-center gap-1.5"
                      >
                        <span>Open Full Case Dossier &rarr;</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
