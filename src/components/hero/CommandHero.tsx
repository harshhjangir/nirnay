import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Clock,
  ExternalLink,
  FileCheck,
  PhoneCall,
  Search,
  Shield,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { SensitiveDataMask } from '../common/SensitiveDataMask';
import { RiskBadge } from '../common/Badge';

export const CommandHero: React.FC = () => {
  const { setActiveTab, setIntakeStep, activeCase, selectCase } = useIncident();

  return (
    <section className="relative pt-10 pb-16 overflow-hidden border-b border-surface-border bg-bg-primary bg-civic-grid">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Mission & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* System Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft border border-brand-primary/20 text-xs font-semibold tracking-wide text-brand-primary">
              <Shield size={14} />
              <span>NIVARAN &bull; Financial Fraud Response</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5.5xl font-display font-extrabold text-text-primary tracking-tight leading-[1.15]">
              Lost money to a digital fraud? <br />
              <span className="text-brand-primary">
                Know what to do next.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
              NIVARAN helps you understand what happened, secure the situation, organize digital evidence, and prepare the exact structured information needed for official reporting to <strong className="text-text-primary font-semibold">1930</strong>, the <strong className="text-text-primary font-semibold">National Cyber Crime Portal (NCRP)</strong>, and your bank.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  setIntakeStep(1);
                  setActiveTab('intake');
                }}
                className="px-6 py-3.5 rounded-lg text-sm font-bold bg-brand-primary hover:bg-brand-hover text-white transition-all shadow-card flex items-center gap-2 focus:ring-2 focus:ring-brand-primary"
              >
                <span>Report an Incident</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setActiveTab('track_case')}
                className="px-5 py-3.5 rounded-lg text-sm font-semibold bg-surface hover:bg-surface-elevated text-text-primary border border-surface-border transition-colors flex items-center gap-2 shadow-subtle"
              >
                <Search size={15} className="text-brand-blue" />
                <span>Track My Case</span>
              </button>
            </div>

            {/* Trust Footnote */}
            <div className="pt-2 flex items-start gap-2.5 text-xs text-text-muted max-w-xl">
              <ShieldCheck size={16} className="text-brand-primary shrink-0 mt-0.5" />
              <span>
                <strong>Zero-delay emergency triage.</strong> Designed to maximize the bank freeze success rate during the critical initial 2-hour golden window.
              </span>
            </div>
          </div>

          {/* Right Column: Clean 2D Institutional Case Card */}
          <div className="lg:col-span-5">
            <div className="rounded-card-lg bg-surface border border-surface-border shadow-card overflow-hidden">
              
              {/* Card Top Header */}
              <div className="px-5 py-3.5 border-b border-surface-border bg-surface-elevated flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-brand-red animate-pulse" />
                  <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                    CASE RESPONSE SUMMARY
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-brand-primary">
                  {activeCase.caseId}
                </span>
              </div>

              {/* Card Data Content */}
              <div className="p-5 space-y-4 text-xs">
                
                {/* Metric 1: Risk & Category */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-surface-border">
                  <div>
                    <span className="text-[11px] text-text-muted uppercase font-medium block mb-1">
                      Assessed Risk Level
                    </span>
                    <RiskBadge level={activeCase.analysis.riskLevel} size="sm" />
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted uppercase font-medium block mb-1">
                      Detected Pattern
                    </span>
                    <span className="text-text-primary font-bold truncate block">
                      {activeCase.analysis.likelyType}
                    </span>
                  </div>
                </div>

                {/* Metric 2: Amount & Window */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-surface-border">
                  <div>
                    <span className="text-[11px] text-text-muted uppercase font-medium block mb-1">
                      Disputed Loss
                    </span>
                    <span className="text-xl font-bold font-mono text-brand-red">
                      ₹{activeCase.transactions.reduce((s, tx) => s + (tx.amount || 0), 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted uppercase font-medium block mb-1">
                      Triage Window
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-amber font-semibold font-mono">
                      <Clock size={13} />
                      Golden Hour Active
                    </span>
                  </div>
                </div>

                {/* Metric 3: Account & Recipient */}
                {activeCase.transactions[0] && (
                  <div className="bg-surface-subtle p-3 rounded-lg border border-surface-border space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Debiting Bank:</span>
                      <span className="text-text-primary font-semibold">{activeCase.transactions[0].senderBank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Beneficiary VPA:</span>
                      <SensitiveDataMask value={activeCase.transactions[0].recipientUpiOrAcc} type="upi" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Transaction UTR:</span>
                      <span className="text-text-primary font-bold">{activeCase.transactions[0].utrNumber}</span>
                    </div>
                  </div>
                )}

                {/* Next Action Box */}
                <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-brand-red font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle size={13} />
                      IMMEDIATE ACTION RECOMMENDED
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <div>
                      <div className="text-[11px] text-text-secondary">Primary Next Step:</div>
                      <div className="text-sm font-bold text-brand-red flex items-center gap-1 mt-0.5 font-mono">
                        <PhoneCall size={14} />
                        DIAL 1930 HELPLINE
                      </div>
                    </div>
                    <button
                      onClick={() => selectCase(activeCase.caseId)}
                      className="px-3 py-1.5 rounded-md bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-subtle"
                    >
                      View Case Dossier &rarr;
                    </button>
                  </div>
                </div>

                {/* Evidence Checklist Progress */}
                <div className="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-surface-border">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileCheck size={14} className="text-brand-green" />
                    Evidence Dossier Items:
                  </span>
                  <span className="text-text-primary font-bold font-mono">
                    {activeCase.evidence.length} Artifacts Indexed
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
