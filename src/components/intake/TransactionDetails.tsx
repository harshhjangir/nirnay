import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit2,
  FileCheck,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import {
  compareExtractedEvidence,
  ExtractedTransactionData,
  extractFromPaymentEvidence
} from '../../services/evidenceExtractorEngine';
import { BANK_DIRECTORY } from '../../services/bankDirectoryData';
import { Modal } from '../common/Modal';
import { TERMINOLOGY_DATABASE } from '../../services/terminologyData';

export const TransactionDetails: React.FC = () => {
  const {
    draftIncident,
    addDraftTransaction,
    removeDraftTransaction,
    addDraftEvidence,
    updateDraft,
    setIntakeStep
  } = useIncident();

  // Mode: Evidence-First (default) vs Manual Entry Fallback
  const [entryMode, setEntryMode] = useState<'evidence_first' | 'manual'>('evidence_first');

  // Evidence upload & extraction state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [primaryExtracted, setPrimaryExtracted] = useState<ExtractedTransactionData | null>(null);
  const [secondaryExtracted, setSecondaryExtracted] = useState<ExtractedTransactionData | null>(null);
  const [pasteSmsText, setPasteSmsText] = useState('');
  const [showSmsPasteBox, setShowSmsPasteBox] = useState(false);

  // Editable fields in the Extracted Preview panel
  const [editAmount, setEditAmount] = useState('18500');
  const [editUtr, setEditUtr] = useState('423719820491');
  const [editVpa, setEditVpa] = useState('discom.billupdate.982@okaxis');
  const [editBeneficiary, setEditBeneficiary] = useState('M/S BILLDESK POWER MGT');
  const [editBank, setEditBank] = useState('HDFC Bank');
  const [editAccount, setEditAccount] = useState('9104');
  const [editDate, setEditDate] = useState('24 Aug 2026');
  const [editPaymentApp, setEditPaymentApp] = useState('Google Pay');

  // Manual fallback inputs
  const [manualAmount, setManualAmount] = useState('');
  const [manualUtr, setManualUtr] = useState('');
  const [manualVpa, setManualVpa] = useState('');
  const [manualBank, setManualBank] = useState('HDFC Bank');
  const [manualAccount, setManualAccount] = useState('');
  const [manualApp, setManualApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'CRED' | 'Netbanking'>('Google Pay');
  const [manualError, setManualError] = useState<string | null>(null);

  // Contextual Help Popover state
  const [contextualHelpKey, setContextualHelpKey] = useState<string | null>(null);
  const [walkthroughModalTermId, setWalkthroughModalTermId] = useState<string | null>(null);

  const complainant = draftIncident.complainant;

  // Handle file selected for extraction
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    setTimeout(() => {
      let sampleHint: 'sample_gpay' | 'sample_phonepe' | 'custom' = 'sample_gpay';
      if (file.name.toLowerCase().includes('phonepe') || file.name.toLowerCase().includes('7200')) {
        sampleHint = 'sample_phonepe';
      }

      const extracted = extractFromPaymentEvidence(file.name, undefined, sampleHint);
      if (!primaryExtracted) {
        setPrimaryExtracted(extracted);
        // Sync editable fields
        setEditAmount(String(extracted.amount.value || '18500'));
        setEditUtr(extracted.utrNumber.value || '423719820491');
        setEditVpa(extracted.recipientUpiOrAcc.value || 'discom.billupdate.982@okaxis');
        setEditBeneficiary(extracted.recipientName.value || 'M/S BILLDESK POWER MGT');
        setEditBank(extracted.senderBank.value || 'HDFC Bank');
        setEditAccount(extracted.senderAccountMasked.value || '9104');
        setEditDate(extracted.date.value || '24 Aug 2026');
        setEditPaymentApp(extracted.paymentApp.value || 'Google Pay');
      } else {
        setSecondaryExtracted(extracted);
      }

      // Automatically attach as evidence item
      addDraftEvidence({
        type: file.name.endsWith('.pdf') ? 'bank_statement' : 'screenshot',
        title: `Payment Receipt: ${file.name}`,
        description: `Uploaded payment evidence from ${file.name}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        source: extracted.amount.sourceLabel,
        status: 'verified',
        relevance: 'critical',
        fileSizeBytes: file.size,
        fileName: file.name,
        extractedData: {
          amount: extracted.amount.value,
          utrNumber: extracted.utrNumber.value,
          upiId: extracted.recipientUpiOrAcc.value,
          bank: extracted.senderBank.value
        }
      });

      setIsProcessingOcr(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }, 450);
  };

  // Handle sample evidence click
  const handleLoadSample = (sampleType: 'sample_gpay' | 'sample_phonepe' | 'sample_sms') => {
    setIsProcessingOcr(true);
    setTimeout(() => {
      let fileName = 'google_pay_receipt_18500.png';
      let rawText: string | undefined;

      if (sampleType === 'sample_phonepe') {
        fileName = 'phonepe_collect_receipt_7200.png';
      } else if (sampleType === 'sample_sms') {
        fileName = 'hdfc_debit_sms.txt';
        rawText = 'Dear Customer, INR 18,500.00 debited from A/c XX9104 on 24-AUG-26 10:28:14 by UPI/423719820491/discom.bill/UPI. If not done by you, call 18002586161.';
      }

      const extracted = extractFromPaymentEvidence(fileName, rawText, sampleType);
      if (!primaryExtracted) {
        setPrimaryExtracted(extracted);
        setEditAmount(String(extracted.amount.value || '18500'));
        setEditUtr(extracted.utrNumber.value || '423719820491');
        setEditVpa(extracted.recipientUpiOrAcc.value || 'discom.billupdate.982@okaxis');
        setEditBeneficiary(extracted.recipientName.value || 'M/S BILLDESK POWER MGT');
        setEditBank(extracted.senderBank.value || 'HDFC Bank');
        setEditAccount(extracted.senderAccountMasked.value || '9104');
        setEditDate(extracted.date.value || '24 Aug 2026');
        setEditPaymentApp(extracted.paymentApp.value || 'Google Pay');
      } else {
        setSecondaryExtracted(extracted);
      }

      addDraftEvidence({
        type: sampleType === 'sample_sms' ? 'sms_text' : 'screenshot',
        title: sampleType === 'sample_sms' ? 'HDFC Bank Debit Confirmation SMS' : `UPI Payment Receipt (${extracted.paymentApp.value})`,
        description: `Parsed payment evidence from ${fileName}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        source: extracted.amount.sourceLabel,
        status: 'verified',
        relevance: 'critical',
        contentSnippet: rawText,
        extractedData: {
          amount: extracted.amount.value,
          utrNumber: extracted.utrNumber.value,
          upiId: extracted.recipientUpiOrAcc.value,
          bank: extracted.senderBank.value
        }
      });

      setIsProcessingOcr(false);
    }, 350);
  };

  // Handle SMS paste submit
  const handleParsePastedSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteSmsText.trim()) return;

    const extracted = extractFromPaymentEvidence('bank_debit_sms.txt', pasteSmsText, 'sample_sms');
    if (!primaryExtracted) {
      setPrimaryExtracted(extracted);
      setEditAmount(String(extracted.amount.value || '18500'));
      setEditUtr(extracted.utrNumber.value || '423719820491');
      setEditVpa(extracted.recipientUpiOrAcc.value || 'discom.billupdate.982@okaxis');
      setEditBeneficiary(extracted.recipientName.value || 'Payee Account');
      setEditBank(extracted.senderBank.value || 'HDFC Bank');
      setEditAccount(extracted.senderAccountMasked.value || '9104');
    } else {
      setSecondaryExtracted(extracted);
    }

    addDraftEvidence({
      type: 'sms_text',
      title: 'Pasted Bank Debit SMS',
      description: 'Bank confirmation SMS alert provided by user',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      source: 'Bank SMS',
      status: 'verified',
      relevance: 'critical',
      contentSnippet: pasteSmsText.trim(),
      extractedData: {
        amount: extracted.amount.value,
        utrNumber: extracted.utrNumber.value,
        bank: extracted.senderBank.value
      }
    });

    setPasteSmsText('');
    setShowSmsPasteBox(false);
  };

  // Confirm extracted data and auto-populate transaction form
  const handleConfirmAndPopulate = () => {
    const numAmt = parseFloat(editAmount);
    if (isNaN(numAmt) || numAmt <= 0) return;

    addDraftTransaction({
      amount: numAmt,
      currency: 'INR',
      timestamp: `${editDate} · 10:28 AM`,
      senderBank: editBank,
      senderAccountMasked: editAccount,
      recipientUpiOrAcc: editVpa.trim(),
      recipientNameIfKnown: editBeneficiary.trim(),
      utrNumber: editUtr.trim(),
      paymentApp: editPaymentApp as any,
      paymentMethod: 'UPI',
      notes: `Extracted automatically from ${primaryExtracted?.amount.sourceLabel || 'Payment Evidence'}`
    });
  };

  // Manual fallback add transaction
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(manualAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setManualError('Please enter a valid disputed amount in INR.');
      return;
    }
    if (!manualVpa.trim()) {
      setManualError('Please enter recipient UPI ID or account number.');
      return;
    }

    setManualError(null);
    addDraftTransaction({
      amount: numAmt,
      currency: 'INR',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      senderBank: manualBank,
      senderAccountMasked: manualAccount ? manualAccount.slice(-4) : '9104',
      recipientUpiOrAcc: manualVpa.trim(),
      utrNumber: manualUtr.trim(),
      paymentApp: manualApp as any,
      paymentMethod: 'UPI'
    });

    setManualAmount('');
    setManualUtr('');
    setManualVpa('');
  };

  const handleComplainantChange = (field: string, val: string) => {
    updateDraft({
      complainant: {
        ...complainant,
        [field]: val
      }
    });
  };

  const handleProceedNextStep = () => {
    // If user has confirmed transaction(s), go to Step 4
    if (draftIncident.transactions.length === 0 && primaryExtracted) {
      handleConfirmAndPopulate();
    }
    setIntakeStep(4);
  };

  // Multi-evidence comparison result
  const comparisonResult = primaryExtracted && secondaryExtracted
    ? compareExtractedEvidence(primaryExtracted, secondaryExtracted)
    : null;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 3 OF 5 &bull; EVIDENCE-FIRST PAYMENT CAPTURE
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Start with your payment evidence
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Upload a screenshot of your payment receipt, bank SMS, or statement. NIRNAY will automatically extract the transaction parameters so you don&apos;t have to retype them.
        </p>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        onChange={handleFileSelected}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Mode Switcher Banner */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border text-xs">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-brand-primary" />
          <span className="font-semibold text-text-primary">
            {entryMode === 'evidence_first' ? 'Evidence-First Mode Active' : 'Manual Entry Mode'}
          </span>
        </div>

        <button
          onClick={() => setEntryMode(entryMode === 'evidence_first' ? 'manual' : 'evidence_first')}
          className="font-mono text-brand-primary hover:underline font-bold text-[11px]"
        >
          {entryMode === 'evidence_first' ? "Don't have a screenshot? Enter manually →" : "← Back to Evidence-First Upload"}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MAIN VIEW: EVIDENCE-FIRST UPLOAD & AUTOMATIC EXTRACTION                   */}
      {/* ========================================================================= */}
      {entryMode === 'evidence_first' && (
        <div className="space-y-6">
          
          {/* Top Dropzone */}
          <div className="p-6 rounded-card-lg bg-surface border-2 border-dashed border-brand-primary/30 hover:border-brand-primary transition-all text-center space-y-4 shadow-subtle">
            <div className="h-12 w-12 rounded-full bg-brand-soft text-brand-primary flex items-center justify-center mx-auto">
              <UploadCloud size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-text-primary font-display">
                Upload Payment Screenshot, Bank SMS or Statement
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto font-sans">
                Supports PNG, JPG, PDF. We extract the Disputed Amount, 12-digit UTR, Bank, and Recipient UPI ID automatically.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingOcr}
                className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
              >
                {isProcessingOcr ? <RefreshCw size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                <span>{isProcessingOcr ? 'Extracting Parameters...' : 'Upload Screenshot / PDF'}</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isProcessingOcr}
                className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Camera size={14} />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSmsPasteBox(prev => !prev)}
                className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <MessageSquare size={14} />
                <span>Paste Debit SMS</span>
              </button>
            </div>

            {/* Quick Sample Test Pills */}
            <div className="pt-3 border-t border-surface-border/60 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <span className="text-text-muted text-[11px]">Test with Sample Evidence:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('sample_gpay')}
                className="px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-text-secondary hover:text-text-primary text-[11px]"
              >
                Google Pay Receipt (₹18,500)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('sample_phonepe')}
                className="px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-text-secondary hover:text-text-primary text-[11px]"
              >
                PhonePe Receipt (₹7,200)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('sample_sms')}
                className="px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-text-secondary hover:text-text-primary text-[11px]"
              >
                HDFC Bank SMS (₹18,500)
              </button>
            </div>
          </div>

          {/* Paste SMS Modal Box */}
          {showSmsPasteBox && (
            <form onSubmit={handleParsePastedSms} className="p-4 rounded-lg bg-surface border border-surface-border space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-brand-primary" />
                  <span>Paste Bank Debit SMS Text</span>
                </span>
                <button type="button" onClick={() => setShowSmsPasteBox(false)} className="text-text-muted hover:text-text-primary">
                  <X size={14} />
                </button>
              </div>

              <textarea
                rows={3}
                value={pasteSmsText}
                onChange={(e) => setPasteSmsText(e.target.value)}
                placeholder="e.g. 'Dear Customer, INR 18,500.00 debited from A/c XX9104 on 24-AUG-26 by UPI/423719820491...'"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 text-xs font-mono text-text-primary outline-none focus:border-brand-primary"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold text-xs shadow-subtle flex items-center gap-1.5"
                >
                  <Sparkles size={13} />
                  <span>Extract from SMS</span>
                </button>
              </div>
            </form>
          )}

          {/* Multi-Evidence Consistency Banner */}
          {comparisonResult && (
            <div className={`p-4 rounded-lg border text-xs space-y-2 animate-in fade-in ${
              comparisonResult.hasConflicts
                ? 'bg-brand-amber-soft border-brand-amber/30 text-brand-amber'
                : 'bg-brand-green-soft border-brand-green/30 text-brand-green'
            }`}>
              <div className="flex items-center justify-between font-mono font-bold">
                <span>{comparisonResult.hasConflicts ? '⚠ EVIDENCE MISMATCH DETECTED' : '✓ MULTI-EVIDENCE CONSISTENCY VERIFIED'}</span>
                <span>2 Sources Compared</span>
              </div>
              <p className="text-text-primary font-sans text-xs">{comparisonResult.summary}</p>
            </div>
          )}

          {/* Extracted Review Panel */}
          {primaryExtracted && (
            <div className="p-6 rounded-card-lg bg-surface border border-brand-primary/30 shadow-card space-y-5 animate-in fade-in">
              {/* Protected Processing 4-Step Privacy Flow */}
              <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border text-xs space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
                  <span className="font-bold text-brand-primary uppercase flex items-center gap-1">
                    <Shield size={12} />
                    <span>PROTECTED PROCESSING PIPELINE</span>
                  </span>
                  <span>DEMO SECURE BOUNDARY</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-surface border border-surface-border text-brand-green flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    <span>1. Secure Transport</span>
                  </div>
                  <div className="p-2 rounded bg-surface border border-surface-border text-brand-green flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    <span>2. Enclave OCR</span>
                  </div>
                  <div className="p-2 rounded bg-surface border border-surface-border text-brand-green flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    <span>3. Data Minimized</span>
                  </div>
                  <div className="p-2 rounded bg-brand-soft border border-brand-primary text-brand-primary font-bold flex items-center gap-1.5">
                    <Edit2 size={12} />
                    <span>4. Verify &amp; Confirm</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
                    <Sparkles size={14} />
                    <span>EXTRACTED FROM YOUR EVIDENCE</span>
                  </div>
                  <div className="text-xs text-text-muted font-mono mt-0.5">
                    Source: <strong className="text-text-primary">{primaryExtracted.amount.sourceLabel}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPrimaryExtracted(null);
                      setSecondaryExtracted(null);
                    }}
                    className="px-2.5 py-1 rounded bg-surface hover:bg-brand-red-soft text-text-muted hover:text-brand-red border border-surface-border text-[11px] font-mono transition-colors"
                  >
                    Clear Extraction
                  </button>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-brand-green-soft text-brand-green border border-brand-green/30">
                    ✓ Verified by Engine
                  </span>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                {/* 1. Amount */}
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-text-muted text-[10px] uppercase">Disputed Amount (INR) *</span>
                    <span className="text-[10px] font-mono text-brand-green font-semibold">✓ {primaryExtracted.amount.confidenceLabel}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-text-muted">₹</span>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full bg-surface border border-surface-border rounded-lg pl-7 pr-3 py-2 font-mono font-bold text-sm text-brand-red outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                {/* 2. 12-Digit UTR */}
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-text-muted text-[10px] uppercase flex items-center gap-1">
                      <span>12-Digit UTR / Ref *</span>
                      <button
                        type="button"
                        onClick={() => setWalkthroughModalTermId('utr')}
                        className="text-brand-primary hover:underline font-mono text-[9px]"
                      >
                        (What is this?)
                      </button>
                    </span>
                    <span className="text-[10px] font-mono text-brand-green font-semibold">✓ {primaryExtracted.utrNumber.confidenceLabel}</span>
                  </div>
                  <input
                    type="text"
                    value={editUtr}
                    onChange={(e) => setEditUtr(e.target.value)}
                    maxLength={13}
                    className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 font-mono font-bold text-sm text-brand-primary outline-none focus:border-brand-primary"
                  />
                </div>

                {/* 3. Recipient UPI ID */}
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-text-muted text-[10px] uppercase flex items-center gap-1">
                      <span>Recipient UPI / Account *</span>
                      <button
                        type="button"
                        onClick={() => setWalkthroughModalTermId('upi-id-vpa')}
                        className="text-brand-primary hover:underline font-mono text-[9px]"
                      >
                        (What is this?)
                      </button>
                    </span>
                    <span className="text-[10px] font-mono text-brand-green font-semibold">✓ {primaryExtracted.recipientUpiOrAcc.confidenceLabel}</span>
                  </div>
                  <input
                    type="text"
                    value={editVpa}
                    onChange={(e) => setEditVpa(e.target.value)}
                    className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 font-mono font-medium text-xs text-text-primary outline-none focus:border-brand-primary"
                  />
                </div>

                {/* 4. Beneficiary Name */}
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-text-muted text-[10px] uppercase">Beneficiary Name</span>
                    <span className="text-[10px] font-mono text-text-muted">Extracted</span>
                  </div>
                  <input
                    type="text"
                    value={editBeneficiary}
                    onChange={(e) => setEditBeneficiary(e.target.value)}
                    className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:border-brand-primary"
                  />
                </div>

                {/* 5. Debited Bank */}
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-text-muted text-[10px] uppercase">Your Debited Bank</span>
                    <span className="text-[10px] font-mono text-brand-green font-semibold">✓ Looks clear</span>
                  </div>
                  <select
                    value={editBank}
                    onChange={(e) => setEditBank(e.target.value)}
                    className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:border-brand-primary"
                  >
                    {BANK_DIRECTORY.map(b => (
                      <option key={b.bankName} value={b.bankName}>{b.bankName}</option>
                    ))}
                  </select>
                </div>

                {/* 6. Masked Account */}
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-text-muted text-[10px] uppercase">Account (Last 4 Digits)</span>
                    <span className="text-[10px] font-mono text-text-muted">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={editAccount}
                    maxLength={4}
                    onChange={(e) => setEditAccount(e.target.value)}
                    placeholder="9104"
                    className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
                  />
                </div>

              </div>

              {/* Confirm & Populate Button */}
              <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-text-muted font-sans">
                  * Please review the extracted numbers before confirming. You can edit any field above.
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAndPopulate}
                  className="px-5 py-2.5 rounded-lg bg-brand-green hover:bg-green-700 text-white font-bold text-xs shadow-subtle transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <CheckCircle2 size={14} />
                  <span>Confirm Details &amp; Populate Transaction</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MANUAL FALLBACK FORM                                                      */}
      {/* ========================================================================= */}
      {entryMode === 'manual' && (
        <form onSubmit={handleManualAdd} className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
          <div className="border-b border-surface-border/60 pb-3">
            <h3 className="text-base font-bold text-text-primary">
              Manual Transaction Details Entry
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Enter the transaction details manually if you don&apos;t have a payment screenshot available.
            </p>
          </div>

          {manualError && (
            <div className="p-3 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{manualError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-text-primary mb-1">Disputed Amount (INR) *</label>
              <input
                type="number"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="e.g. 18500"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono font-bold text-sm text-brand-red outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1 flex items-center justify-between">
                <span>12-Digit UTR / NPCI Ref</span>
                <button type="button" onClick={() => setWalkthroughModalTermId('utr')} className="text-brand-primary hover:underline font-mono text-[10px]">
                  (Where to find?)
                </button>
              </label>
              <input
                type="text"
                value={manualUtr}
                onChange={(e) => setManualUtr(e.target.value)}
                placeholder="423719820491"
                maxLength={13}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono font-bold text-sm text-brand-primary outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1 flex items-center justify-between">
                <span>Recipient UPI ID / Account *</span>
                <button type="button" onClick={() => setWalkthroughModalTermId('upi-id-vpa')} className="text-brand-primary hover:underline font-mono text-[10px]">
                  (Where to find?)
                </button>
              </label>
              <input
                type="text"
                value={manualVpa}
                onChange={(e) => setManualVpa(e.target.value)}
                placeholder="e.g. discom.billupdate.982@okaxis"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Debited Bank</label>
              <select
                value={manualBank}
                onChange={(e) => setManualBank(e.target.value)}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-brand-primary"
              >
                {BANK_DIRECTORY.map(b => (
                  <option key={b.bankName} value={b.bankName}>{b.bankName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Account Last 4 Digits</label>
              <input
                type="text"
                value={manualAccount}
                maxLength={4}
                onChange={(e) => setManualAccount(e.target.value)}
                placeholder="9104"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Payment App</label>
              <select
                value={manualApp}
                onChange={(e) => setManualApp(e.target.value as any)}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-brand-primary"
              >
                <option value="Google Pay">Google Pay</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm</option>
                <option value="CRED">CRED</option>
                <option value="Netbanking">Netbanking (IMPS/NEFT)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Transaction to Dossier</span>
            </button>
          </div>
        </form>
      )}

      {/* Confirmed Transactions Summary Ledger */}
      {draftIncident.transactions.length > 0 && (
        <div className="p-5 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
            <span className="text-xs font-mono font-bold text-text-primary uppercase flex items-center gap-1.5">
              <FileCheck size={14} className="text-brand-green" />
              <span>Confirmed Case Transactions ({draftIncident.transactions.length})</span>
            </span>
            <span className="text-xs font-mono font-bold text-brand-red">
              Total Disputed: ₹{draftIncident.transactions.reduce((s, t) => s + (t.amount || 0), 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2">
            {draftIncident.transactions.map((tx) => (
              <div key={tx.id} className="p-3 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="font-bold text-text-primary">
                    ₹{tx.amount.toLocaleString('en-IN')} &bull; {tx.senderBank} (*{tx.senderAccountMasked})
                  </div>
                  <div className="text-[11px] text-text-muted">
                    UTR: {tx.utrNumber || 'Pending'} &bull; To: {tx.recipientUpiOrAcc}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeDraftTransaction(tx.id)}
                  className="text-text-muted hover:text-brand-red p-1.5"
                  title="Remove transaction"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complainant Identity Form */}
      <div className="p-5 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="border-b border-surface-border/60 pb-2">
          <h3 className="text-sm font-bold text-text-primary">
            Citizen Contact Information
          </h3>
          <p className="text-[11px] text-text-muted">
            Required for statutory filing on cybercrime.gov.in (NCRP) and formal bank dispute letters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-text-secondary mb-1">Your Full Name *</label>
            <input
              type="text"
              value={complainant.name}
              onChange={(e) => handleComplainantChange('name', e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-secondary mb-1">Mobile Phone *</label>
            <input
              type="text"
              value={complainant.phone}
              onChange={(e) => handleComplainantChange('phone', e.target.value)}
              placeholder="+91 98451 92837"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono text-text-primary outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={complainant.email}
              onChange={(e) => handleComplainantChange('email', e.target.value)}
              placeholder="rajesh.sharma@example.com"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-secondary mb-1">City / State</label>
            <input
              type="text"
              value={complainant.city}
              onChange={(e) => handleComplainantChange('city', e.target.value)}
              placeholder="Bengaluru, Karnataka"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => setIntakeStep(2)}
          className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Narrative</span>
        </button>

        <button
          type="button"
          onClick={handleProceedNextStep}
          className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-2"
        >
          <span>Continue to Evidence &amp; Review</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* CONTEXTUAL HELP MODAL: "Where Do I Find This?" */}
      {walkthroughModalTermId && (
        <Modal
          isOpen={walkthroughModalTermId !== null}
          onClose={() => setWalkthroughModalTermId(null)}
          title={TERMINOLOGY_DATABASE.find(t => t.id === walkthroughModalTermId)?.term || 'Where to Find This'}
          subtitle="Look for a field labelled similar to..."
          maxWidth="md"
        >
          {(() => {
            const term = TERMINOLOGY_DATABASE.find(t => t.id === walkthroughModalTermId);
            if (!term) return null;

            return (
              <div className="space-y-4 text-xs font-sans">
                <p className="text-text-secondary leading-relaxed">
                  {term.shortWhatItMeans}
                </p>

                <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
                  <div className="font-bold font-mono text-text-primary text-[10px] uppercase">WHY NIRNAY NEEDS IT:</div>
                  <p className="text-text-secondary">{term.whyNivaranNeedsIt}</p>
                </div>

                {term.appWalkthrough && (
                  <div className="space-y-3 pt-2">
                    <div className="font-mono font-bold text-text-primary text-[11px]">
                      LOOK FOR A FIELD LABELLED SIMILAR TO:
                    </div>

                    <div className="space-y-2">
                      {term.appWalkthrough.map((walk, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-surface border border-surface-border space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-text-primary">
                            <span>{walk.appName}:</span>
                            <span className="text-brand-primary font-mono text-[11px]">{walk.fieldLabelHint}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 font-mono text-[11px] text-text-muted">
                            {walk.steps.map((st, sIdx) => (
                              <React.Fragment key={sIdx}>
                                <span>{st}</span>
                                {sIdx < walk.steps.length - 1 && <span>&rarr;</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-surface-border flex justify-end">
                  <button
                    type="button"
                    onClick={() => setWalkthroughModalTermId(null)}
                    className="px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold text-xs shadow-subtle"
                  >
                    Got it, Back to Form
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

    </div>
  );
};
