import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileCheck,
  FileDown,
  FileText,
  HelpCircle,
  Info,
  PhoneCall,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { RiskBadge, StatusProgressBadge, UrgencyBadge } from '../common/Badge';
import { SensitiveDataMask } from '../common/SensitiveDataMask';
import { exportCaseJson, generateCasePdf } from '../../services/pdfGenerator';
import { Modal } from '../common/Modal';

export const CaseDetailsView: React.FC = () => {
  const { activeCase, setActiveTab, toggleActionStatus } = useIncident();
  const [bankLetterModalOpen, setBankLetterModalOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const totalAmount = activeCase.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);
  const primaryTx = activeCase.transactions[0];

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(key);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const bankLetterText = `To,
The Branch Manager / Nodal Officer (Fraud Control Unit),
${primaryTx?.senderBank || 'State Bank of India'},

Subject: Formal Notice of Unauthorized Cyber Fraud Debit (Disputed Amount: INR ${totalAmount.toLocaleString('en-IN')}) under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18

Respected Sir/Madam,

I, ${activeCase.complainant.name || 'Citizen Complainant'}, residing at ${activeCase.complainant.city || 'City'}, ${activeCase.complainant.state || 'State'}, hold Account Number ending in ${primaryTx?.senderAccountMasked || 'XXXX'} at your esteemed bank.

I am formally notifying the bank of an unauthorized digital fraud debit that took place on ${primaryTx?.timestamp || '24-AUG-2026'}.

TRANSACTION DETAILS:
• Disputed Amount: INR ${totalAmount.toLocaleString('en-IN')}
• 12-Digit UTR / NPCI Reference: ${primaryTx?.utrNumber || '423719820491'}
• Beneficiary UPI / Account: ${primaryTx?.recipientUpiOrAcc || 'discom.billupdate.982@okaxis'}
• Mode: ${primaryTx?.paymentMethod || 'UPI'} via ${primaryTx?.paymentApp || 'Google Pay'}
• NIVARAN Case Identifier: ${activeCase.caseId}

INCIDENT NARRATIVE:
${activeCase.whatHappenedSummary}

In accordance with the RBI Circular on Limiting Customer Liability in Unauthorized Electronic Banking Transactions, I am notifying the bank within the initial window.

I request you to:
1. Issue an immediate recall memo (RRN Recall) to the beneficiary bank through the NPCI/I4C network.
2. Provide a formal Fraud Complaint Acknowledgement Number for my records.
3. Temporarily secure my digital banking channels.

Yours sincerely,
${activeCase.complainant.name || 'Citizen Complainant'}
Contact: ${activeCase.complainant.phone || '+91 98451 92837'}
Date: ${new Date().toLocaleDateString('en-IN')}
`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors self-start"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => generateCasePdf(activeCase)}
            className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <FileDown size={14} />
            <span>Download PDF Dossier</span>
          </button>

          <button
            onClick={() => exportCaseJson(activeCase)}
            className="px-3.5 py-2 rounded-lg bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Download size={13} />
            <span>JSON</span>
          </button>

          <button
            onClick={() => setBankLetterModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <FileText size={13} />
            <span>Bank Dispute Notice</span>
          </button>
        </div>
      </div>

      {/* Case Header Strip */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
              <span>CASE IDENTIFIER</span>
              <span>&bull;</span>
              <span className="text-text-muted">Registered {new Date(activeCase.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight flex items-center gap-3">
              <span>CASE {activeCase.caseId}</span>
            </h1>
            <div className="text-sm font-semibold text-text-secondary">
              {activeCase.analysis.likelyType}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-left md:text-right font-mono">
              <span className="text-[10px] text-text-muted uppercase block">Disputed Loss</span>
              <span className="text-2xl font-black text-brand-red">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <StatusProgressBadge status={activeCase.statusProgress} />
              <RiskBadge level={activeCase.analysis.riskLevel} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: VISUAL STATUS PROGRESSION TIMELINE */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <Clock size={15} className="text-brand-primary" />
            <span>Case Resolution Progress</span>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Tracking status based on submitted case data
          </span>
        </div>

        {/* Step-by-Step Progress Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 font-mono text-xs">
          {activeCase.progressTimeline.map((step) => (
            <div
              key={step.step}
              className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 ${
                step.isCurrent
                  ? 'bg-brand-soft border-brand-primary shadow-subtle ring-1 ring-brand-primary/20'
                  : step.completed
                  ? 'bg-surface-elevated border-brand-green/30'
                  : 'bg-surface-subtle/50 border-surface-border opacity-55'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-bold">
                  0{step.step}
                </span>
                {step.completed ? (
                  <CheckCircle2 size={15} className="text-brand-green" />
                ) : step.isCurrent ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-primary text-white font-bold">
                    CURRENT
                  </span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-surface-border" />
                )}
              </div>

              <div>
                <div className={`text-xs font-bold font-sans ${step.isCurrent ? 'text-brand-primary' : 'text-text-primary'}`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  {step.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-text-muted flex items-start gap-2">
          <Info size={14} className="text-brand-blue shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-text-secondary">Official Inquiries:</strong> NIVARAN organizes your initial evidence and case package. The formal investigation is conducted under the 1930 (I4C) portal and your designated Bank Nodal Officer.
          </p>
        </div>
      </div>

      {/* SECTION 2: NEXT ACTION CALLOUT */}
      <div className="p-5 rounded-card-lg bg-brand-red-soft border border-brand-red/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-brand-red uppercase tracking-wide flex items-center gap-1.5">
            <ShieldAlert size={14} />
            CRITICAL NEXT STEP RECOMMENDED
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text-primary">
            Contact your bank and ensure the official 1930 complaint reference is attached.
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            Notify {primaryTx?.senderBank || 'your bank'} that an unauthorized debit of ₹{totalAmount.toLocaleString('en-IN')} with UTR {primaryTx?.utrNumber || '423719820491'} occurred.
          </p>
        </div>

        {/* Word-for-Word Script */}
        <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span className="font-bold text-text-primary">1930 / Bank Operator Talking Script:</span>
            <button
              onClick={() => copyText('script', `Hello, I am reporting an unauthorized financial fraud of Rs ${totalAmount} from my ${primaryTx?.senderBank} account. Transaction UTR is ${primaryTx?.utrNumber}. Beneficiary handle is ${primaryTx?.recipientUpiOrAcc}. Please record an emergency lien under I4C.`)}
              className="text-brand-primary hover:underline flex items-center gap-1"
            >
              {copiedScript === 'script' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedScript === 'script' ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>
          <p className="text-text-primary italic font-sans leading-relaxed text-xs">
            &ldquo;Hello, I am reporting an unauthorized financial fraud of ₹{totalAmount.toLocaleString('en-IN')} from my {primaryTx?.senderBank || 'bank'} account. Transaction UTR is {primaryTx?.utrNumber || '423719820491'}. Beneficiary handle is {primaryTx?.recipientUpiOrAcc || 'suspect@upi'}. Please record an emergency lien under I4C.&rdquo;
          </p>
        </div>
      </div>

      {/* SECTION 3: TRANSACTION & EVIDENCE DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Disputed Transaction Box */}
        <div className="p-5 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
            <h3 className="text-xs font-mono font-bold text-text-primary uppercase">
              Disputed Transactions ({activeCase.transactions.length})
            </h3>
            <span className="text-xs font-mono text-brand-red font-bold">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {activeCase.transactions.map((tx) => (
              <div key={tx.id} className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">Debit Bank:</span>
                  <span className="text-text-primary font-semibold">{tx.senderBank} (*{tx.senderAccountMasked})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Beneficiary VPA:</span>
                  <SensitiveDataMask value={tx.recipientUpiOrAcc} type="upi" />
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">12-Digit UTR:</span>
                  <span className="text-text-primary font-bold">{tx.utrNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Artifacts Box */}
        <div className="p-5 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
            <h3 className="text-xs font-mono font-bold text-text-primary uppercase">
              Evidence Artifacts ({activeCase.evidence.length})
            </h3>
            <span className="text-xs font-mono text-brand-green font-bold">
              {activeCase.evidence.length} Verified
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {activeCase.evidence.map((ev, i) => (
              <div key={ev.id} className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="text-text-muted mr-1.5">[{i + 1}]</span>
                  <span className="text-text-primary font-semibold font-sans">{ev.title}</span>
                </div>
                <span className="text-brand-green text-[10px] uppercase font-bold shrink-0">
                  Verified ✓
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 4: OFFICIAL REPORTING HANDOFF */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase border-b border-surface-border/60 pb-3">
          <Building2 size={15} className="text-brand-primary" />
          <span>Official Reporting Channels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold text-brand-red uppercase">Step 1: Emergency Dial</div>
              <h4 className="text-xs font-bold text-text-primary">1930 Cyber Fraud Helpline</h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                Trigger beneficiary account lien under I4C network.
              </p>
            </div>
            <a
              href="tel:1930"
              className="py-2 text-center rounded-lg bg-brand-red text-white font-semibold text-xs shadow-subtle flex items-center justify-center gap-1.5"
            >
              <PhoneCall size={12} />
              <span>Call 1930</span>
            </a>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold text-brand-blue uppercase">Step 2: Formal Record</div>
              <h4 className="text-xs font-bold text-text-primary">cybercrime.gov.in (NCRP)</h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                Submit formal police acknowledgement report.
              </p>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-center rounded-lg bg-surface hover:bg-surface-elevated text-text-primary border border-surface-border font-semibold text-xs shadow-subtle flex items-center justify-center gap-1"
            >
              <span>Continue to NCRP</span>
              <ExternalLink size={12} className="text-text-muted" />
            </a>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold text-brand-amber uppercase">Step 3: Bank Claim</div>
              <h4 className="text-xs font-bold text-text-primary">Bank Branch Dispute Notice</h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                Submit RBI zero-liability dispute letter to branch manager.
              </p>
            </div>
            <button
              onClick={() => setBankLetterModalOpen(true)}
              className="py-2 text-center rounded-lg bg-surface hover:bg-surface-elevated text-text-primary border border-surface-border font-semibold text-xs shadow-subtle flex items-center justify-center gap-1"
            >
              <FileText size={12} className="text-brand-primary" />
              <span>View Letter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bank Dispute Notice Modal */}
      <Modal
        isOpen={bankLetterModalOpen}
        onClose={() => setBankLetterModalOpen(false)}
        title="Formal Bank Dispute Letter"
        subtitle="Formatted per RBI Guidelines on Customer Protection (Zero-Liability Window)"
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border font-mono text-xs text-text-primary whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
            {bankLetterText}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-surface-border">
            <span className="text-xs text-text-muted font-mono">
              Print or email this directly to your Bank Branch Manager.
            </span>
            <button
              onClick={() => copyText('bankLetter', bankLetterText)}
              className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle flex items-center gap-1.5"
            >
              {copiedScript === 'bankLetter' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedScript === 'bankLetter' ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
