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
  FolderPlus,
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
      setErrorMsg('Please check the confirmation declaration before building your fraud case.');
      return;
    }

    setErrorMsg(null);
    const createdCaseId = submitNewCaseFromDraft();
    setIntakeStep(6);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 5 OF 5 &bull; VERIFY &amp; BUILD CASE
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Review Case Information
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Verify all extracted and confirmed details. Nivaran will structure this into your continuous fraud case record.
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
            <span>1. Incident Classification &amp; Statement</span>
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
            <span className="text-text-muted font-mono">Category:</span>
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
            <span>2. Extracted &amp; Confirmed Transactions (Total: ₹{totalAmount.toLocaleString('en-IN')})</span>
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
          <div className="text-xs text-text-muted italic py-2">
            No transactions entered yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {draftIncident.transactions.map((tx, idx) => (
              <div key={tx.id || idx} className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-text-muted px-2 py-0.5 rounded bg-surface border border-surface-border">
                    {tx.paymentApp} &bull; {tx.paymentMethod}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-text-secondary pt-1">
                  <div>
                    <span className="text-text-muted">Originating Bank: </span>
                    <span className="text-text-primary font-semibold">{tx.senderBank}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Recipient VPA: </span>
                    <SensitiveDataMask value={tx.recipientUpiOrAcc} type="upi" />
                  </div>
                  <div>
                    <span className="text-text-muted">12-Digit UTR: </span>
                    <span className="text-text-primary font-bold">{tx.utrNumber || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Source: </span>
                    <span className="text-brand-primary font-semibold">{tx.source || 'OCR EXTRACTED'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Evidence Artifacts */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <FileCheck size={15} className="text-brand-primary" />
            <span>3. Attached Evidence Documents ({draftIncident.evidence.length})</span>
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
          <div className="text-xs text-text-muted italic py-1">
            No additional evidence items attached.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {draftIncident.evidence.map((ev, i) => (
              <div key={ev.id || i} className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between">
                <div className="truncate pr-2">
                  <div className="font-semibold text-text-primary truncate">{ev.title}</div>
                  <div className="text-[10px] text-text-muted font-mono">{ev.source}</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-green-soft text-brand-green font-mono font-bold shrink-0">
                  Verified
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Complainant Details */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <User size={15} className="text-brand-primary" />
            <span>4. Complainant Information</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <span className="text-[11px] text-text-muted block">Full Name</span>
            <span className="font-bold text-text-primary font-sans">{draftIncident.complainant.name || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-[11px] text-text-muted block">Mobile Number</span>
            <span className="font-semibold text-text-primary">{draftIncident.complainant.phone || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-[11px] text-text-muted block">Location</span>
            <span className="font-semibold text-text-primary">{draftIncident.complainant.city}, {draftIncident.complainant.state}</span>
          </div>
        </div>
      </div>

      {/* Citizen Declaration Checkbox */}
      <div className="p-4 rounded-card bg-brand-soft/50 border border-brand-primary/20 space-y-2">
        <label className="flex items-start gap-3 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={confirmedDeclaration}
            onChange={(e) => setConfirmedDeclaration(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded text-brand-primary border-surface-border focus:ring-brand-primary"
          />
          <span className="text-text-secondary leading-relaxed font-sans">
            I confirm that the evidence and transaction parameters provided are truthful records to be organized into my Nivaran fraud case intelligence file.
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => setIntakeStep(4)}
          className="px-4 py-2.5 rounded-lg border border-surface-border hover:bg-surface-subtle text-text-primary font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Evidence Upload</span>
        </button>

        <button
          type="submit"
          disabled={!confirmedDeclaration}
          className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-card flex items-center gap-2"
        >
          <FolderPlus size={15} />
          <span>Build My Case Dossier</span>
        </button>
      </div>
    </form>
  );
};
