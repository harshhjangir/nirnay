import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
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
          STEP 2 OF 5 &bull; INCIDENT STATEMENT
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Describe what happened
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Tell us the sequence of events in your own words. Plain human language is completely sufficient — NIVARAN extracts the technical parameters.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Narrative Textarea Card */}
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
'I received a call from someone claiming to be from my electricity board. They told me power will be cut tonight in 15 minutes unless I update my bill. They sent a WhatsApp link and asked me to enter my UPI PIN to authorize a 15-rupee verification credit. When I entered the PIN, ₹18,500 was debited...'"
          className="w-full bg-surface-subtle border border-surface-border rounded-lg p-4 text-sm text-text-primary placeholder:text-text-muted focus:bg-surface focus:border-brand-primary outline-none transition-all resize-y leading-relaxed font-sans"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted pt-1">
          <span className="flex items-center gap-1.5">
            <Info size={14} className="text-brand-blue shrink-0" />
            <span>You can write freely. NIVARAN will automatically structure dates, names, and VPAs.</span>
          </span>
        </div>
      </div>

      {/* Live Preliminary Classification Callout */}
      {textValue.trim().length >= 15 && (
        <div className="p-5 rounded-card bg-surface-elevated border border-brand-primary/25 space-y-3 animate-in fade-in shadow-subtle">
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

          <div className="space-y-1 text-xs text-text-secondary pt-1">
            <div className="font-semibold text-text-primary">Why:</div>
            <ul className="space-y-1 pl-1">
              {liveAnalysis.reasonFactors.slice(0, 3).map((factor, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 text-[11px] text-text-muted border-t border-surface-border/50">
            * This is an automated preliminary assessment to guide evidence gathering. It does not represent a final judicial confirmation.
          </div>
        </div>
      )}

      {/* Step Navigation Actions */}
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
