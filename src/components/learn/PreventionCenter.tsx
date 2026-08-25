import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  HelpCircle,
  Info,
  Layers,
  PhoneCall,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  UserCheck,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import {
  SCAM_DATABASE,
  ScamCategoryFilter,
  ScamReferenceItem
} from '../../services/scamDatabase';
import {
  BEFORE_YOU_PAY_CHECKLIST,
  COMMON_CONFUSIONS_DATABASE,
  EVIDENCE_PRESERVATION_GUIDE,
  MYTH_VS_REALITY_DATABASE,
  RED_FLAG_DECODER_DATABASE,
  TERMINOLOGY_DATABASE
} from '../../services/terminologyData';

export const PreventionCenter: React.FC = () => {
  const { setActiveTab, setIntakeStep } = useIncident();

  // Active section tabs
  const [activeMainSection, setActiveMainSection] = useState<
    'scams' | 'red_flags' | 'before_pay' | 'after_pay' | 'evidence_guide' | 'terminology' | 'confusions'
  >('scams');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ScamCategoryFilter>('ALL');

  // Accordion expanded state for 20 Scam Items
  const [expandedScamId, setExpandedScamId] = useState<string | null>('upi-fraud');

  // Accordion expanded state for Terminology Items
  const [expandedTermId, setExpandedTermId] = useState<string | null>('utr');

  // Red Flag Decoder Selected Scenario
  const [selectedRedFlagId, setSelectedRedFlagId] = useState<string>('rf-account-block');

  // Before You Pay Checklist Checkboxes State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Common Confusions Expanded State
  const [expandedConfusionId, setExpandedConfusionId] = useState<string | null>('cc-1');

  // Terminology visual walkthrough active tab
  const [selectedAppWalkthrough, setSelectedAppWalkthrough] = useState<Record<string, string>>({
    utr: 'Google Pay',
    rrn: 'Bank Mobile App',
    'upi-id-vpa': 'UPI Apps (GPay, PhonePe, Paytm)',
    'tx-id': 'Payment Apps'
  });

  const toggleCheckbox = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartIncidentResponse = () => {
    setIntakeStep(1);
    setActiveTab('intake');
  };

  // Filtered Scams based on search and category
  const filteredScams = SCAM_DATABASE.filter(item => {
    const matchesCategory = activeCategoryFilter === 'ALL' || item.categoryTag === activeCategoryFilter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.whatItIs.toLowerCase().includes(q) ||
      item.redFlags.some(rf => rf.toLowerCase().includes(q)) ||
      item.howItStarts.some(h => h.toLowerCase().includes(q)) ||
      item.attackerMaySay.some(a => a.toLowerCase().includes(q))
    );
  });

  // Filtered Terminology based on search
  const filteredTerminology = TERMINOLOGY_DATABASE.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.term.toLowerCase().includes(q) ||
      item.shortWhatItMeans.toLowerCase().includes(q) ||
      item.whereToFindIt.toLowerCase().includes(q)
    );
  });

  const filterButtons: Array<{ id: ScamCategoryFilter; label: string }> = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'PAYMENTS', label: 'Payments & UPI' },
    { id: 'MESSAGES', label: 'Messages & Phishing' },
    { id: 'CALLS', label: 'Phone Calls & Vishing' },
    { id: 'ACCOUNTS', label: 'Accounts & KYC' },
    { id: 'IDENTITY', label: 'Identity & Coercion' },
    { id: 'INVESTMENT', label: 'Investment & Tasks' },
    { id: 'SHOPPING', label: 'Shopping & Delivery' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in">
      
      {/* Top Handbook Header */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
          NIVARAN CYBER FRAUD REFERENCE SUITE &bull; PRACTICAL SAFETY HANDBOOK
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          Learn &amp; Prevent Financial Cybercrime
        </h1>
        <p className="text-sm text-text-secondary max-w-3xl leading-relaxed font-sans">
          A structured, practical reference handbook covering 20 scam categories, 2D progress flows, warning sign decoders, pre-payment checklists, and banking terminology walkthroughs.
        </p>
      </div>

      {/* Emergency Quick-Response Bridge Banner */}
      <div className="p-4 rounded-card-lg bg-brand-red-soft border border-brand-red/30 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-brand-red text-white flex items-center justify-center shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="text-xs font-bold font-mono text-brand-red uppercase">
              ALREADY MADE A SUSPICIOUS PAYMENT?
            </div>
            <div className="text-xs text-text-primary font-sans font-medium">
              Do not spend time reading — start emergency case preparation and notify 1930 immediately.
            </div>
          </div>
        </div>

        <button
          onClick={handleStartIncidentResponse}
          className="px-4 py-2 rounded-lg bg-brand-red hover:bg-red-700 text-white font-bold text-xs shadow-subtle transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <span>Start Incident Response</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Navigation Sub-Section Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-surface-border">
        {[
          { id: 'scams', label: '20 Scam Categories', icon: BookOpen },
          { id: 'red_flags', label: 'Red Flag Decoder', icon: AlertTriangle },
          { id: 'before_pay', label: 'Before You Pay (10s Checklist)', icon: FileCheck },
          { id: 'after_pay', label: 'Already Paid?', icon: ShieldAlert },
          { id: 'evidence_guide', label: 'What Evidence to Keep', icon: Layers },
          { id: 'terminology', label: 'Financial Fraud Terminology', icon: FileText },
          { id: 'confusions', label: 'Common Confusions & Myths', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainSection(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-surface border-t border-x border-surface-border text-brand-primary font-bold shadow-subtle -mb-px'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-brand-primary' : 'text-text-muted'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: 20 SCAM CATEGORIES (Interactive Structured Reference Rows)   */}
      {/* ========================================================================= */}
      {activeMainSection === 'scams' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Search Bar & Category Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scams, terms, scripts or warning signs (e.g. OTP, electricity, AnyDesk, QR, refund)..."
                className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary outline-none shadow-subtle"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted hover:text-text-primary"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {filterButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveCategoryFilter(btn.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategoryFilter === btn.id
                      ? 'bg-brand-primary text-white font-semibold shadow-subtle'
                      : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Structured Reference Accordion Rows (Based on Reference Layout) */}
          <div className="rounded-card-lg bg-surface border border-surface-border shadow-card overflow-hidden divide-y divide-surface-border">
            
            {filteredScams.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted font-mono">
                No scam categories matched your search &ldquo;{searchQuery}&rdquo;. Try another term.
              </div>
            ) : (
              filteredScams.map((scam) => {
                const isExpanded = expandedScamId === scam.id;

                return (
                  <div
                    key={scam.id}
                    className={`transition-colors duration-150 ${
                      isExpanded ? 'bg-brand-soft/30' : 'bg-surface hover:bg-surface-subtle/50'
                    }`}
                  >
                    {/* Header Row Button */}
                    <button
                      onClick={() => setExpandedScamId(isExpanded ? null : scam.id)}
                      aria-expanded={isExpanded}
                      className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus:bg-brand-soft/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <span className="font-mono text-xs font-bold text-text-muted shrink-0 w-6">
                          {scam.numberIndex < 10 ? `0${scam.numberIndex}` : scam.numberIndex}.
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-base font-bold text-text-primary tracking-tight truncate font-sans">
                            {scam.title}
                          </h2>
                          <div className="text-xs text-text-muted font-mono mt-0.5">
                            {scam.categoryDisplay}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        <div className={`p-1 rounded-md transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-primary' : 'text-text-muted'}`}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </button>

                    {/* Expanded Rich Content Panel */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-surface-border/60 space-y-6 animate-in fade-in duration-150">
                        
                        {/* 1. What It Is */}
                        <div className="space-y-1">
                          <div className="text-[11px] font-mono font-bold uppercase text-brand-primary">
                            WHAT IT IS
                          </div>
                          <p className="text-sm text-text-primary leading-relaxed font-sans">
                            {scam.whatItIs}
                          </p>
                        </div>

                        {/* 2. How the Scam Progresses (2D Step Flow) */}
                        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2.5">
                          <div className="text-[11px] font-mono font-bold uppercase text-text-primary flex items-center gap-1.5">
                            <TrendingUp size={13} className="text-brand-primary" />
                            <span>HOW THE SCAM PROGRESSES (2D STEP FLOW)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1 text-xs">
                            {scam.progressFlow.map((step, idx) => (
                              <div key={idx} className="relative p-2.5 rounded bg-surface-subtle border border-surface-border flex flex-col justify-between">
                                <div>
                                  <div className="font-mono text-[10px] text-brand-primary font-bold">
                                    STEP {idx + 1}
                                  </div>
                                  <div className="font-bold text-text-primary text-xs mt-0.5">
                                    {step.label}
                                  </div>
                                </div>
                                {step.subtext && (
                                  <div className="text-[10px] text-text-muted mt-1 leading-tight font-sans">
                                    {step.subtext}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. Two-Column Details (Starts & Scripts vs Red Flags & Demands) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                          
                          {/* Column A: How it starts & What they say */}
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="font-mono font-bold text-text-primary uppercase text-[11px]">
                                HOW IT USUALLY STARTS
                              </div>
                              <ul className="space-y-1.5 text-text-secondary pl-1 font-sans">
                                {scam.howItStarts.map((h, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-1.5">
                              <div className="font-mono font-bold text-text-primary uppercase text-[11px]">
                                WHAT THE ATTACKER MAY SAY
                              </div>
                              <div className="space-y-2">
                                {scam.attackerMaySay.map((quote, i) => (
                                  <div key={i} className="p-3 rounded-lg bg-surface border-l-2 border-brand-amber text-text-primary font-mono text-[11px] leading-relaxed">
                                    {quote}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Column B: Red Flags & What they ask for */}
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="font-mono font-bold text-brand-red uppercase text-[11px]">
                                RED FLAGS
                              </div>
                              <ul className="space-y-1.5 text-text-secondary pl-1 font-sans">
                                {scam.redFlags.map((rf, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <AlertTriangle size={13} className="text-brand-red mt-0.5 shrink-0" />
                                    <span>{rf}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-1.5">
                              <div className="font-mono font-bold text-text-primary uppercase text-[11px]">
                                WHAT THEY MAY ASK FOR
                              </div>
                              <ul className="space-y-1.5 text-text-secondary pl-1 font-sans">
                                {scam.whatTheyMayAskFor.map((req, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted mt-1.5 shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                        </div>

                        {/* 4. What To Do (Action Checklist) */}
                        <div className="space-y-2 pt-2 border-t border-surface-border/60">
                          <div className="font-mono font-bold text-brand-green uppercase text-[11px]">
                            WHAT TO DO (PROTECTION STEPS)
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                            {scam.whatToDo.map((step, i) => (
                              <div key={i} className="p-2.5 rounded bg-surface border border-surface-border flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-brand-green mt-0.5 shrink-0" />
                                <span className="text-text-primary">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 5. Direct Action & Tool Bridges */}
                        <div className="p-4 rounded-lg bg-surface border border-brand-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                          <div className="text-xs space-y-0.5">
                            <div className="font-bold text-text-primary">
                              IF YOU ALREADY PAID OR SHARED CREDENTIALS:
                            </div>
                            <div className="text-text-muted text-[11px]">
                              Generate an emergency case dossier and initiate the 1930 Golden Hour freeze process.
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {scam.relatedTool && (
                              <button
                                onClick={() => setActiveTab('tools')}
                                className="px-3.5 py-2 rounded-lg bg-surface hover:bg-surface-elevated text-brand-primary border border-brand-primary/30 font-semibold text-xs transition-colors flex items-center gap-1.5"
                              >
                                <Zap size={13} />
                                <span>{scam.relatedTool.label}</span>
                              </button>
                            )}

                            <button
                              onClick={handleStartIncidentResponse}
                              className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle transition-colors flex items-center gap-1.5"
                            >
                              <span>Go to Nivaran Incident Response</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: RED FLAG DECODER                                               */}
      {/* ========================================================================= */}
      {activeMainSection === 'red_flags' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div>
            <div className="text-xs font-mono font-bold text-brand-primary uppercase">
              INTERACTIVE DECISION ASSISTANT
            </div>
            <h2 className="text-2xl font-display font-extrabold text-text-primary mt-0.5">
              Red Flag Decoder
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Select something you recently encountered to instantly decode what is happening and what not to do.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {RED_FLAG_DECODER_DATABASE.map((item) => {
              const isSelected = selectedRedFlagId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedRedFlagId(item.id)}
                  className={`p-3 rounded-lg text-left transition-all border font-medium ${
                    isSelected
                      ? 'bg-brand-soft border-brand-primary text-brand-primary font-bold shadow-subtle'
                      : 'bg-surface-subtle border-surface-border text-text-primary hover:border-surface-border-active'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-text-muted mb-0.5">{item.category}</div>
                  <div>{item.scenario}</div>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Detail Card */}
          {(() => {
            const activeScenario = RED_FLAG_DECODER_DATABASE.find(s => s.id === selectedRedFlagId) || RED_FLAG_DECODER_DATABASE[0];
            return (
              <div className="p-5 rounded-lg bg-surface-elevated border border-brand-primary/30 space-y-4 pt-4 border-t">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-brand-primary uppercase font-bold">DECODED SCENARIO:</div>
                  <h3 className="text-base font-bold text-text-primary">{activeScenario.scenario}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1">
                    <div className="font-bold text-text-primary uppercase font-mono text-[10px]">WHY THIS MATTERS:</div>
                    <p className="text-text-secondary leading-relaxed font-sans">{activeScenario.whyThisMatters}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1">
                    <div className="font-bold text-text-primary uppercase font-mono text-[10px]">WHAT MAY BE HAPPENING:</div>
                    <p className="text-text-secondary leading-relaxed font-sans">{activeScenario.whatMayBeHappening}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 space-y-1 text-brand-red">
                    <div className="font-bold uppercase font-mono text-[10px] flex items-center gap-1.5">
                      <AlertCircle size={13} />
                      <span>WHAT NOT TO DO:</span>
                    </div>
                    <p className="leading-relaxed font-sans text-xs">{activeScenario.whatNotToDo}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-brand-green-soft border border-brand-green/30 space-y-1 text-brand-green">
                    <div className="font-bold uppercase font-mono text-[10px] flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      <span>WHAT TO DO INSTEAD:</span>
                    </div>
                    <p className="leading-relaxed font-sans text-xs">{activeScenario.whatToDoInstead}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('tools')}
                    className="px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold text-xs shadow-subtle hover:bg-brand-hover transition-colors flex items-center gap-1.5"
                  >
                    <Zap size={14} />
                    <span>Test this identifier in Nivaran Toolkit</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: BEFORE YOU PAY (10-Second Safety Checklist)                    */}
      {/* ========================================================================= */}
      {activeMainSection === 'before_pay' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div>
            <div className="text-xs font-mono font-bold text-brand-primary uppercase">
              10-SECOND SAFETY UTILITY
            </div>
            <h2 className="text-2xl font-display font-extrabold text-text-primary mt-0.5">
              Before You Pay Checklist
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Review these 7 quick checkpoints before approving any payment or entering your UPI PIN.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {BEFORE_YOU_PAY_CHECKLIST.map((item, idx) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheckbox(item.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                    isChecked
                      ? 'bg-brand-green-soft/50 border-brand-green/30 text-text-primary'
                      : 'bg-surface-subtle border-surface-border text-text-secondary hover:border-surface-border-active'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded flex items-center justify-center border transition-colors ${
                      isChecked
                        ? 'bg-brand-green border-brand-green text-white'
                        : 'border-surface-border bg-surface'
                    }`}
                  >
                    {isChecked && <Check size={13} />}
                  </div>
                  <span className="font-medium text-xs flex-1">
                    {idx + 1}. {item.question}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-lg bg-surface-elevated border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-text-primary">Still unsure about a UPI ID, Phone Number or QR Code?</div>
              <div className="text-[11px] text-text-muted">Use Nivaran&apos;s pre-payment check tools to inspect potential signals.</div>
            </div>

            <button
              onClick={() => setActiveTab('tools')}
              className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Zap size={14} />
              <span>Open Payment Toolkit</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ALREADY MADE THE PAYMENT? (Quick Response)                     */}
      {/* ========================================================================= */}
      {activeMainSection === 'after_pay' && (
        <div className="p-6 rounded-card-lg bg-surface border border-brand-red/35 shadow-card space-y-6 animate-in fade-in">
          <div>
            <div className="text-xs font-mono font-bold text-brand-red uppercase">
              EMERGENCY ACTION PROTOCOL
            </div>
            <h2 className="text-2xl font-display font-extrabold text-text-primary mt-0.5">
              Already Made the Payment?
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Follow these 5 immediate response steps to maximize your chances of inter-bank fund recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
              <div className="font-mono font-bold text-brand-primary">1. STOP FURTHER TRANSFERS</div>
              <p className="text-text-secondary leading-relaxed font-sans">
                Cease communication with the caller immediately. Do not pay additional &ldquo;cancellation&rdquo; or &ldquo;tax&rdquo; fees.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
              <div className="font-mono font-bold text-brand-primary">2. CALL 1930 WITHIN GOLDEN HOUR</div>
              <p className="text-text-secondary leading-relaxed font-sans">
                Dial 1930 immediately. State your Bank, 12-digit UTR, Disputed Amount, and Recipient UPI ID.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
              <div className="font-mono font-bold text-brand-primary">3. NOTIFY BANK FRAUD CELL</div>
              <p className="text-text-secondary leading-relaxed font-sans">
                Call your bank fraud hotline within 3 days to preserve your rights under the RBI Zero-Liability framework.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
              <div className="font-mono font-bold text-brand-primary">4. PRESERVE SCREENSHOTS &amp; SMS</div>
              <p className="text-text-secondary leading-relaxed font-sans">
                Save the 12-digit UTR receipt, bank SMS, and export the WhatsApp conversation without media.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-brand-primary text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
            <div>
              <div className="font-bold text-sm">Step 5: Create Your Structured NIVARAN Case Dossier</div>
              <div className="text-xs text-white/80 mt-0.5 font-sans">
                Nivaran organizes evidence, extracts parameters, and prepares your bank notice &amp; NCRP filing package.
              </div>
            </div>

            <button
              onClick={handleStartIncidentResponse}
              className="px-5 py-2.5 rounded-lg bg-white text-brand-primary hover:bg-slate-100 font-bold text-xs shadow transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Start Incident Response</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: WHAT EVIDENCE SHOULD YOU KEEP? (12 Artifacts Guide)            */}
      {/* ========================================================================= */}
      {activeMainSection === 'evidence_guide' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div>
            <div className="text-xs font-mono font-bold text-brand-primary uppercase">
              EVIDENCE PRESERVATION HANDBOOK
            </div>
            <h2 className="text-2xl font-display font-extrabold text-text-primary mt-0.5">
              What Evidence Should You Keep?
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              A comprehensive guide on what digital artifacts to preserve, where to find them, and how to save them for official legal filing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {EVIDENCE_PRESERVATION_GUIDE.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-text-primary text-sm font-sans">{ev.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-surface border border-surface-border text-text-muted">
                      {ev.category}
                    </span>
                  </div>

                  <p className="text-text-secondary leading-relaxed font-sans pt-1">
                    <strong className="text-text-primary font-mono text-[11px] block">WHY IT MATTERS:</strong>
                    {ev.whyItMatters}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-surface-border/60 text-[11px]">
                  <div>
                    <span className="text-text-muted font-mono uppercase block text-[10px]">Where to find it:</span>
                    <span className="text-text-primary font-sans">{ev.whereToFindIt}</span>
                  </div>
                  <div>
                    <span className="text-text-muted font-mono uppercase block text-[10px]">How to save it:</span>
                    <span className="text-brand-primary font-sans font-medium">{ev.howToSaveIt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: FINANCIAL FRAUD TERMINOLOGY (21 Terms + Walkthroughs)          */}
      {/* ========================================================================= */}
      {activeMainSection === 'terminology' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div>
            <div className="text-xs font-mono font-bold text-brand-primary uppercase">
              PLAIN ENGLISH GLOSSARY &amp; MINIATURE WALKTHROUGHS
            </div>
            <h2 className="text-2xl font-display font-extrabold text-text-primary mt-0.5">
              Financial Fraud Terminology
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Clear, practical explanations of key banking terms, why Nivaran needs them, and where to find them across popular payment applications.
            </p>
          </div>

          {/* Terminology Accordion Rows */}
          <div className="rounded-lg bg-surface border border-surface-border overflow-hidden divide-y divide-surface-border">
            {filteredTerminology.map((term) => {
              const isExpanded = expandedTermId === term.id;
              const activeApp = selectedAppWalkthrough[term.id] || (term.appWalkthrough?.[0]?.appName);

              return (
                <div
                  key={term.id}
                  className={`transition-colors duration-150 ${
                    isExpanded ? 'bg-brand-soft/30' : 'bg-surface hover:bg-surface-subtle/50'
                  }`}
                >
                  <button
                    onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left focus:outline-none focus:bg-brand-soft/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-text-muted w-5">
                        {term.numberIndex}.
                      </span>
                      <h3 className="text-sm font-bold text-text-primary font-sans">
                        {term.term}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
                        {isExpanded ? 'Hide guide' : 'View guide'}
                      </span>
                      <div className={`p-1 rounded-md transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-primary' : 'text-text-muted'}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-surface-border/60 space-y-4 text-xs font-sans animate-in fade-in">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="font-mono font-bold text-text-primary uppercase text-[10px]">
                            WHAT IT MEANS
                          </div>
                          <p className="text-text-secondary leading-relaxed">
                            {term.shortWhatItMeans}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="font-mono font-bold text-brand-primary uppercase text-[10px]">
                            WHY NIVARAN NEEDS IT
                          </div>
                          <p className="text-text-secondary leading-relaxed">
                            {term.whyNivaranNeedsIt}
                          </p>
                        </div>
                      </div>

                      {/* Where to find it general */}
                      <div className="p-3 rounded-lg bg-surface border border-surface-border">
                        <span className="font-mono font-bold text-text-primary uppercase text-[10px] block mb-0.5">
                          WHERE TO FIND IT:
                        </span>
                        <p className="text-text-secondary">{term.whereToFindIt}</p>
                      </div>

                      {/* Miniature App Walkthroughs (Google Pay, PhonePe, Paytm, etc.) */}
                      {term.appWalkthrough && term.appWalkthrough.length > 0 && (
                        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-text-primary">
                            <span>LOOK FOR A FIELD LABELLED SIMILAR TO:</span>
                            <span className="text-text-muted">App Navigation Guide</span>
                          </div>

                          {/* App selector tabs */}
                          <div className="flex flex-wrap gap-1.5">
                            {term.appWalkthrough.map((walk) => (
                              <button
                                key={walk.appName}
                                onClick={() => setSelectedAppWalkthrough({ ...selectedAppWalkthrough, [term.id]: walk.appName })}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                                  activeApp === walk.appName
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-surface-subtle border border-surface-border text-text-secondary hover:text-text-primary'
                                }`}
                              >
                                {walk.appName}
                              </button>
                            ))}
                          </div>

                          {/* Active App Walkthrough Content */}
                          {(() => {
                            const currentWalk = term.appWalkthrough.find(w => w.appName === activeApp) || term.appWalkthrough[0];
                            return (
                              <div className="p-3 rounded bg-surface-subtle border border-surface-border space-y-2 text-xs">
                                <div className="font-mono font-bold text-brand-primary">
                                  {currentWalk.fieldLabelHint}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-text-secondary">
                                  {currentWalk.steps.map((st, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                      <span className="px-2 py-0.5 rounded bg-surface border border-surface-border">
                                        {st}
                                      </span>
                                      {sIdx < currentWalk.steps.length - 1 && <span className="text-text-muted">&rarr;</span>}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: COMMON CONFUSIONS & MYTH VS REALITY                           */}
      {/* ========================================================================= */}
      {activeMainSection === 'confusions' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-8 animate-in fade-in">
          
          {/* Subsection A: Common Confusions */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-brand-primary uppercase">
                CLARITY ON FREQUENT QUESTIONS
              </div>
              <h2 className="text-2xl font-display font-extrabold text-text-primary mt-0.5">
                Common Confusions
              </h2>
            </div>

            <div className="rounded-lg bg-surface border border-surface-border overflow-hidden divide-y divide-surface-border text-xs font-sans">
              {COMMON_CONFUSIONS_DATABASE.map((item) => {
                const isExpanded = expandedConfusionId === item.id;
                return (
                  <div key={item.id} className={isExpanded ? 'bg-brand-soft/20' : 'bg-surface'}>
                    <button
                      onClick={() => setExpandedConfusionId(isExpanded ? null : item.id)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-text-primary"
                    >
                      <span>{item.question}</span>
                      <div className={`p-1 rounded transition-transform ${isExpanded ? 'rotate-180 text-brand-primary' : 'text-text-muted'}`}>
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-4 pt-1 space-y-2 border-t border-surface-border/50 text-text-secondary leading-relaxed">
                        <p>{item.answer}</p>
                        <div className="p-2.5 rounded bg-surface border border-surface-border text-brand-primary font-mono text-[11px]">
                          <strong>Rule of Thumb:</strong> {item.practicalTip}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsection B: Myth vs Reality */}
          <div className="space-y-4 pt-4 border-t border-surface-border">
            <div>
              <div className="text-xs font-mono font-bold text-brand-primary uppercase">
                MYTH BUSTERS
              </div>
              <h2 className="text-2xl font-display font-extrabold text-text-primary mt-0.5">
                Myth vs. Reality
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              {MYTH_VS_REALITY_DATABASE.map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3">
                  <div className="space-y-1">
                    <div className="font-mono font-bold text-brand-red uppercase text-[10px]">MYTH:</div>
                    <p className="font-semibold text-text-primary">{item.myth}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-surface-border/60">
                    <div className="font-mono font-bold text-brand-green uppercase text-[10px]">REALITY:</div>
                    <p className="text-text-secondary leading-relaxed">{item.reality}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
