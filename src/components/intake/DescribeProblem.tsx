import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  FolderOpen,
  HelpCircle,
  Info,
  ShieldAlert,
  Sparkles,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { analyzeIncident } from '../../services/incidentAnalysisEngine';
import { FraudCategory } from '../../types';

export const DescribeProblem: React.FC = () => {
  const { draftIncident, updateDraft, setIntakeStep } = useIncident();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textValue = draftIncident.whatHappenedSummary || '';
  const charCount = textValue.length;
  const maxChars = 2000;

  // Test Case Presets for quick selection (User requirement #9)
  const testCasePresets: { label: string; category: FraudCategory; text: string }[] = [
    {
      label: '⚡ Electricity Bill Threat (₹18,500)',
      category: 'upi_fraud',
      text: 'I received an urgent call at 10:15 AM from +91 70192 84920 claiming to be a state electricity board (BESCOM) official. He stated my electricity connection would be disconnected at 11:00 AM due to an unpaid bill and instructed me to pay a ₹15 verification charge on Google Pay. When I authorized the payment, ₹18,500 was debited to VPA discom.billupdate.982@okaxis with UTR 423719820491.'
    },
    {
      label: '📞 Fake Airline Helpdesk (₹7,200)',
      category: 'fake_customer_care',
      text: 'I searched for airline flight customer support on Google and called the number +91 91203 94812. The agent asked me to open PhonePe to receive my flight refund. He sent a UPI collect request of ₹7,200 and told me to enter my PIN to accept the credit. The money was deducted from my SBI account instead.'
    },
    {
      label: '💼 Telegram Task Rating Scam (₹65,000)',
      category: 'investment_fraud',
      text: 'I was added to a Telegram group offering part-time daily income for rating hotels on Google Maps. I initially deposited ₹5,000 and received ₹6,500 back. Then for VIP Level 3 tasks, I made two UPI transfers of ₹30,000 and ₹35,000 to merchant accounts. When I attempted to withdraw my balance, withdrawals were frozen.'
    },
    {
      label: '⚖️ Digital Arrest / Customs Coercion',
      category: 'digital_arrest',
      text: 'Received an automated call stating a parcel in my name was seized by Mumbai Customs containing passports and narcotics. Transferred to a caller claiming to be a CBI Inspector on Skype video call. Under extreme fear of immediate arrest, I transferred funds to a verification escrow account.'
    }
  ];

  const handleApplyPreset = (preset: { category: FraudCategory; text: string }) => {
    updateDraft({
      category: preset.category,
      whatHappenedSummary: preset.text
    });
    setErrorMsg(null);
  };

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
    } else if (lower.includes('telegram') || lower.includes('hotel') || lower.includes('task') || lower.includes('rating')) {
      signals.push({ label: 'Deception Mechanism', value: 'Telegram Part-Time Rating Task Fraud' });
    }

    if (lower.includes('15') || lower.includes('10') || lower.includes('nominal') || lower.includes('verification')) {
      signals.push({ label: 'Modus Operandi', value: 'Nominal verification payment bait' });
    }

    if (lower.includes('15 minute') || lower.includes('tonight') || lower.includes('urgent') || lower.includes('immediately')) {
      signals.push({ label: 'Psychological Trigger', value: 'Artificial deadline urgency' });
    }

    if (lower.includes('collect') || lower.includes('pin to accept') || lower.includes('phonepe')) {
      signals.push({ label: 'Technical Vector', value: 'UPI Collect Request deception' });
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
      setErrorMsg('Please describe what happened before continuing. A few sentences or selecting a preset is sufficient.');
      return;
    }
    setErrorMsg(null);
    setIntakeStep(3);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 2 OF 5 &bull; INCIDENT STATEMENT &amp; PATTERN EXTRACTION
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Describe what happened
        </h2>
        <p className="text-sm text-text-secondary mt-1 font-sans">
          Tell us the sequence of events in your own words, or choose a test case preset below to pre-fill realistic parameters.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Manual Test Case Presets Selector (Specification requirement) */}
      <div className="p-4 rounded-card bg-surface border border-surface-border shadow-subtle space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-text-primary uppercase flex items-center gap-1.5">
            <Sparkles size={13} className="text-brand-primary" />
            <span>Select a Test Scenario Preset:</span>
          </span>
          <span className="text-[10px] font-mono text-text-muted">1-Click Auto-Fill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {testCasePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-2.5 rounded-lg bg-surface-subtle hover:bg-brand-soft border border-surface-border hover:border-brand-primary/40 text-left transition-all text-xs flex items-center justify-between group"
            >
              <span className="font-bold text-text-primary group-hover:text-brand-primary truncate">
                {preset.label}
              </span>
              <span className="text-[10px] font-mono text-brand-primary uppercase font-bold shrink-0 ml-2">
                Use Preset &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Written Narrative Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wide">
            Your Narrative Statement *
          </label>
          <span className="text-[11px] font-mono text-text-muted">
            {charCount} / {maxChars} characters
          </span>
        </div>

        <textarea
          rows={6}
          value={textValue}
          onChange={handleTextChange}
          placeholder="e.g. I received a phone call claiming my electricity bill was overdue. They asked me to transfer ₹15 verification fee via Google Pay, but ₹18,500 was debited instead..."
          className="w-full bg-surface border border-surface-border rounded-lg p-4 text-xs text-text-primary placeholder:text-text-muted font-sans leading-relaxed focus:border-brand-primary outline-none shadow-subtle"
          required
        />
      </div>

      {/* Extracted Modus Operandi Signals Preview */}
      {extractedSignals.length > 0 && (
        <div className="p-4 rounded-card bg-surface-subtle border border-surface-border space-y-2 text-xs animate-in fade-in">
          <div className="text-[11px] font-mono font-bold text-brand-primary uppercase flex items-center gap-1.5">
            <Zap size={13} />
            <span>Nivaran Extracted Scam Factors:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
            {extractedSignals.map((sig, i) => (
              <div key={i} className="p-2 rounded bg-surface border border-surface-border">
                <span className="text-text-muted text-[10px] block">{sig.label}:</span>
                <span className="font-bold text-text-primary">{sig.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => setIntakeStep(1)}
          className="px-4 py-2.5 rounded-lg border border-surface-border hover:bg-surface-subtle text-text-primary font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Category</span>
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
        >
          <span>Continue to Evidence &amp; Extraction</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
};
