import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  FolderPlus,
  HelpCircle,
  Info,
  MessageSquare,
  Phone,
  Plus,
  QrCode,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UploadCloud,
  UserCheck,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import {
  checkBeforeYouPayTool,
  checkPhoneNumberTool,
  checkPaymentRequestTool,
  checkQrCodeTool,
  checkUpiIdTool,
  checkWebsiteUrlTool,
  parseBankSmsTool,
  BeforeYouPayAnswers
} from '../../services/miniToolkitEngine';
import { interpretAuthorityResponse } from '../../services/responseInterpreterEngine';
import { NivaranToolResult } from '../../types';
import { Modal } from '../common/Modal';

export const NivaranToolsHub: React.FC = () => {
  const { cases, activeCaseId, addToolResultToCase, setActiveTab } = useIncident();

  const [activeToolTab, setActiveToolTab] = useState<
    'upi' | 'phone' | 'url' | 'message' | 'before_pay' | 'qr' | 'sms' | 'response'
  >('upi');

  // Tool 1: UPI Input & Result
  const [upiInput, setUpiInput] = useState('discom.billupdate.982@okaxis');
  const [upiResult, setUpiResult] = useState<NivaranToolResult | null>(() => checkUpiIdTool('discom.billupdate.982@okaxis'));

  // Tool 2: Phone Input & Result
  const [phoneInput, setPhoneInput] = useState('+91 70192 84920');
  const [phoneResult, setPhoneResult] = useState<NivaranToolResult | null>(() => checkPhoneNumberTool('+91 70192 84920'));

  // Tool 3: URL Input & Result
  const [urlInput, setUrlInput] = useState('http://bescom-bill-update.xyz/download.apk');
  const [urlResult, setUrlResult] = useState<NivaranToolResult | null>(() => checkWebsiteUrlTool('http://bescom-bill-update.xyz/download.apk'));

  // Tool 4: Message Analyser Input & Result
  const [msgInput, setMsgInput] = useState(
    'Dear consumer your electricity power will be disconnected tonight at 9.30pm because previous month bill was not updated. Please call officer immediately at 7019284920 and pay 15 rupee verification fee.'
  );
  const [msgResult, setMsgResult] = useState<NivaranToolResult | null>(() =>
    checkPaymentRequestTool(
      'Dear consumer your electricity power will be disconnected tonight at 9.30pm because previous month bill was not updated. Please call officer immediately at 7019284920 and pay 15 rupee verification fee.'
    )
  );

  // Tool 5: Before You Pay State & Result
  const [beforePayAnswers, setBeforePayAnswers] = useState<BeforeYouPayAnswers>({
    whoContacted: 'State Electricity Department (BESCOM)',
    beneficiaryDisplayed: 'RAHUL KUMAR',
    wereYouPressured: true,
    askedForPinOrOtp: true,
    scanQrToReceive: false,
    transferReason: 'Bill verification payment'
  });
  const [beforePayResult, setBeforePayResult] = useState<NivaranToolResult | null>(() =>
    checkBeforeYouPayTool({
      whoContacted: 'State Electricity Department (BESCOM)',
      beneficiaryDisplayed: 'RAHUL KUMAR',
      wereYouPressured: true,
      askedForPinOrOtp: true,
      scanQrToReceive: false,
      transferReason: 'Bill verification payment'
    })
  );

  // Tool 6: QR Code Input & Result
  const [qrInput, setQrInput] = useState('upi://pay?pa=discom.billupdate.982@okaxis&pn=POWER%20DISCOM%20BILL&am=18500&tn=BILL_UPDATE');
  const [qrResult, setQrResult] = useState<NivaranToolResult | null>(() =>
    checkQrCodeTool('upi://pay?pa=discom.billupdate.982@okaxis&pn=POWER%20DISCOM%20BILL&am=18500&tn=BILL_UPDATE')
  );

  // Tool 7: SMS Parser Input & Result
  const [smsInput, setSmsInput] = useState(
    'Dear Customer, INR 18,500.00 debited from A/c XX9104 on 24-AUG-26 10:28:14 by UPI/423719820491/discom.bill/UPI. If not done by you, call 18002586161 immediately.'
  );
  const [smsResult, setSmsResult] = useState<NivaranToolResult | null>(() =>
    parseBankSmsTool(
      'Dear Customer, INR 18,500.00 debited from A/c XX9104 on 24-AUG-26 10:28:14 by UPI/423719820491/discom.bill/UPI. If not done by you, call 18002586161 immediately.'
    )
  );

  // Tool 8: Bank Response Input & Result
  const [respInput, setRespInput] = useState(
    'Dear Customer, regarding dispute HDFC-98127 for UPI debit of INR 18,500 (UTR 423719820491), internal logs show transaction was customer-authorised via valid MPIN. Hence claim is rejected. You may escalate within 7 days with NCRP acknowledgement.'
  );

  // Case Selector Modal for Adding Results
  const [attachingResult, setAttachingResult] = useState<NivaranToolResult | null>(null);
  const [targetCaseId, setTargetCaseId] = useState(activeCaseId);
  const [addSuccessFeedback, setAddSuccessFeedback] = useState<string | null>(null);

  const handleAttachConfirmed = () => {
    if (!attachingResult) return;
    addToolResultToCase(targetCaseId, attachingResult);
    setAddSuccessFeedback(`Intelligence from ${attachingResult.toolName} attached to Case ${targetCaseId}!`);
    setAttachingResult(null);
    setTimeout(() => setAddSuccessFeedback(null), 3000);
  };

  const toolTabs = [
    { id: 'upi', label: 'Check UPI ID', icon: Search },
    { id: 'phone', label: 'Check Phone Number', icon: Phone },
    { id: 'url', label: 'Check URL', icon: ExternalLink },
    { id: 'message', label: 'Analyse Message', icon: MessageSquare },
    { id: 'before_pay', label: 'Before You Pay', icon: UserCheck },
    { id: 'qr', label: 'Scan QR', icon: QrCode },
    { id: 'sms', label: 'Analyse Bank SMS', icon: Zap },
    { id: 'response', label: 'Analyse Bank Response', icon: Scale }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          SUPPORTING CASE INTELLIGENCE UTILITIES
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          Nivaran Tools
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed font-sans">
          Supporting evaluation tools to investigate suspect identifiers, decode transaction SMS alerts, and evaluate payment requests. <strong>Every result can be directly added to your case record.</strong>
        </p>
      </div>

      {/* Success Feedback Alert */}
      {addSuccessFeedback && (
        <div className="p-4 rounded-lg bg-brand-green-soft border border-brand-green/30 text-xs text-brand-green font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{addSuccessFeedback}</span>
          </div>
          <button
            onClick={() => setActiveTab('case_details')}
            className="underline hover:text-green-900 font-mono text-[11px]"
          >
            View in Case &rarr;
          </button>
        </div>
      )}

      {/* Main Horizontal Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-card bg-surface border border-surface-border shadow-subtle text-xs font-semibold">
        {toolTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeToolTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveToolTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-soft text-brand-primary border border-brand-primary/30 font-bold shadow-subtle'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: CHECK A UPI ID (Specification #17) */}
      {activeToolTab === 'upi' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Check a UPI ID (VPA)</h2>
            <p className="text-xs text-text-secondary">
              Analyzes format validity, institutional keyword impersonation, and matching reports in the Nivaran network.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUpiResult(checkUpiIdTool(upiInput));
            }}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={upiInput}
                onChange={(e) => setUpiInput(e.target.value)}
                placeholder="e.g. discom.billupdate.982@okaxis"
                className="flex-1 bg-surface-subtle border border-surface-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-text-primary outline-none focus:border-brand-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center justify-center gap-1.5"
              >
                <span>Check Identifier</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-text-muted">
              <span>Try sample:</span>
              <button type="button" onClick={() => { setUpiInput('discom.billupdate.982@okaxis'); setUpiResult(checkUpiIdTool('discom.billupdate.982@okaxis')); }} className="underline hover:text-brand-primary">discom.billupdate.982@okaxis</button>
              <span>&bull;</span>
              <button type="button" onClick={() => { setUpiInput('airhelp.refunds.912@ybl'); setUpiResult(checkUpiIdTool('airhelp.refunds.912@ybl')); }} className="underline hover:text-brand-primary">airhelp.refunds.912@ybl</button>
            </div>
          </form>

          {upiResult && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">{upiResult.summary}</span>
                <button
                  onClick={() => setAttachingResult(upiResult)}
                  className="px-3 py-1.5 rounded bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs shadow-subtle flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>[ Add Result to Case ]</span>
                </button>
              </div>

              {upiResult.signals && (
                <div className="space-y-1.5 pt-1 font-sans">
                  {upiResult.signals.map((sig, i) => (
                    <div key={i} className="p-2 rounded bg-surface border border-surface-border flex items-start gap-2">
                      <AlertTriangle size={14} className={sig.type === 'critical' ? 'text-brand-red shrink-0 mt-0.5' : 'text-brand-amber shrink-0 mt-0.5'} />
                      <div>
                        <div className="font-bold text-text-primary font-mono text-[11px]">{sig.label}</div>
                        <div className="text-[11px] text-text-secondary">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-2.5 rounded bg-brand-amber-soft/40 border border-brand-amber/20 text-brand-amber text-[11px] font-sans">
                {upiResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: CHECK A PHONE NUMBER (Specification #18) */}
      {activeToolTab === 'phone' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Check a Phone Number</h2>
            <p className="text-xs text-text-secondary">
              Cross-references phone numbers against known Nivaran scam cases and utility impersonation campaigns.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPhoneResult(checkPhoneNumberTool(phoneInput));
            }}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+91 70192 84920"
                className="flex-1 bg-surface-subtle border border-surface-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-text-primary outline-none focus:border-brand-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center justify-center gap-1.5"
              >
                <span>Check Number</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-text-muted">
              <span>Try sample:</span>
              <button type="button" onClick={() => { setPhoneInput('+91 70192 84920'); setPhoneResult(checkPhoneNumberTool('+91 70192 84920')); }} className="underline hover:text-brand-primary">+91 70192 84920 (DISCOM caller)</button>
            </div>
          </form>

          {phoneResult && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">{phoneResult.summary}</span>
                <button
                  onClick={() => setAttachingResult(phoneResult)}
                  className="px-3 py-1.5 rounded bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs shadow-subtle flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>[ Add Result to Case ]</span>
                </button>
              </div>

              {phoneResult.signals && (
                <div className="space-y-1.5 pt-1 font-sans">
                  {phoneResult.signals.map((sig, i) => (
                    <div key={i} className="p-2 rounded bg-surface border border-surface-border flex items-start gap-2">
                      <AlertCircle size={14} className="text-brand-red shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-text-primary font-mono text-[11px]">{sig.label}</div>
                        <div className="text-[11px] text-text-secondary">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-2.5 rounded bg-brand-amber-soft/40 border border-brand-amber/20 text-brand-amber text-[11px] font-sans">
                {phoneResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: CHECK A URL (Specification #19) */}
      {activeToolTab === 'url' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Check a URL / Website Link</h2>
            <p className="text-xs text-text-secondary">
              Inspects domain structure, HTTPS protocol, suspicious TLDs, punycode spoofing, and malicious APK download paths.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUrlResult(checkWebsiteUrlTool(urlInput));
            }}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://bescom-bill-update.xyz/download.apk"
                className="flex-1 bg-surface-subtle border border-surface-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-text-primary outline-none focus:border-brand-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center justify-center gap-1.5"
              >
                <span>Analyze Link</span>
              </button>
            </div>
          </form>

          {urlResult && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">{urlResult.summary}</span>
                <button
                  onClick={() => setAttachingResult(urlResult)}
                  className="px-3 py-1.5 rounded bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs shadow-subtle flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>[ Add Result to Case ]</span>
                </button>
              </div>

              {urlResult.signals && (
                <div className="space-y-1.5 pt-1 font-sans">
                  {urlResult.signals.map((sig, i) => (
                    <div key={i} className="p-2 rounded bg-surface border border-surface-border flex items-start gap-2">
                      <AlertTriangle size={14} className="text-brand-amber shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-text-primary font-mono text-[11px]">{sig.label}</div>
                        <div className="text-[11px] text-text-secondary">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-2.5 rounded bg-brand-amber-soft/40 border border-brand-amber/20 text-brand-amber text-[11px] font-sans">
                {urlResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 4: MESSAGE ANALYSER (Specification #20) */}
      {activeToolTab === 'message' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Analyse Message (SMS / WhatsApp / Email)</h2>
            <p className="text-xs text-text-secondary">
              Extracts scam patterns, urgency triggers, impersonation claims, OTP/PIN requests, and APK download prompts.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMsgResult(checkPaymentRequestTool(msgInput));
            }}
            className="space-y-3"
          >
            <textarea
              rows={4}
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Paste suspicious SMS, WhatsApp message, or email text..."
              className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Zap size={14} />
                <span>Analyse Message</span>
              </button>
            </div>
          </form>

          {msgResult && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">{msgResult.summary}</span>
                <button
                  onClick={() => setAttachingResult(msgResult)}
                  className="px-3 py-1.5 rounded bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs shadow-subtle flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>[ Add Result to Case ]</span>
                </button>
              </div>

              {msgResult.signals && (
                <div className="space-y-1.5 pt-1 font-sans">
                  {msgResult.signals.map((sig, i) => (
                    <div key={i} className="p-2 rounded bg-surface border border-surface-border flex items-start gap-2">
                      <AlertTriangle size={14} className="text-brand-red shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-text-primary font-mono text-[11px]">{sig.label}</div>
                        <div className="text-[11px] text-text-secondary">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL 5: BEFORE YOU PAY DECISION TOOL (Specification #21) */}
      {activeToolTab === 'before_pay' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-brand-primary uppercase">PRE-PAYMENT DECISION ASSISTANT</div>
            <h2 className="text-lg font-bold text-text-primary">&ldquo;Before You Pay&rdquo; Evaluation</h2>
            <p className="text-xs text-text-secondary">
              Input who contacted you and what beneficiary name appears on your screen to identify recipient mismatches before transferring money.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setBeforePayResult(checkBeforeYouPayTool(beforePayAnswers));
            }}
            className="space-y-4 text-xs font-sans"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-text-primary mb-1">Who contacted you / claiming organization?</label>
                <input
                  type="text"
                  value={beforePayAnswers.whoContacted}
                  onChange={(e) => setBeforePayAnswers(prev => ({ ...prev, whoContacted: e.target.value }))}
                  placeholder="e.g. State Electricity Board (BESCOM)"
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Beneficiary Payee Name displayed in UPI app:</label>
                <input
                  type="text"
                  value={beforePayAnswers.beneficiaryDisplayed}
                  onChange={(e) => setBeforePayAnswers(prev => ({ ...prev, beneficiaryDisplayed: e.target.value }))}
                  placeholder="e.g. RAHUL KUMAR or M/S BILLDESK"
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-surface-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={beforePayAnswers.wereYouPressured}
                  onChange={(e) => setBeforePayAnswers(prev => ({ ...prev, wereYouPressured: e.target.checked }))}
                  className="h-4 w-4 rounded text-brand-primary"
                />
                <span className="font-medium text-[11px]">Were you pressured (e.g. 15 mins)?</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-surface-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={beforePayAnswers.askedForPinOrOtp}
                  onChange={(e) => setBeforePayAnswers(prev => ({ ...prev, askedForPinOrOtp: e.target.checked }))}
                  className="h-4 w-4 rounded text-brand-primary"
                />
                <span className="font-medium text-[11px]">Asked for UPI PIN or OTP?</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-surface-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={beforePayAnswers.scanQrToReceive}
                  onChange={(e) => setBeforePayAnswers(prev => ({ ...prev, scanQrToReceive: e.target.checked }))}
                  className="h-4 w-4 rounded text-brand-primary"
                />
                <span className="font-medium text-[11px]">Told to scan QR to &ldquo;receive&rdquo; money?</span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle"
              >
                Evaluate Payment Safety Signals
              </button>
            </div>
          </form>

          {beforePayResult && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">{beforePayResult.summary}</span>
                <button
                  onClick={() => setAttachingResult(beforePayResult)}
                  className="px-3 py-1.5 rounded bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs shadow-subtle flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>[ Add Result to Case ]</span>
                </button>
              </div>

              {beforePayResult.signals && (
                <div className="space-y-1.5 pt-1 font-sans">
                  {beforePayResult.signals.map((sig, i) => (
                    <div key={i} className="p-2.5 rounded bg-surface border border-surface-border flex items-start gap-2">
                      <AlertTriangle size={14} className="text-brand-red shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-brand-red font-mono text-[11px]">{sig.label}</div>
                        <div className="text-[11px] text-text-secondary">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL 6: SCAN QR */}
      {activeToolTab === 'qr' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Scan / Decode QR Payload</h2>
            <p className="text-xs text-text-secondary">
              Extracts recipient VPA, merchant name, and pre-filled transaction parameters from UPI QR strings.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQrResult(checkQrCodeTool(qrInput));
            }}
            className="space-y-3"
          >
            <textarea
              rows={3}
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="e.g. upi://pay?pa=discom.billupdate.982@okaxis&pn=POWER%20DISCOM&am=18500"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <QrCode size={14} />
                <span>Decode QR Payload</span>
              </button>
            </div>
          </form>

          {qrResult && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">{qrResult.summary}</span>
                <button
                  onClick={() => setAttachingResult(qrResult)}
                  className="px-3 py-1.5 rounded bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs shadow-subtle flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>[ Add Result to Case ]</span>
                </button>
              </div>

              {qrResult.signals && (
                <div className="space-y-1.5 pt-1 font-sans">
                  {qrResult.signals.map((sig, i) => (
                    <div key={i} className="p-2 rounded bg-surface border border-surface-border flex items-start gap-2">
                      <Info size={14} className="text-brand-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-text-primary font-mono text-[11px]">{sig.label}</div>
                        <div className="text-[11px] text-text-secondary">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL 7: ANALYSE BANK SMS */}
      {activeToolTab === 'sms' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Analyse Bank SMS</h2>
            <p className="text-xs text-text-secondary">
              Extracts debit amount, bank name, account number suffix, and 12-digit UTR directly from your raw bank SMS text.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSmsResult(parseBankSmsTool(smsInput));
            }}
            className="space-y-3"
          >
            <textarea
              rows={4}
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="Paste bank debit confirmation SMS alert text..."
              className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Zap size={14} />
                <span>Parse Bank SMS</span>
              </button>
            </div>
          </form>

          {smsResult && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">{smsResult.summary}</span>
                <button
                  onClick={() => setAttachingResult(smsResult)}
                  className="px-3 py-1.5 rounded bg-brand-soft hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/30 font-bold text-xs shadow-subtle flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>[ Add Result to Case ]</span>
                </button>
              </div>

              {smsResult.signals && (
                <div className="space-y-1.5 pt-1 font-sans">
                  {smsResult.signals.map((sig, i) => (
                    <div key={i} className="p-2 rounded bg-surface border border-surface-border flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-brand-green shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-text-primary font-mono text-[11px]">{sig.label}</div>
                        <div className="text-[11px] text-text-secondary">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL 8: ANALYSE BANK RESPONSE (Specification #14) */}
      {activeToolTab === 'response' && (
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Analyse Bank Response</h2>
            <p className="text-xs text-text-secondary">
              Extracts sender, decision, reason, and requested documents from official dispute rejection or intake letters.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              rows={4}
              value={respInput}
              onChange={(e) => setRespInput(e.target.value)}
              placeholder="Paste bank response letter or rejection email text..."
              className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 font-mono text-xs text-text-primary outline-none focus:border-brand-primary"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const interpreted = interpretAuthorityResponse(respInput, undefined, 'bank');
                  addToolResultToCase(activeCaseId, {
                    toolId: 'payment_request_check',
                    toolName: 'Bank Response Parser',
                    timestamp: new Date().toLocaleDateString('en-IN'),
                    query: respInput.slice(0, 60),
                    summary: `Interpreted response from ${interpreted.responder}: ${interpreted.decision}`,
                    verdict: 'POTENTIAL_RISK_SIGNALS'
                  });
                  setAddSuccessFeedback(`Interpreted response attached to Case ${activeCaseId}!`);
                  setTimeout(() => setAddSuccessFeedback(null), 3000);
                }}
                className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Scale size={14} />
                <span>Interpret &amp; Add to Case</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target Case Selector Modal for [ Add Result to Case ] */}
      {attachingResult && (
        <Modal
          isOpen={attachingResult !== null}
          onClose={() => setAttachingResult(null)}
          title="Attach Intelligence to Case"
          subtitle={`Attaching findings from ${attachingResult.toolName}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
              <div className="text-[11px] font-mono text-text-muted uppercase">Selected Finding:</div>
              <div className="font-bold text-text-primary">{attachingResult.summary}</div>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Select Target Case File:</label>
              <select
                value={targetCaseId}
                onChange={(e) => setTargetCaseId(e.target.value)}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary font-mono outline-none focus:border-brand-primary"
              >
                {cases.map((c) => (
                  <option key={c.caseId} value={c.caseId}>
                    {c.caseId} &bull; ₹{c.transactions.reduce((s, t) => s + (t.amount || 0), 0).toLocaleString('en-IN')} &bull; {c.category.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-surface-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAttachingResult(null)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary border border-surface-border font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAttachConfirmed}
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <FolderPlus size={14} />
                <span>Confirm &amp; Attach to Case</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
