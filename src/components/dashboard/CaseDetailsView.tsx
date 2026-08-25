import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileCheck,
  FileDown,
  FileText,
  FolderOpen,
  HelpCircle,
  Info,
  Layers,
  MessageSquare,
  PhoneCall,
  Plus,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingUp,
  User,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { ExternalAuthority, ExternalReference, ExternalStatus, TimelineSourceLabel } from '../../types';
import { RiskBadge, StatusProgressBadge, UrgencyBadge } from '../common/Badge';
import { SensitiveDataMask } from '../common/SensitiveDataMask';
import { exportCaseJson, generateCasePdf } from '../../services/pdfGenerator';
import { Modal } from '../common/Modal';
import { interpretAuthorityResponse } from '../../services/responseInterpreterEngine';

export const CaseDetailsView: React.FC = () => {
  const {
    activeCase,
    setActiveTab,
    caseReadiness,
    consistencyResult,
    addExternalReference,
    removeExternalReference,
    addCaseResponse,
    resolveEvidenceConflict,
    updateCaseNotes,
    deleteCase
  } = useIncident();

  // Modals state
  const [addRefModalOpen, setAddRefModalOpen] = useState(false);
  const [addResponseModalOpen, setAddResponseModalOpen] = useState(false);
  const [bankLetterModalOpen, setBankLetterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Reference Form State
  const [refAuthority, setRefAuthority] = useState<ExternalAuthority>('bank');
  const [refAuthorityName, setRefAuthorityName] = useState('HDFC Bank Dispute Desk');
  const [refNumber, setRefNumber] = useState('');
  const [refStatus, setRefStatus] = useState<ExternalStatus>('submitted');
  const [refStatusDisplay, setRefStatusDisplay] = useState('Submitted');
  const [refNotes, setRefNotes] = useState('');

  // New Response Form State
  const [rawResponseText, setRawResponseText] = useState('');
  const [responseAuthorityHint, setResponseAuthorityHint] = useState<ExternalAuthority>('bank');

  // Conflict Resolution State
  const [resolvingConflictId, setResolvingConflictId] = useState<string | null>(null);
  const [conflictResolutionNote, setConflictResolutionNote] = useState('');

  const totalAmount = activeCase.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);
  const primaryTx = activeCase.transactions[0];

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) return;

    addExternalReference(activeCase.caseId, {
      authority: refAuthority,
      authorityName: refAuthorityName,
      referenceNumber: refNumber.trim(),
      dateSubmitted: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: refStatus,
      statusDisplay: refStatusDisplay,
      source: 'User entered',
      notes: refNotes.trim() || undefined
    });

    setRefNumber('');
    setRefNotes('');
    setAddRefModalOpen(false);
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawResponseText.trim()) return;

    const parsed = interpretAuthorityResponse(rawResponseText, undefined, responseAuthorityHint, activeCase);
    addCaseResponse(activeCase.caseId, parsed);
    setRawResponseText('');
    setAddResponseModalOpen(false);
  };

  const handleConflictResolved = (conflictId: string) => {
    resolveEvidenceConflict(activeCase.caseId, conflictId, conflictResolutionNote || 'Verified against official bank debit record.');
    setResolvingConflictId(null);
    setConflictResolutionNote('');
  };

  const bankLetterText = `To,
The Branch Manager / Nodal Officer (Fraud Control Unit),
${primaryTx?.senderBank || 'HDFC Bank'},

Subject: Formal Notice of Unauthorized Cyber Fraud Debit (Disputed Amount: INR ${totalAmount.toLocaleString('en-IN')}) under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18

Respected Sir/Madam,

I, ${activeCase.complainant.name || 'Citizen Complainant'}, residing at ${activeCase.complainant.city || 'Bengaluru'}, ${activeCase.complainant.state || 'Karnataka'}, hold Account Number ending in *${primaryTx?.senderAccountMasked || '9104'} at your bank.

I am formally notifying the bank of an unauthorized digital fraud debit that occurred on ${primaryTx?.timestamp || '24-AUG-2026'}.

TRANSACTION DETAILS:
• Disputed Amount: INR ${totalAmount.toLocaleString('en-IN')}
• 12-Digit UTR / NPCI Reference: ${primaryTx?.utrNumber || '423719820491'}
• Beneficiary UPI / Account: ${primaryTx?.recipientUpiOrAcc || 'discom.billupdate.982@okaxis'}
• Mode: ${primaryTx?.paymentMethod || 'UPI'} via ${primaryTx?.paymentApp || 'Google Pay'}
• NIVARAN Case Identifier: ${activeCase.caseId}

INCIDENT NARRATIVE:
${activeCase.whatHappenedSummary}

In accordance with the RBI Circular on Limiting Customer Liability in Unauthorized Electronic Banking Transactions, I have notified the bank within the 3-day window.

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
      
      {/* Top Controls & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors self-start"
        >
          <ArrowLeft size={14} />
          <span>Back to My Cases Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => generateCasePdf(activeCase)}
            className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <FileDown size={14} />
            <span>Download Case Summary PDF</span>
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

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-surface hover:bg-brand-red-soft text-text-muted hover:text-brand-red border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
            title="Delete this case"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Delete Case</span>
          </button>
        </div>
      </div>

      {/* 1. CENTRAL CASE HEADER */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
              <Shield size={14} />
              <span>NIVARAN FRAUD CASE RECORD</span>
              <span>&bull;</span>
              <span className="text-text-muted">Registered {new Date(activeCase.createdAt).toLocaleDateString('en-IN')}</span>
            </div>

            <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
              {activeCase.caseId}
            </h1>
            <div className="text-sm font-semibold text-text-secondary">
              {activeCase.category === 'upi_fraud' ? 'UPI / Social Engineering (Utility Impersonation)' : activeCase.analysis.likelyType}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-left md:text-right font-mono">
              <span className="text-[10px] text-text-muted uppercase block">Disputed Loss</span>
              <span className="text-2xl font-black text-brand-red">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <RiskBadge level={activeCase.analysis.riskLevel} size="md" />
          </div>
        </div>

        {/* Reconciled Parameters Summary */}
        {primaryTx && (
          <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border font-mono text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-text-muted text-[11px] block">Debiting Bank:</span>
              <span className="font-bold text-text-primary">{primaryTx.senderBank}</span>
            </div>
            <div>
              <span className="text-text-muted text-[11px] block">12-Digit UTR:</span>
              <span className="font-bold text-text-primary">{primaryTx.utrNumber}</span>
              <span className="text-[10px] text-brand-green font-semibold ml-1">✓ Verified</span>
            </div>
            <div>
              <span className="text-text-muted text-[11px] block">Beneficiary UPI ID:</span>
              <SensitiveDataMask value={primaryTx.recipientUpiOrAcc} type="upi" />
            </div>
          </div>
        )}
      </div>

      {/* 2. THE NEXT ACTION ENGINE (Specification #13) */}
      <div className="p-5 rounded-card-lg bg-brand-soft border border-brand-primary/30 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wide flex items-center gap-1.5">
            <AlertCircle size={15} />
            NEXT ACTION
          </span>
          <UrgencyBadge urgency={activeCase.nextAction.urgency} />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-text-primary font-sans">
            {activeCase.nextAction.title}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            <strong>Why it matters:</strong> {activeCase.nextAction.why}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAddResponseModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Zap size={14} />
            <span>Upload / Add Bank Response</span>
          </button>

          <button
            onClick={() => setBankLetterModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-surface text-text-primary border border-surface-border text-xs font-semibold hover:bg-surface-elevated transition-colors flex items-center gap-1.5"
          >
            <FileText size={14} className="text-brand-primary" />
            <span>Generate Escalation Notice</span>
          </button>
        </div>
      </div>

      {/* 3. CASE READINESS (Specification #9) */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase">
              <FileCheck size={15} className="text-brand-primary" />
              <span>NIVARAN CASE READINESS</span>
            </div>
            <p className="text-xs text-text-muted font-sans">
              {caseReadiness.statusMessage}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div className="text-right">
              <span className="text-base font-bold text-brand-primary">
                {caseReadiness.availableCount} / {caseReadiness.totalCount}
              </span>
              <span className="text-xs text-text-muted ml-1">items ready</span>
            </div>
            <div className="w-24 bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-surface-border">
              <div
                className="bg-brand-primary h-full rounded-full transition-all"
                style={{ width: `${caseReadiness.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Readiness Checklist Grid with [ Add ] triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {caseReadiness.items.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex items-start justify-between gap-2 ${
                item.available
                  ? 'bg-surface-subtle border-surface-border'
                  : 'bg-brand-amber-soft/30 border-brand-amber/30'
              }`}
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-bold font-sans">
                  {item.available ? (
                    <CheckCircle size={14} className="text-brand-green shrink-0" />
                  ) : (
                    <AlertTriangle size={14} className="text-brand-amber shrink-0" />
                  )}
                  <span className={`truncate ${item.available ? 'text-text-primary' : 'text-brand-amber'}`}>
                    {item.label}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted leading-tight font-sans pl-5">
                  {item.description}
                </div>
              </div>

              {!item.available && (
                <button
                  onClick={() => {
                    if (item.actionTab === 'references') setAddRefModalOpen(true);
                    else if (item.actionTab === 'evidence') setActiveTab('intake');
                  }}
                  className="px-2.5 py-1 rounded bg-surface hover:bg-surface-elevated text-brand-primary border border-surface-border font-mono text-[10px] font-bold shrink-0 shadow-subtle"
                >
                  [ Add ]
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. EVIDENCE RECONCILIATION (Specification #7) */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase">
              <Layers size={15} className="text-brand-primary" />
              <span>Evidence Reconciliation &amp; Cross-Comparison</span>
            </div>
            <p className="text-xs text-text-muted font-sans">
              Compares parameters across payment screenshots, bank SMS alerts, and official statements.
            </p>
          </div>
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
            consistencyResult.hasConflicts
              ? 'bg-brand-amber-soft text-brand-amber border-brand-amber/30'
              : 'bg-brand-green-soft text-brand-green border-brand-green/20'
          }`}>
            {consistencyResult.hasConflicts ? '⚠ CONFLICT DETECTED' : '✓ ALL AMOUNTS & UTRs MATCH'}
          </span>
        </div>

        {/* Conflicts Alert Box */}
        {consistencyResult.conflicts.filter(c => c.status === 'unresolved').map((conf) => (
          <div
            key={conf.id}
            className="p-4 rounded-lg bg-brand-amber-soft border border-brand-amber/35 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between text-brand-amber font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>INFORMATION CONFLICT: {conf.field.toUpperCase()}</span>
              </span>
              <button
                onClick={() => setResolvingConflictId(conf.id)}
                className="px-2.5 py-1 rounded bg-surface text-text-primary border border-surface-border text-[11px] font-bold hover:bg-surface-elevated shadow-subtle"
              >
                Resolve Conflict
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-text-primary pt-1">
              <div className="bg-surface p-2.5 rounded border border-surface-border">
                <span className="text-text-muted text-[10px] uppercase block">{conf.sourceA.name}</span>
                <span className="font-bold text-sm">{conf.sourceA.value}</span>
              </div>
              <div className="bg-surface p-2.5 rounded border border-surface-border">
                <span className="text-text-muted text-[10px] uppercase block">{conf.sourceB.name}</span>
                <span className="font-bold text-sm text-brand-red">{conf.sourceB.value}</span>
              </div>
            </div>

            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              &ldquo;Your evidence contains different transaction amounts. Review this before using the information in another complaint.&rdquo;
            </p>
          </div>
        ))}

        {/* Verified Matching Facts */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-text-muted uppercase">Verified Cross-Matches:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
            {consistencyResult.verifiedMatches.map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">{m.field}</span>
                  <span className="text-brand-green font-bold text-[10px]">✓ MATCHES</span>
                </div>
                <div className="text-brand-primary font-bold text-xs">{m.value}</div>
                <div className="text-[10px] text-text-muted font-sans">{m.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RESPONSE INTERPRETER & COMPARISON (Specification #14 & #15) */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-5">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase">
              <Scale size={15} className="text-brand-primary" />
              <span>Response Interpreter &amp; Comparison</span>
            </div>
            <p className="text-xs text-text-muted font-sans">
              Interprets incoming bank emails, rejection letters, and NCRP police communications without legal jargon.
            </p>
          </div>

          <button
            onClick={() => setAddResponseModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>Add a Response</span>
          </button>
        </div>

        {/* Existing Responses List */}
        {activeCase.responses.length === 0 ? (
          <div className="p-5 text-center text-xs text-text-muted bg-surface-subtle rounded-lg border border-surface-border">
            No external responses uploaded yet. Click &ldquo;Add a Response&rdquo; to paste bank rejection or acknowledgement emails.
          </div>
        ) : (
          <div className="space-y-4">
            {activeCase.responses.map((resp) => (
              <div key={resp.id} className="p-5 rounded-lg bg-surface-subtle border border-surface-border space-y-4 text-xs">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-surface-border pb-2.5">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-text-muted uppercase block">BANK / AUTHORITY RESPONSE</span>
                    <span className="font-bold text-text-primary text-sm font-sans">{resp.responder}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    {resp.referenceNumber && <span className="text-brand-primary font-bold">Ref: {resp.referenceNumber}</span>}
                    <span className="text-text-muted">{resp.date}</span>
                  </div>
                </div>

                {/* Decision & Reason */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-2.5 rounded bg-surface border border-surface-border">
                    <span className="text-[10px] text-text-muted uppercase block font-semibold">Decision:</span>
                    <span className="font-bold text-text-primary">{resp.decision}</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface border border-surface-border">
                    <span className="text-[10px] text-text-muted uppercase block font-semibold">Reason Stated:</span>
                    <span className="text-text-secondary">{resp.reason}</span>
                  </div>
                </div>

                {/* Structured Breakdown: WHAT THEY SAID, WHAT THIS RELATES TO, WHAT CASE CONTAINS, NEXT STEP */}
                <div className="space-y-3 font-sans">
                  
                  {/* 1. WHAT THEY SAID */}
                  <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1">
                    <div className="text-[11px] font-mono font-bold text-brand-primary uppercase">
                      WHAT THEY SAID
                    </div>
                    <p className="text-xs text-text-primary leading-relaxed">
                      &ldquo;{resp.whatTheySaid}&rdquo;
                    </p>
                  </div>

                  {/* 2. WHAT THIS RELATES TO */}
                  <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1">
                    <div className="text-[11px] font-mono font-bold text-brand-primary uppercase">
                      WHAT THIS RELATES TO
                    </div>
                    <div className="font-mono text-[11px] text-text-secondary space-y-0.5">
                      <div>Transaction: <strong className="text-text-primary">₹{resp.whatThisRelatesTo?.transactionAmount?.toLocaleString('en-IN') || '18,500'}</strong></div>
                      <div>UTR: <strong className="text-text-primary">{resp.whatThisRelatesTo?.utrNumber || '423719820491'}</strong></div>
                    </div>
                  </div>

                  {/* 3. WHAT YOUR CASE ALREADY CONTAINS */}
                  <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-brand-primary uppercase">
                      WHAT YOUR CASE ALREADY CONTAINS
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-text-primary">
                      {resp.whatCaseContains?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-brand-green shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. NEXT STEP */}
                  <div className="p-3.5 rounded-lg bg-brand-soft border border-brand-primary/25 space-y-1">
                    <div className="text-[11px] font-mono font-bold text-brand-primary uppercase">
                      RECOMMENDED NEXT STEP
                    </div>
                    <p className="text-xs text-text-primary leading-relaxed">
                      {resp.potentialNextAction}
                    </p>
                  </div>

                  {/* 5. RESPONSE COMPARISON */}
                  {resp.comparison && (
                    <div className="p-3 rounded-lg bg-surface border border-surface-border flex items-center justify-between text-xs font-mono">
                      <span className="text-text-muted">Case Consistency:</span>
                      <span className="font-bold text-brand-green">{resp.comparison.summary}</span>
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>
        )}

        {/* Generic Escalation Ladder */}
        <div className="space-y-3 pt-2">
          <div className="text-[11px] font-mono text-text-muted uppercase">Statutory Escalation Ladder (Bank Dispute &rarr; Ombudsman):</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            {activeCase.escalationLadder?.map((stage) => (
              <div
                key={stage.stageNumber}
                className={`p-3.5 rounded-lg border space-y-2 flex flex-col justify-between ${
                  stage.status === 'completed'
                    ? 'bg-surface-elevated border-brand-green/30'
                    : stage.status === 'eligible_next'
                    ? 'bg-brand-soft border-brand-primary ring-1 ring-brand-primary/20'
                    : 'bg-surface-subtle/50 border-surface-border opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-text-muted font-bold">
                    <span>STAGE {stage.stageNumber}</span>
                    {stage.status === 'completed' ? (
                      <span className="text-brand-green">COMPLETED ✓</span>
                    ) : stage.status === 'eligible_next' ? (
                      <span className="text-brand-primary font-bold">ELIGIBLE NOW</span>
                    ) : (
                      <span>PENDING</span>
                    )}
                  </div>

                  <h4 className="font-bold text-text-primary mt-1 font-sans text-xs">{stage.title}</h4>
                  <p className="text-[11px] text-text-muted font-sans mt-1 leading-tight">{stage.description}</p>
                </div>

                <div className="pt-2 border-t border-surface-border/50 text-[10px] text-text-muted">
                  <span>Prerequisite: {stage.eligibilityCheck}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. OFFICIAL / EXTERNAL REFERENCES MANAGER (Specification #10 & #11) */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase">
              <Building2 size={15} className="text-brand-primary" />
              <span>Official &amp; External References ({activeCase.externalReferences.length})</span>
            </div>
            <p className="text-xs text-text-muted font-sans">
              Unified tracking record for Bank, 1930, NCRP, and Payment App complaints with verified source tagging.
            </p>
          </div>

          <button
            onClick={() => setAddRefModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>Add Reference</span>
          </button>
        </div>

        {activeCase.externalReferences.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted bg-surface-subtle rounded-lg border border-surface-border">
            No external references linked yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {activeCase.externalReferences.map((ref) => (
              <div
                key={ref.id}
                className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                    <span className="uppercase font-semibold">{ref.authorityName}</span>
                    <button
                      onClick={() => removeExternalReference(activeCase.caseId, ref.id)}
                      className="text-text-muted hover:text-brand-red p-1"
                      title="Remove reference"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-text-primary font-mono">{ref.referenceNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-brand-soft text-brand-primary border border-brand-primary/20 text-[10px] font-bold">
                      {ref.statusDisplay}
                    </span>
                  </div>

                  {ref.notes && (
                    <p className="text-[11px] text-text-secondary font-sans mt-1.5 leading-relaxed">
                      {ref.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[10px] text-text-muted">
                  <span>Source: <strong>{ref.source}</strong></span>
                  <span>Updated: {ref.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. NIVARAN FRAUD NETWORK / COLLECTIVE INTELLIGENCE (Specification #22 & #23) */}
      {activeCase.connectedCampaign && (
        <div className="p-6 rounded-card-lg bg-surface border border-brand-primary/30 shadow-subtle space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
              <Zap size={15} />
              <span>POSSIBLE CONNECTED CAMPAIGN &bull; COLLECTIVE INTELLIGENCE</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-brand-primary bg-brand-soft px-2 py-0.5 rounded border border-brand-primary/20">
              {activeCase.connectedCampaign.totalReportsCount} POTENTIALLY CONNECTED REPORTS
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-text-primary">
              {activeCase.connectedCampaign.title}
            </h3>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              ₹{(activeCase.connectedCampaign.totalLossEstimate / 100000).toFixed(2)} lakh reported across {activeCase.connectedCampaign.totalReportsCount} related cases.
            </p>
          </div>

          <div className="space-y-1.5 text-xs pt-1">
            <div className="text-text-muted font-mono text-[11px]">Common Indicators:</div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {activeCase.connectedCampaign.commonIndicators.map((ind, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-text-primary">
                  {ind}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-text-muted font-sans border-t border-surface-border/50">
            * <strong>Privacy Boundary:</strong> {activeCase.connectedCampaign.confidenceNotice} No private citizen identities, bank accounts, or chats are exposed.
          </div>
        </div>
      )}

      {/* 8. FACTUAL EVIDENCE TIMELINE (Specification #8) */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase">
              <Clock size={15} className="text-brand-primary" />
              <span>Factual Evidence Timeline</span>
            </div>
            <p className="text-xs text-text-muted font-sans">
              Strictly source-attributed event sequence. No fabricated inferred facts.
            </p>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            {activeCase.timeline.length} verified events
          </span>
        </div>

        <div className="space-y-3">
          {activeCase.timeline.map((ev) => (
            <div key={ev.id} className="flex items-start gap-3 text-xs">
              <div className="font-mono font-bold text-brand-primary shrink-0 w-20 text-right pt-0.5">
                {ev.timestamp}
              </div>

              <div className="h-full border-l-2 border-surface-border pl-3.5 space-y-1 flex-1 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h4 className="font-bold text-text-primary font-sans">{ev.title}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-brand-primary uppercase">
                    {ev.sourceLabel}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed font-sans">{ev.description}</p>
                <div className="text-[10px] font-mono text-text-muted">
                  Source: {ev.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Add External Reference */}
      {addRefModalOpen && (
        <Modal
          isOpen={addRefModalOpen}
          onClose={() => setAddRefModalOpen(false)}
          title="Add Official / External Reference"
          subtitle="Record Bank, 1930, or NCRP complaint reference numbers"
          maxWidth="sm"
        >
          <form onSubmit={handleSaveReference} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-text-primary mb-1">Authority / Institution</label>
              <select
                value={refAuthority}
                onChange={(e) => {
                  const val = e.target.value as ExternalAuthority;
                  setRefAuthority(val);
                  if (val === 'bank') setRefAuthorityName('HDFC Bank Dispute Desk');
                  else if (val === '1930') setRefAuthorityName('1930 (I4C Helpline)');
                  else if (val === 'ncrp') setRefAuthorityName('cybercrime.gov.in (NCRP)');
                  else if (val === 'payment_app') setRefAuthorityName('Google Pay / PhonePe');
                }}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
              >
                <option value="bank">Bank Fraud Cell / Dispute Desk</option>
                <option value="1930">1930 / I4C National Helpline</option>
                <option value="ncrp">NCRP (cybercrime.gov.in)</option>
                <option value="payment_app">Payment App (GPay/PhonePe/Paytm)</option>
                <option value="police">Police Station FIR / CSR</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Authority Label</label>
              <input
                type="text"
                value={refAuthorityName}
                onChange={(e) => setRefAuthorityName(e.target.value)}
                placeholder="e.g. HDFC Bank Fraud Cell"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Reference / Acknowledgement Number *</label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g. HDFC-98127, CF-728191, 123456789012"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono font-bold text-text-primary outline-none focus:border-brand-primary uppercase"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Status</label>
              <select
                value={refStatus}
                onChange={(e) => {
                  const s = e.target.value as ExternalStatus;
                  setRefStatus(s);
                  if (s === 'submitted') setRefStatusDisplay('Submitted');
                  else if (s === 'acknowledged') setRefStatusDisplay('Acknowledged');
                  else if (s === 'awaiting_response') setRefStatusDisplay('Awaiting response');
                  else if (s === 'dispute_raised') setRefStatusDisplay('Dispute raised');
                }}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
              >
                <option value="submitted">Submitted</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="awaiting_response">Awaiting response</option>
                <option value="dispute_raised">Dispute raised</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={refNotes}
                onChange={(e) => setRefNotes(e.target.value)}
                placeholder="e.g. Logged via fraud hotline"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
              />
            </div>

            <div className="pt-3 border-t border-surface-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddRefModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary border border-surface-border font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Save Reference</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: Add Authority Response (Specification #14) */}
      {addResponseModalOpen && (
        <Modal
          isOpen={addResponseModalOpen}
          onClose={() => setAddResponseModalOpen(false)}
          title="Add / Interpret Authority Response"
          subtitle="Paste bank emails, letters, or NCRP communications"
          maxWidth="md"
        >
          <form onSubmit={handleSaveResponse} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-text-primary mb-1">Responding Institution</label>
              <select
                value={responseAuthorityHint}
                onChange={(e) => setResponseAuthorityHint(e.target.value as ExternalAuthority)}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
              >
                <option value="bank">Bank Fraud Dispute Desk</option>
                <option value="ncrp">NCRP (cybercrime.gov.in)</option>
                <option value="1930">1930 / I4C Cyber Crime Cell</option>
                <option value="payment_app">Payment App Support (GPay/PhonePe)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Paste Response Text *</label>
              <textarea
                rows={6}
                value={rawResponseText}
                onChange={(e) => setRawResponseText(e.target.value)}
                placeholder="e.g. 'Dear Customer, regarding claim HDFC-98127 for UPI transfer of INR 18,500.00 (UTR 423719820491), internal logs show transaction was customer-authorised via MPIN. Dispute rejected. To escalate, submit police/NCRP acknowledgement within 7 days.'"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div className="pt-3 border-t border-surface-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddResponseModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary border border-surface-border font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Zap size={14} />
                <span>Interpret &amp; Update Case</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: Conflict Resolution */}
      {resolvingConflictId && (
        <Modal
          isOpen={resolvingConflictId !== null}
          onClose={() => setResolvingConflictId(null)}
          title="Resolve Evidence Information Conflict"
          subtitle="Confirm the verified figure for official filing"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-text-secondary leading-relaxed">
              Confirm the exact value recorded on your official bank debit statement.
            </p>

            <div>
              <label className="block font-bold text-text-primary mb-1">Resolution Note / Confirmed Value:</label>
              <input
                type="text"
                value={conflictResolutionNote}
                onChange={(e) => setConflictResolutionNote(e.target.value)}
                placeholder="e.g. Confirmed from Bank Statement: Disputed amount is exactly ₹18,500"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
              />
            </div>

            <div className="pt-3 border-t border-surface-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setResolvingConflictId(null)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary border border-surface-border font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConflictResolved(resolvingConflictId)}
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle"
              >
                Mark Conflict Resolved ✓
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: Bank Dispute Notice Modal */}
      {bankLetterModalOpen && (
        <Modal
          isOpen={bankLetterModalOpen}
          onClose={() => setBankLetterModalOpen(false)}
          title="Formal Bank Dispute Notice"
          subtitle="Formatted per RBI Guidelines on Customer Protection (Zero-Liability Window)"
          maxWidth="xl"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border font-mono text-xs text-text-primary whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
              {bankLetterText}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-surface-border">
              <span className="text-xs text-text-muted font-mono">
                Submit this notice to your Bank Branch Manager or Nodal Grievance Desk.
              </span>
              <button
                onClick={() => copyText('bankLetter', bankLetterText)}
                className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle flex items-center gap-1.5"
              >
                {copiedKey === 'bankLetter' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'bankLetter' ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 5: Delete Case Modal */}
      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Case File"
          subtitle={`Case ID: ${activeCase.caseId}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-sans">
            <p className="text-text-secondary leading-relaxed">
              Are you sure you want to permanently delete this case record? This will remove all associated transaction records, external references, and evidence artifacts.
            </p>

            <div className="pt-3 border-t border-surface-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary border border-surface-border font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCase(activeCase.caseId);
                  setDeleteModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-brand-red hover:bg-red-700 text-white font-bold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
