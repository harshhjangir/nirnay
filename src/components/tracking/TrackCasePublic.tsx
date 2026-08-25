import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileDown,
  FileText,
  PhoneCall,
  Search,
  Shield,
  ShieldCheck,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { IncidentCase } from '../../types';
import { StatusProgressBadge, RiskBadge } from '../common/Badge';
import { generateCasePdf } from '../../services/pdfGenerator';
import { SensitiveDataMask } from '../common/SensitiveDataMask';

export const TrackCasePublic: React.FC = () => {
  const { findCaseForTracking, selectCase } = useIncident();

  const [caseIdInput, setCaseIdInput] = useState('NVR-2026-00124');
  const [contactInput, setContactInput] = useState('9845192837');
  const [searchedCase, setSearchedCase] = useState<IncidentCase | null>(() => {
    return findCaseForTracking('NVR-2026-00124', '9845192837');
  });
  const [hasSearched, setHasSearched] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseIdInput.trim()) {
      setSearchError('Please enter your NIVARAN Case ID (e.g. NVR-2026-00124).');
      return;
    }
    if (!contactInput.trim()) {
      setSearchError('Please enter the registered mobile number or email for verification.');
      return;
    }

    setSearchError(null);
    setHasSearched(true);
    const result = findCaseForTracking(caseIdInput.trim(), contactInput.trim());
    setSearchedCase(result);
  };

  const loadSample = (cId: string, phone: string) => {
    setCaseIdInput(cId);
    setContactInput(phone);
    setSearchError(null);
    setHasSearched(true);
    setSearchedCase(findCaseForTracking(cId, phone));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          PUBLIC CASE TRACKING &bull; STATUS VERIFICATION
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          Track an Incident Case
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
          Verify the current status, progress timeline, and bank escalation details for any case registered on the NIVARAN platform.
        </p>
      </div>

      {/* Search Box Card */}
      <form onSubmit={handleSearch} className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-4">
        {searchError && (
          <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span className="font-medium">{searchError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wide mb-1">
              NIVARAN Case Identifier *
            </label>
            <input
              type="text"
              value={caseIdInput}
              onChange={(e) => setCaseIdInput(e.target.value)}
              placeholder="e.g. NVR-2026-00124"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3.5 py-2.5 text-sm font-mono font-bold text-text-primary outline-none focus:border-brand-primary uppercase"
              required
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wide mb-1">
              Registered Mobile or Email *
            </label>
            <input
              type="text"
              value={contactInput}
              onChange={(e) => setContactInput(e.target.value)}
              placeholder="e.g. 9845192837 or rajesh@example.com"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand-primary font-mono"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-text-muted text-[11px] font-mono">Quick test:</span>
            <button
              type="button"
              onClick={() => loadSample('NVR-2026-00124', '9845192837')}
              className="px-2.5 py-1 rounded bg-surface-subtle hover:bg-surface-elevated border border-surface-border font-mono text-[11px] text-text-secondary"
            >
              Demo 1: NVR-2026-00124 (₹18.5k)
            </button>
            <button
              type="button"
              onClick={() => loadSample('NVR-2026-00089', '9820144819')}
              className="px-2.5 py-1 rounded bg-surface-subtle hover:bg-surface-elevated border border-surface-border font-mono text-[11px] text-text-secondary"
            >
              Demo 2: NVR-2026-00089 (₹7.2k)
            </button>
            <button
              type="button"
              onClick={() => loadSample('NVR-2026-00052', '9711239182')}
              className="px-2.5 py-1 rounded bg-surface-subtle hover:bg-surface-elevated border border-surface-border font-mono text-[11px] text-text-secondary"
            >
              Demo 3: NVR-2026-00052 (₹65k)
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center justify-center gap-2 shrink-0"
          >
            <Search size={14} />
            <span>Search Case Records</span>
          </button>
        </div>
      </form>

      {/* Results Container */}
      {hasSearched && searchedCase && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          
          {/* Header of Found Case */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <span>VERIFIED CASE RECORD FOUND</span>
              </div>
              <h2 className="text-2xl font-display font-extrabold text-text-primary">
                {searchedCase.caseId}
              </h2>
              <div className="text-xs font-semibold text-text-secondary">
                {searchedCase.analysis.likelyType}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusProgressBadge status={searchedCase.statusProgress} />
              <RiskBadge level={searchedCase.analysis.riskLevel} size="sm" />
            </div>
          </div>

          {/* Step Timeline Progress */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
              Investigation &amp; Escalation Timeline:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs font-mono">
              {searchedCase.progressTimeline.map((step) => (
                <div
                  key={step.step}
                  className={`p-3 rounded-lg border flex flex-col justify-between space-y-1.5 ${
                    step.isCurrent
                      ? 'bg-brand-soft border-brand-primary shadow-subtle ring-1 ring-brand-primary/20'
                      : step.completed
                      ? 'bg-surface-elevated border-brand-green/30'
                      : 'bg-surface-subtle/50 border-surface-border opacity-55'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-bold">0{step.step}</span>
                    {step.completed ? (
                      <CheckCircle2 size={13} className="text-brand-green" />
                    ) : step.isCurrent ? (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-brand-primary text-white font-bold">CURRENT</span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-surface-border" />
                    )}
                  </div>
                  <div>
                    <div className={`text-[11px] font-bold font-sans ${step.isCurrent ? 'text-brand-primary' : 'text-text-primary'}`}>
                      {step.label}
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">{step.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono bg-surface-subtle p-4 rounded-lg border border-surface-border">
            <div>
              <span className="text-text-muted text-[11px] uppercase block">Disputed Loss</span>
              <span className="text-base font-bold text-brand-red">
                ₹{searchedCase.transactions.reduce((s, tx) => s + (tx.amount || 0), 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-text-muted text-[11px] uppercase block">Debiting Bank</span>
              <span className="text-text-primary font-semibold">
                {searchedCase.transactions[0]?.senderBank || 'HDFC Bank'}
              </span>
            </div>
            <div>
              <span className="text-text-muted text-[11px] uppercase block">Beneficiary VPA</span>
              <SensitiveDataMask value={searchedCase.transactions[0]?.recipientUpiOrAcc || ''} type="upi" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border">
            <span className="text-xs text-text-muted font-mono">
              Last updated: {new Date(searchedCase.updatedAt).toLocaleDateString('en-IN')}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => generateCasePdf(searchedCase)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-elevated text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-subtle"
              >
                <FileDown size={14} />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => selectCase(searchedCase.caseId)}
                className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
              >
                <span>Open Full Case Dossier</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      )}

      {hasSearched && !searchedCase && (
        <div className="p-8 rounded-card-lg bg-surface border border-surface-border text-center space-y-2 shadow-subtle">
          <AlertCircle size={24} className="mx-auto text-brand-amber" />
          <h3 className="text-sm font-bold text-text-primary">No Matching Case Found</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            We could not find an incident matching Case ID <strong className="font-mono text-text-primary">{caseIdInput}</strong> and your contact details. Please check your reference code.
          </p>
        </div>
      )}
    </div>
  );
};
