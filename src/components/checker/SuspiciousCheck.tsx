import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Info,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { checkSuspiciousIdentifier } from '../../services/identifierCheckEngine';
import { IdentifierCheckResult } from '../../types';

export const SuspiciousCheck: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<IdentifierCheckResult | null>(() => {
    return checkSuspiciousIdentifier('discom.billupdate.982@okaxis');
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = checkSuspiciousIdentifier(query);
    setResult(res);
  };

  const sampleQueries = [
    { label: 'Fake Utility UPI', value: 'discom.billupdate.982@okaxis' },
    { label: 'Phishing APK Link', value: 'http://bescom-bill-update.xyz/download.apk' },
    { label: 'Suspect Phone Number', value: '+91 70192 84920' },
    { label: 'Customer Care VPA', value: 'airtel.support.kyc@ybl' },
    { label: 'Normal Personal UPI', value: 'rajesh.sharma@oksbi' }
  ];

  const handleSampleClick = (val: string) => {
    setQuery(val);
    setResult(checkSuspiciousIdentifier(val));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          PRE-PAYMENT RISK EVALUATOR &bull; VERIFICATION ENGINE
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          Check Before You Pay
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
          Evaluate unfamiliar UPI handles, phone numbers, payment links, and bank accounts against known fraud structures and impersonation patterns.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="p-6 rounded-card-lg bg-surface border border-surface-border space-y-4 shadow-card">
        <label className="block text-xs font-bold text-text-primary uppercase tracking-wide">
          Enter UPI Handle, Phone Number, Bank Account, or Website Link:
        </label>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3.5 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. discom.billupdate.982@okaxis, 7019284920, or https://suspicious-link.xyz"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-mono focus:border-brand-primary outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center justify-center gap-2 shrink-0"
          >
            <span>Analyze Identifier</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-text-muted font-mono text-[11px]">Test with sample:</span>
          {sampleQueries.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSampleClick(s.value)}
              className="px-2.5 py-1 rounded bg-surface-subtle hover:bg-surface-elevated border border-surface-border text-text-secondary hover:text-text-primary font-mono text-[11px] transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Main Verdict Card */}
          <div className={`p-6 rounded-card-lg border shadow-card ${
            result.verdict === 'HIGH_RISK_ALERT'
              ? 'bg-surface border-brand-red/40'
              : result.verdict === 'POTENTIAL_RISK_SIGNALS'
              ? 'bg-surface border-brand-amber/40'
              : 'bg-surface border-surface-border'
          }`}>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-text-muted uppercase">EVALUATING IDENTIFIER:</span>
                  <span className="text-text-primary font-bold">{result.query}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-subtle text-text-muted uppercase text-[10px]">
                    {(result.type || result.identifierType || 'identifier').replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  {result.verdictTitle || result.threatLevelDisplay || 'Identifier Evaluation'}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-text-muted uppercase block">Risk Score</span>
                  <span className={`text-2xl font-black ${
                    (result.riskScore ?? 50) >= 70 ? 'text-brand-red' : (result.riskScore ?? 50) >= 40 ? 'text-brand-amber' : 'text-brand-green'
                  }`}>
                    {result.riskScore ?? 50}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Signals Breakdown */}
            <div className="py-5 space-y-3">
              <div className="text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
                Identified Pattern & Structural Signals:
              </div>

              {result.signals.length === 0 ? (
                <div className="p-3.5 rounded-lg bg-surface-subtle text-xs text-text-secondary">
                  No abnormal risk signals detected for this standard format.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.signals.map((sig: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                        sig.type === 'critical'
                          ? 'bg-brand-red-soft border-brand-red/30 text-brand-red'
                          : sig.type === 'warning'
                          ? 'bg-brand-amber-soft border-brand-amber/30 text-brand-amber'
                          : 'bg-surface-subtle border-surface-border text-text-secondary'
                      }`}
                    >
                      {sig.type === 'critical' ? (
                        <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                      ) : sig.type === 'warning' ? (
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      ) : (
                        <Info size={16} className="shrink-0 mt-0.5 text-brand-blue" />
                      )}
                      <div className="text-xs space-y-0.5">
                        <div className="font-bold font-mono">{sig.label}</div>
                        <div className="text-text-secondary leading-relaxed font-sans">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Safety Action Guidance */}
            <div className="pt-4 border-t border-surface-border/60 space-y-2">
              <div className="text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
                Procedural Safety Guidance:
              </div>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {result.guidance.map((g: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-brand-green shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Uncertainty & Responsibility Disclaimer */}
          <div className="p-4 rounded-card bg-surface-elevated border border-surface-border text-xs text-text-muted flex items-start gap-2.5 shadow-subtle">
            <Info size={16} className="text-brand-blue shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              <strong className="text-text-secondary font-mono">Probabilistic Transparency:</strong> {result.disclaimer || 'Identifier evaluation is based on known scam patterns and client-side heuristics.'}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
