import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  CheckCircle2,
  Edit2,
  FileCheck,
  FileText,
  Shield,
  ShieldCheck,
  User
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { SensitiveDataMask } from '../common/SensitiveDataMask';

export const ReviewSubmission: React.FC = () => {
  const {
    draftIncident,
    setIntakeStep,
    submitNewCaseFromDraft
  } = useIncident();

  const [confirmedDeclaration, setConfirmedDeclaration] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalAmount = draftIncident.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedDeclaration) {
      setErrorMsg('Please check the confirmation declaration before submitting your incident.');
      return;
    }

    setErrorMsg(null);
    const createdCaseId = submitNewCaseFromDraft();
    // Move to step 6 (success)
    setIntakeStep(6);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 5 OF 5 &bull; REVIEW & VERIFICATION
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Review Case Information
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Verify all recorded details before final submission. Once submitted, an official NIVARAN Case ID will be generated for 1930 and NCRP filing.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Incident Description */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <FileText size={15} className="text-brand-primary" />
            <span>1. Incident Classification & Statement</span>
          </div>
          <button
            type="button"
            onClick={() => setIntakeStep(2)}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-text-muted">Category:</span>
            <span className="font-bold text-text-primary uppercase font-mono">
              {draftIncident.category.replace('_', ' ')}
            </span>
          </div>
          <div className="bg-surface-subtle p-3.5 rounded-lg border border-surface-border leading-relaxed text-text-primary whitespace-pre-wrap font-sans">
            {draftIncident.whatHappenedSummary || 'No written narrative provided.'}
          </div>
        </div>
      </div>

      {/* Section 2: Disputed Financial Transactions */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <ShieldCheck size={15} className="text-brand-primary" />
            <span>2. Disputed Transactions (Total: ₹{totalAmount.toLocaleString('en-IN')})</span>
          </div>
          <button
            type="button"
            onClick={() => setIntakeStep(3)}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>

        {draftIncident.transactions.length === 0 ? (
          <p className="text-xs text-text-muted">No transactions logged.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-border text-text-muted bg-surface-subtle">
                  <th className="py-2 px-3">Date/Time</th>
                  <th className="py-2 px-3">Debited Bank</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Recipient Identifier</th>
                  <th className="py-2 px-3">12-Digit UTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {draftIncident.transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2.5 px-3 text-text-muted">{tx.timestamp}</td>
                    <td className="py-2.5 px-3 text-text-primary font-semibold">{tx.senderBank}</td>
                    <td className="py-2.5 px-3 font-bold text-brand-red">₹{tx.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3">
                      <SensitiveDataMask value={tx.recipientUpiOrAcc} type="upi" />
                    </td>
                    <td className="py-2.5 px-3 font-bold text-text-primary">{tx.utrNumber || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Attached Evidence Index */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <FileCheck size={15} className="text-brand-primary" />
            <span>3. Evidence Artifacts ({draftIncident.evidence.length})</span>
          </div>
          <button
            type="button"
            onClick={() => setIntakeStep(4)}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>

        {draftIncident.evidence.length === 0 ? (
          <p className="text-xs text-text-muted">No evidence files attached.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {draftIncident.evidence.map((ev, i) => (
              <div key={ev.id} className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between">
                <span className="truncate pr-2">[{i + 1}] {ev.title}</span>
                <span className="text-brand-green font-semibold uppercase text-[11px] shrink-0">Attached ✓</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Complainant Identification */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <User size={15} className="text-brand-primary" />
            <span>4. Complainant Details</span>
          </div>
          <button
            type="button"
            onClick={() => setIntakeStep(3)}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-text-muted block">Name:</span>
            <span className="font-semibold text-text-primary">{draftIncident.complainant.name || 'Not Disclosed'}</span>
          </div>
          <div>
            <span className="text-text-muted block">Phone:</span>
            <span className="font-semibold text-text-primary font-mono">{draftIncident.complainant.phone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-text-muted block">City:</span>
            <span className="font-semibold text-text-primary">{draftIncident.complainant.city || 'N/A'}</span>
          </div>
          <div>
            <span className="text-text-muted block">State:</span>
            <span className="font-semibold text-text-primary">{draftIncident.complainant.state || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Legal Declaration Checkbox */}
      <div className="p-4 rounded-card bg-brand-soft/50 border border-brand-primary/20 space-y-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmedDeclaration}
            onChange={(e) => setConfirmedDeclaration(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
          />
          <span className="text-xs text-text-primary leading-relaxed">
            By submitting, you confirm that the information provided is accurate to the best of your knowledge and will be formatted into an official Case Dossier for 1930, Bank Fraud Units, and NCRP cybercrime.gov.in reporting.
          </span>
        </label>
      </div>

      {/* Step Navigation Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => setIntakeStep(4)}
          className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Evidence</span>
        </button>

        <button
          type="submit"
          className="px-7 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm transition-colors shadow-card flex items-center gap-2"
        >
          <Check size={16} />
          <span>Submit Incident & Generate Dossier</span>
        </button>
      </div>
    </form>
  );
};
