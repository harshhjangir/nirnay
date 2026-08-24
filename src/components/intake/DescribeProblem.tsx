import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  HelpCircle,
  Info,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { analyzeIncident } from '../../services/incidentAnalysisEngine';

export const DescribeProblem: React.FC = () => {
  const { draftIncident, updateDraft, setIntakeStep } = useIncident();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textValue = draftIncident.whatHappenedSummary || '';
  const charCount = textValue.length;
  const maxChars = 2000;

  // Live preliminary heuristic analysis preview
  const liveAnalysis = analyzeIncident({
    category: draftIncident.category,
    whatHappened: textValue,
    transactions: draftIncident.transactions,
    evidence: draftIncident.evidence
  });

  // Extract Mentioned Entities from Text
  const extractMentionedSignals = (txt: string) => {
    const lower = txt.toLowerCase();
    const signals = [];

    if (lower.includes('electricity') || lower.includes('bescom') || lower.includes('power') || lower.includes('bill')) {
      signals.push({ label: 'Organization Impersonated', value: 'State Electricity Board / Utility DISCOM' });
    } else if (lower.includes('airline') || lower.includes('flight') || lower.includes('customercare') || lower.includes('refund')) {
      signals.push({ label: 'Service Claimed', value: 'Airline / Courier Customer Care Refund' });
    } else if (lower.includes('police') || lower.includes('customs') || lower.includes('cbi') || lower.includes('arrest')) {
      signals.push({ label: 'Authority Claimed', value: 'Law Enforcement / Digital Arrest Coercion' });
    }

    if (lower.includes('15') || lower.includes('10') || lower.includes('nominal') || lower.includes('verification')) {
      signals.push({ label: 'Deceptive Modus Operandi', value: 'Nominal ₹15 verification payment trick' });
    }

    if (lower.includes('15 minute') || lower.includes('tonight') || lower.includes('urgent') || lower.includes('immediately')) {
      signals.push({ label: 'Psychological Trigger', value: 'Artificial 15-minute deadline urgency' });
    }

    if (lower.includes('qr') || lower.includes('barcode') || lower.includes('scan')) {
      signals.push({ label: 'Technical Vector', value: 'QR Code / PIN for Credit Trick' });
    }

    if (lower.includes('anydesk') || lower.includes('quicksupport') || lower.includes('apk') || lower.includes('link')) {
      signals.push({ label: 'Device Vector', value: 'Malicious Link / Remote Screen-Sharing Tool' });
    }

    return signals;
  };

  const extractedSignals = extractMentionedSignals(textValue);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxChars) {
      updateDraft({ whatHappenedSummary: val });
      if (errorMsg && val.trim().length >= 10) {
        setErrorMsg(null);
      }
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textValue.trim() || textValue.trim().length < 10) {
      setErrorMsg('Please describe what happened before continuing. A few sentences are sufficient.');
      return;
    }
    setErrorMsg(null);
    setIntakeStep(3);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 2 OF 5 &bull; INCIDENT STATEMENT & NATURAL LANGUAGE EXTRACTION
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Describe what happened
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Tell us the sequence of events in your own words. You don&apos;t need to know legal or cybersecurity terms — NIVARAN will extract structured parameters for official reporting.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Narrative Textarea */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="incident-narrative" className="block text-xs font-bold text-text-primary uppercase tracking-wide">
            Your Incident Statement *
          </label>
          <span className={`font-mono text-xs ${charCount > maxChars * 0.9 ? 'text-brand-amber font-bold' : 'text-text-muted'}`}>
            {charCount} / {maxChars} characters
          </span>
        </div>

        <textarea
          id="incident-narrative"
          value={textValue}
          onChange={handleTextChange}
          rows={7}
          placeholder="Tell us what happened in your own words. For example:
'I received a call from someone saying they were from my electricity board. They told me power will be disconnected in 15 minutes unless I update my bill. They sent a WhatsApp link and asked me to enter my UPI PIN to approve a 15-rupee verification credit. When I entered the PIN, ₹18,500 was debited immediately...'"
          className="w-full bg-surface-subtle border border-surface-border rounded-lg p-4 text-sm text-text-primary placeholder:text-text-muted focus:bg-surface focus:border-brand-primary outline-none transition-all resize-y leading-relaxed font-sans"
        />

        <div className="flex items-center gap-1.5 text-xs text-text-muted pt-1">
          <Info size={14} className="text-brand-blue shrink-0" />
          <span>Write freely in plain language. Mention approximate amounts, phone numbers, and what the person asked you to do.</span>
        </div>
      </div>

      {/* Structured Extraction Preview */}
      {textValue.trim().length >= 15 && (
        <div className="p-5 rounded-card bg-surface-elevated border border-brand-primary/25 space-y-4 animate-in fade-in shadow-subtle">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-brand-primary" />
              <span className="text-xs font-mono font-bold text-text-primary uppercase">
                Preliminary Pattern Assessment
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-brand-primary bg-brand-soft px-2 py-0.5 rounded border border-brand-primary/20">
              Confidence: {liveAnalysis.confidence.toUpperCase()}
            </span>
          </div>

          <div>
            <div className="text-xs text-text-muted">Your description suggests:</div>
            <div className="text-sm font-bold text-text-primary mt-0.5">
              {liveAnalysis.likelyType}
            </div>
          </div>

          {/* Mentioned Entities Extracted */}
          {extractedSignals.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-surface-border/50">
              <div className="text-[11px] font-mono text-text-muted uppercase">Extracted Case Signals:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {extractedSignals.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-surface border border-surface-border space-y-0.5">
                    <span className="text-text-muted text-[10px] uppercase block">{s.label}</span>
                    <span className="font-bold text-text-primary">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Factors */}
          <div className="space-y-1 text-xs text-text-secondary pt-1">
            <div className="font-semibold text-text-primary font-sans">Why this pattern was identified:</div>
            <ul className="space-y-1 pl-1">
              {liveAnalysis.reasonFactors.slice(0, 3).map((factor, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 text-[11px] text-text-muted font-sans border-t border-surface-border/50">
            * This is an automated preliminary pattern assessment to organize evidence. It does not represent judicial confirmation.
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => setIntakeStep(1)}
          className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Category</span>
        </button>

        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-2"
        >
          <span>Continue to Transaction Details</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
};
