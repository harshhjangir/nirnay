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
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UploadCloud,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import {
  checkPhoneNumberTool,
  checkPaymentRequestTool,
  checkQrCodeTool,
  checkUpiIdTool,
  checkWebsiteUrlTool,
  evaluateCallStoryTool,
  parseBankSmsTool
} from '../../services/miniToolkitEngine';
import { NivaranToolResult } from '../../types';
import { Modal } from '../common/Modal';

export const NivaranToolsHub: React.FC = () => {
  const { cases, activeCaseId, addToolResultToCase, setActiveTab } = useIncident();

  const [activeToolTab, setActiveToolTab] = useState<
    'upi' | 'phone' | 'url' | 'payment_msg' | 'qr' | 'sms' | 'call_story'
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

  // Tool 4: Payment Request Input & Result
  const [paymentMsgInput, setPaymentMsgInput] = useState(
    'Dear consumer your electricity power will be disconnected tonight at 9.30pm because previous month bill was not updated. Please call officer immediately at 7019284920 and pay 15 rupee verification fee.'
  );
  const [paymentMsgResult, setPaymentMsgResult] = useState<NivaranToolResult | null>(() =>
    checkPaymentRequestTool(
      'Dear consumer your electricity power will be disconnected tonight at 9.30pm because previous month bill was not updated. Please call officer immediately at 7019284920 and pay 15 rupee verification fee.'
    )
  );

  // Tool 5: QR Code Input & Result
  const [qrInput, setQrInput] = useState('upi://pay?pa=discom.billupdate.982@okaxis&pn=POWER%20DISCOM%20BILL&am=18500&tn=BILL_UPDATE');
  const [qrResult, setQrResult] = useState<NivaranToolResult | null>(() =>
    checkQrCodeTool('upi://pay?pa=discom.billupdate.982@okaxis&pn=POWER%20DISCOM%20BILL&am=18500&tn=BILL_UPDATE')
  );

  // Tool 6: SMS Parser Input & Result
  const [smsInput, setSmsInput] = useState(
    'Dear Customer, INR 18,500.00 debited from A/c XX9104 on 24-AUG-26 10:28:14 by UPI/423719820491/discom.bill/UPI. If not done by you, call 18002586161 immediately.'
  );
  const [smsResult, setSmsResult] = useState<NivaranToolResult | null>(() =>
    parseBankSmsTool(
      'Dear Customer, INR 18,500.00 debited from A/c XX9104 on 24-AUG-26 10:28:14 by UPI/423719820491/discom.bill/UPI. If not done by you, call 18002586161 immediately.'
    )
  );

  // Tool 7: Call Story Questionnaire State
  const [storyAnswers, setStoryAnswers] = useState({
    whoContacted: 'State Electricity DISCOM Officer',
    whatClaimed: 'Power disconnection in 15 minutes due to un-updated bill',
    whatInstructed: 'Click WhatsApp link and enter UPI PIN for 15-rupee verification credit',
    hasUrgency: true,
    hasApkOrLink: true
  });
  const [storyResult, setStoryResult] = useState<NivaranToolResult | null>(() =>
    evaluateCallStoryTool({
      whoContacted: 'State Electricity DISCOM Officer',
      whatClaimed: 'Power disconnection in 15 minutes due to un-updated bill',
      whatInstructed: 'Click WhatsApp link and enter UPI PIN for 15-rupee verification credit',
      hasUrgency: true,
      hasApkOrLink: true
    })
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

  const handleCrossCheckUpi = (vpa: string) => {
    setUpiInput(vpa);
    setUpiResult(checkUpiIdTool(vpa));
    setActiveToolTab('upi');
  };

  const toolTabs = [
    { id: 'upi', label: 'Check UPI ID', icon: Search },
    { id: 'phone', label: 'Check Phone Number', icon: Phone },
    { id: 'url', label: 'Check Website / URL', icon: ExternalLink },
    { id: 'payment_msg', label: 'Check Payment Request', icon: AlertTriangle },
    { id: 'qr', label: 'Check QR Code', icon: QrCode },
    { id: 'sms', label: 'Parse Bank SMS', icon: MessageSquare },
    { id: 'call_story', label: 'Analyze Call Story', icon: HelpCircle }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          NIVARAN INVESTIGATION SUITE &bull; CASE INTELLIGENCE TOOLS
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          Nivaran Fraud Mini-Tools
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed font-sans">
          Focused micro-investigation tools to evaluate suspicious identifiers, parse bank messages, and deconstruct scam patterns. <strong>Every tool result can be directly attached to your active case file.</strong>
        </p>
      </div>

      {/* Success Banner */}
      {addSuccessFeedback && (
        <div className="p-4 rounded-lg bg-brand-green-soft border border-brand-green/30 text-xs text-brand-green font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{addSuccessFeedback}</span>
          </div>
          <button
            onClick={() => setActiveTab('case_details')}
            className="underline font-mono text-[11px] hover:text-green-900"
          >
            View in Case Dossier &rarr;
          </button>
        </div>
      )}

      {/* Horizontal Tool Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-surface-border">
        {toolTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeToolTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveToolTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-surface border-t border-x border-surface-border text-brand-primary font-bold shadow-subtle -mb-px'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-brand-primary' : 'text-text-muted'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Active Tool Panel */}
      <div className="space-y-6">
        
        {/* ========================================================= */}
        {/* TOOL 1: CHECK A UPI ID */}
        {/* ========================================================= */}
        {activeToolTab === 'upi' && (
          <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <Search size={14} />
                <span>CHECK A UPI IDENTIFIER (VPA)</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-text-primary">
                Evaluate Recipient UPI Address
              </h2>
              <p className="text-xs text-text-secondary">
                Checks format structure, identifies deceptive institutional keywords in personal handles, and cross-references the Nivaran reported signals database.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (upiInput.trim()) setUpiResult(checkUpiIdTool(upiInput));
              }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                  placeholder="e.g. discom.billupdate.982@okaxis or airhelp.refunds.912@ybl"
                  className="flex-1 bg-surface-subtle border border-surface-border rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center justify-center gap-1.5"
                >
                  <Search size={14} />
                  <span>Check UPI ID</span>
                </button>
              </div>

              {/* Sample test pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-[11px] text-text-muted">Sample VPAs:</span>
                <button
                  type="button"
                  onClick={() => { setUpiInput('discom.billupdate.982@okaxis'); setUpiResult(checkUpiIdTool('discom.billupdate.982@okaxis')); }}
                  className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[11px] text-text-secondary hover:text-text-primary"
                >
                  discom.billupdate.982@okaxis (17 reports)
                </button>
                <button
                  type="button"
                  onClick={() => { setUpiInput('airhelp.refunds.912@ybl'); setUpiResult(checkUpiIdTool('airhelp.refunds.912@ybl')); }}
                  className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[11px] text-text-secondary hover:text-text-primary"
                >
                  airhelp.refunds.912@ybl (8 reports)
                </button>
                <button
                  type="button"
                  onClick={() => { setUpiInput('rajesh.sharma@oksbi'); setUpiResult(checkUpiIdTool('rajesh.sharma@oksbi')); }}
                  className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[11px] text-text-secondary hover:text-text-primary"
                >
                  rajesh.sharma@oksbi (No signals)
                </button>
              </div>
            </form>

            {/* Tool Output Box */}
            {upiResult && (
              <div className="p-5 rounded-card bg-surface-elevated border border-surface-border space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-text-muted">IDENTIFIER CHECK RESULT</div>
                    <div className="text-base font-bold font-mono text-text-primary">{upiResult.query}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachingResult(upiResult)}
                    className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <FolderPlus size={14} />
                    <span>Add Result to Case</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {upiResult.signals?.map((sig, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                        sig.type === 'critical'
                          ? 'bg-brand-red-soft border-brand-red/30 text-brand-red'
                          : sig.type === 'warning'
                          ? 'bg-brand-amber-soft border-brand-amber/30 text-brand-amber'
                          : 'bg-surface-subtle border-surface-border text-text-secondary'
                      }`}
                    >
                      {sig.type === 'critical' ? <ShieldAlert size={15} className="shrink-0 mt-0.5" /> : <Info size={15} className="shrink-0 mt-0.5" />}
                      <div>
                        <div className="font-bold font-mono">{sig.label}</div>
                        <div className="text-text-secondary font-sans leading-relaxed mt-0.5">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border text-xs text-text-muted space-y-1">
                  <div className="font-bold text-text-primary font-mono text-[11px]">Notice on Probabilistic Signals:</div>
                  <p className="font-sans leading-relaxed">
                    Evaluated against Nivaran internal reported signals and heuristic syntax analysis. Absence of a warning signal does not establish that an identifier is trustworthy.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TOOL 2: CHECK A PHONE NUMBER */}
        {/* ========================================================= */}
        {activeToolTab === 'phone' && (
          <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <Phone size={14} />
                <span>CHECK A PHONE NUMBER</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-text-primary">
                Evaluate Incoming Caller Number
              </h2>
              <p className="text-xs text-text-secondary">
                Cross-references Indian telecommunication numbering plans and previous financial fraud reports.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (phoneInput.trim()) setPhoneResult(checkPhoneNumberTool(phoneInput));
              }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. +91 70192 84920 or +91 91203 94812"
                  className="flex-1 bg-surface-subtle border border-surface-border rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center justify-center gap-1.5"
                >
                  <Search size={14} />
                  <span>Check Phone Number</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-[11px] text-text-muted">Sample numbers:</span>
                <button
                  type="button"
                  onClick={() => { setPhoneInput('+91 70192 84920'); setPhoneResult(checkPhoneNumberTool('+91 70192 84920')); }}
                  className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[11px] text-text-secondary hover:text-text-primary"
                >
                  +91 70192 84920 (DISCOM Threat Campaign)
                </button>
                <button
                  type="button"
                  onClick={() => { setPhoneInput('+91 91203 94812'); setPhoneResult(checkPhoneNumberTool('+91 91203 94812')); }}
                  className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[11px] text-text-secondary hover:text-text-primary"
                >
                  +91 91203 94812 (Fake Airline Support)
                </button>
              </div>
            </form>

            {phoneResult && (
              <div className="p-5 rounded-card bg-surface-elevated border border-surface-border space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-text-muted">PHONE CHECK RESULT</div>
                    <div className="text-base font-bold font-mono text-text-primary">{phoneResult.query}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachingResult(phoneResult)}
                    className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <FolderPlus size={14} />
                    <span>Add Result to Case</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {phoneResult.signals?.map((sig, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                        sig.type === 'critical'
                          ? 'bg-brand-red-soft border-brand-red/30 text-brand-red'
                          : 'bg-surface-subtle border-surface-border text-text-secondary'
                      }`}
                    >
                      {sig.type === 'critical' ? <ShieldAlert size={15} className="shrink-0 mt-0.5" /> : <Info size={15} className="shrink-0 mt-0.5" />}
                      <div>
                        <div className="font-bold font-mono">{sig.label}</div>
                        <div className="text-text-secondary font-sans leading-relaxed mt-0.5">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TOOL 3: CHECK A WEBSITE / URL */}
        {/* ========================================================= */}
        {activeToolTab === 'url' && (
          <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <ExternalLink size={14} />
                <span>CHECK A WEBSITE / LINK / APK URL</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-text-primary">
                Analyze Phishing & APK Download Links
              </h2>
              <p className="text-xs text-text-secondary">
                Detects deceptive subdomains, unencrypted HTTP connections, and malicious Android APK executables.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (urlInput.trim()) setUrlResult(checkWebsiteUrlTool(urlInput));
              }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. http://bescom-bill-update.xyz/download.apk"
                  className="flex-1 bg-surface-subtle border border-surface-border rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center justify-center gap-1.5"
                >
                  <Search size={14} />
                  <span>Analyze URL</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-[11px] text-text-muted">Sample URLs:</span>
                <button
                  type="button"
                  onClick={() => { setUrlInput('http://bescom-bill-update.xyz/download.apk'); setUrlResult(checkWebsiteUrlTool('http://bescom-bill-update.xyz/download.apk')); }}
                  className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[11px] text-text-secondary hover:text-text-primary"
                >
                  http://bescom-bill-update.xyz/download.apk (Phishing APK)
                </button>
                <button
                  type="button"
                  onClick={() => { setUrlInput('https://bescom.karnataka.gov.in'); setUrlResult(checkWebsiteUrlTool('https://bescom.karnataka.gov.in')); }}
                  className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[11px] text-text-secondary hover:text-text-primary"
                >
                  https://bescom.karnataka.gov.in (Official Gov.in)
                </button>
              </div>
            </form>

            {urlResult && (
              <div className="p-5 rounded-card bg-surface-elevated border border-surface-border space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-text-muted">URL CHECK RESULT</div>
                    <div className="text-base font-bold font-mono text-text-primary break-anywhere">{urlResult.query}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachingResult(urlResult)}
                    className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <FolderPlus size={14} />
                    <span>Add Result to Case</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {urlResult.signals?.map((sig, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                        sig.type === 'critical'
                          ? 'bg-brand-red-soft border-brand-red/30 text-brand-red'
                          : 'bg-brand-amber-soft border-brand-amber/30 text-brand-amber'
                      }`}
                    >
                      {sig.type === 'critical' ? <ShieldAlert size={15} className="shrink-0 mt-0.5" /> : <AlertTriangle size={15} className="shrink-0 mt-0.5" />}
                      <div>
                        <div className="font-bold font-mono">{sig.label}</div>
                        <div className="text-text-secondary font-sans leading-relaxed mt-0.5">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TOOL 4: CHECK A PAYMENT REQUEST MESSAGE */}
        {/* ========================================================= */}
        {activeToolTab === 'payment_msg' && (
          <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <AlertTriangle size={14} />
                <span>IS THIS PAYMENT REQUEST SUSPICIOUS?</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-text-primary">
                Scan WhatsApp or SMS Text
              </h2>
              <p className="text-xs text-text-secondary">
                Parses psychological triggers, nominal verification payment traps, and impersonation scripts.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (paymentMsgInput.trim()) setPaymentMsgResult(checkPaymentRequestTool(paymentMsgInput));
              }}
              className="space-y-3"
            >
              <textarea
                rows={4}
                value={paymentMsgInput}
                onChange={(e) => setPaymentMsgInput(e.target.value)}
                placeholder="Paste the received message text..."
                className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 text-xs font-mono text-text-primary outline-none focus:border-brand-primary"
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
              >
                <Search size={14} />
                <span>Evaluate Message Text</span>
              </button>
            </form>

            {paymentMsgResult && (
              <div className="p-5 rounded-card bg-surface-elevated border border-surface-border space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-text-muted">PAYMENT MESSAGE VERDICT</div>
                    <div className="text-sm font-bold text-text-primary">{paymentMsgResult.summary}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachingResult(paymentMsgResult)}
                    className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <FolderPlus size={14} />
                    <span>Add Result to Case</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {paymentMsgResult.signals?.map((sig, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                        sig.type === 'critical'
                          ? 'bg-brand-red-soft border-brand-red/30 text-brand-red'
                          : 'bg-brand-amber-soft border-brand-amber/30 text-brand-amber'
                      }`}
                    >
                      <ShieldAlert size={15} className="shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold font-mono">{sig.label}</div>
                        <div className="text-text-secondary font-sans leading-relaxed mt-0.5">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TOOL 5: CHECK A QR CODE */}
        {/* ========================================================= */}
        {activeToolTab === 'qr' && (
          <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <QrCode size={14} />
                <span>CHECK A QR CODE</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-text-primary">
                Deconstruct UPI QR Code Payload
              </h2>
              <p className="text-xs text-text-secondary">
                Extracts the hidden payee VPA, merchant display name, and amount from QR barcodes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-brand-red-soft border border-brand-red/25 text-xs text-brand-red font-semibold flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>
                RULE OF THUMB: Scanning a QR code and entering your PIN ALWAYS DEBITS money. You never scan a QR code to receive a refund or payment.
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (qrInput.trim()) setQrResult(checkQrCodeTool(qrInput));
              }}
              className="space-y-3"
            >
              <label className="block text-xs font-semibold text-text-primary">
                QR UPI Payload or Text String:
              </label>
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="upi://pay?pa=discom.billupdate.982@okaxis&pn=POWER%20DEPT&am=18500"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-text-primary outline-none focus:border-brand-primary"
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
              >
                <Search size={14} />
                <span>Extract QR Details</span>
              </button>
            </form>

            {qrResult && (
              <div className="p-5 rounded-card bg-surface-elevated border border-surface-border space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-text-muted">EXTRACTED QR PAYEE</div>
                    <div className="text-base font-bold font-mono text-brand-primary">{qrResult.extractedData?.upiId}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {qrResult.extractedData?.upiId && (
                      <button
                        type="button"
                        onClick={() => handleCrossCheckUpi(qrResult.extractedData!.upiId!)}
                        className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle text-brand-primary border border-brand-primary/30 font-semibold text-xs transition-colors"
                      >
                        Check this UPI ID &rarr;
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setAttachingResult(qrResult)}
                      className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
                    >
                      <FolderPlus size={14} />
                      <span>Add Result to Case</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-surface-subtle p-3 rounded-lg border border-surface-border">
                  <div>
                    <span className="text-text-muted text-[10px] uppercase block">Payee Merchant:</span>
                    <span className="font-bold text-text-primary">{qrResult.extractedData?.merchant}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] uppercase block">Target Amount:</span>
                    <span className="font-bold text-brand-red">₹{qrResult.extractedData?.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] uppercase block">Payload Action:</span>
                    <span className="font-bold text-brand-amber uppercase">Direct Debit</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TOOL 6: PARSE A BANK SMS */}
        {/* ========================================================= */}
        {activeToolTab === 'sms' && (
          <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <MessageSquare size={14} />
                <span>CHECK A BANK SMS / TRANSACTION PARSER</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-text-primary">
                Extract 12-Digit UTR, Bank & Amount
              </h2>
              <p className="text-xs text-text-secondary">
                Paste any debit SMS alert to instantly parse official banking parameters into a structured transaction record.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (smsInput.trim()) setSmsResult(parseBankSmsTool(smsInput));
              }}
              className="space-y-3"
            >
              <textarea
                rows={3}
                value={smsInput}
                onChange={(e) => setSmsInput(e.target.value)}
                placeholder="Paste your bank debit confirmation SMS..."
                className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 text-xs font-mono text-text-primary outline-none focus:border-brand-primary"
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
              >
                <Search size={14} />
                <span>Parse Bank SMS</span>
              </button>
            </form>

            {smsResult && (
              <div className="p-5 rounded-card bg-surface-elevated border border-surface-border space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-brand-green font-bold">PARSED TRANSACTION RECORD</div>
                    <div className="text-sm font-bold text-text-primary">{smsResult.summary}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachingResult(smsResult)}
                    className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <FolderPlus size={14} />
                    <span>Add Transaction to Case</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-surface-subtle p-3 rounded-lg border border-surface-border">
                  <div>
                    <span className="text-text-muted text-[10px] uppercase block">Bank Name</span>
                    <span className="font-bold text-text-primary">{smsResult.extractedData?.bank}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] uppercase block">Account</span>
                    <span className="font-bold text-text-primary">*{smsResult.extractedData?.senderAccountMasked}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] uppercase block">Disputed Loss</span>
                    <span className="font-bold text-brand-red">₹{smsResult.extractedData?.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] uppercase block">12-Digit UTR</span>
                    <span className="font-bold text-brand-primary">{smsResult.extractedData?.utrNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TOOL 7: CHECK A PHONE CALL STORY (Questionnaire) */}
        {/* ========================================================= */}
        {activeToolTab === 'call_story' && (
          <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary">
                <HelpCircle size={14} />
                <span>CHECK A CALL / MESSAGE STORY (GUIDED QUESTIONNAIRE)</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-text-primary">
                Deconstruct Scam Modus Operandi
              </h2>
              <p className="text-xs text-text-secondary">
                Answer 5 simple questions to classify the preliminary fraud pattern without needing cybersecurity terminology.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-text-primary mb-1">1. Who contacted you?</label>
                <select
                  value={storyAnswers.whoContacted}
                  onChange={(e) => setStoryAnswers({ ...storyAnswers, whoContacted: e.target.value })}
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
                >
                  <option value="State Electricity DISCOM Officer">State Electricity DISCOM Officer (BESCOM/MSEDCL/TNEB/etc.)</option>
                  <option value="Bank KYC & Account Support">Bank KYC & Account Support Desk</option>
                  <option value="Airline Baggage / DTDC Courier Support">Airline Baggage / DTDC Courier Support</option>
                  <option value="Police / Customs / Narcotics (Digital Arrest)">Police / Customs / Narcotics (Digital Arrest)</option>
                  <option value="Telegram / YouTube Rating Task Recruiter">Telegram / YouTube Rating Task Recruiter</option>
                  <option value="Classified Marketplace Buyer (OLX/Facebook)">Classified Marketplace Buyer (OLX/Facebook)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">2. What did they claim?</label>
                <input
                  type="text"
                  value={storyAnswers.whatClaimed}
                  onChange={(e) => setStoryAnswers({ ...storyAnswers, whatClaimed: e.target.value })}
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">3. What did they instruct you to do?</label>
                <input
                  type="text"
                  value={storyAnswers.whatInstructed}
                  onChange={(e) => setStoryAnswers({ ...storyAnswers, whatInstructed: e.target.value })}
                  className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={storyAnswers.hasUrgency}
                    onChange={(e) => setStoryAnswers({ ...storyAnswers, hasUrgency: e.target.checked })}
                    className="accent-brand-primary"
                  />
                  <span>Imposed artificial urgency (15-minute power cut / arrest threat)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={storyAnswers.hasApkOrLink}
                    onChange={(e) => setStoryAnswers({ ...storyAnswers, hasApkOrLink: e.target.checked })}
                    className="accent-brand-primary"
                  />
                  <span>Sent WhatsApp link / APK download / AnyDesk install</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => setStoryResult(evaluateCallStoryTool(storyAnswers))}
                className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Zap size={14} />
                <span>Classify Pattern</span>
              </button>
            </div>

            {storyResult && (
              <div className="p-5 rounded-card bg-surface-elevated border border-surface-border space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-brand-primary font-bold">PRELIMINARY PATTERN ASSESSMENT</div>
                    <div className="text-sm font-bold text-text-primary">{storyResult.summary}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachingResult(storyResult)}
                    className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <FolderPlus size={14} />
                    <span>Add Result to Case</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {storyResult.signals?.map((sig, i) => (
                    <div key={i} className="p-3 rounded-lg bg-brand-red-soft border border-brand-red/30 text-brand-red text-xs flex items-start gap-2">
                      <ShieldAlert size={15} className="shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold font-mono">{sig.label}</div>
                        <div className="text-text-secondary font-sans leading-relaxed mt-0.5">{sig.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: Add Tool Result to Case */}
      {attachingResult && (
        <Modal
          isOpen={attachingResult !== null}
          onClose={() => setAttachingResult(null)}
          title="Attach Intelligence to Case Dossier"
          subtitle={attachingResult.toolName}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
              <div className="font-bold text-text-primary">{attachingResult.toolName} Result:</div>
              <div className="font-mono text-text-secondary leading-relaxed text-[11px]">{attachingResult.summary}</div>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">
                Select Destination Case:
              </label>
              <select
                value={targetCaseId}
                onChange={(e) => setTargetCaseId(e.target.value)}
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm font-mono text-text-primary outline-none focus:border-brand-primary"
              >
                {cases.map((c) => (
                  <option key={c.caseId} value={c.caseId}>
                    {c.caseId} — {c.analysis.likelyType} (₹{c.transactions.reduce((s, tx) => s + (tx.amount || 0), 0).toLocaleString('en-IN')})
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
                className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs shadow-subtle flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Confirm & Attach to Dossier</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
