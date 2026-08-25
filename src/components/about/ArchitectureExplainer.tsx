import React from 'react';
import {
  ArrowDown,
  Building2,
  CheckCircle,
  Clock,
  FileCheck,
  FolderOpen,
  HelpCircle,
  Layers,
  Lock,
  PhoneCall,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

export const ArchitectureExplainer: React.FC = () => {
  const { setActiveTab, setIntakeStep } = useIncident();

  const lifecycleNodes = [
    { title: 'CAPTURE', tag: 'EVIDENCE-FIRST', desc: 'User uploads payment receipts, bank SMS, statement PDF, or threat chats.', color: 'border-brand-primary/30 text-brand-primary bg-brand-soft' },
    { title: 'UNDERSTAND', tag: 'OCR & PATTERNS', desc: 'Automated extraction of amount, 12-digit UTR, VPA, timestamps, and deception tactics.', color: 'border-brand-blue/30 text-brand-blue bg-brand-blue-soft' },
    { title: 'VERIFY', tag: 'CONFIRMED DATA', desc: 'Inspect every parameter. Direct editing with "Looks clear" / "Please verify" badges.', color: 'border-brand-green/30 text-brand-green bg-brand-green-soft' },
    { title: 'CONNECT', tag: 'RECONCILIATION', desc: 'Compares evidence across sources to verify matching amounts and flag conflicts.', color: 'border-brand-amber/30 text-brand-amber bg-brand-amber-soft' },
    { title: 'PREPARE', tag: 'CASE DOSSIER', desc: 'Builds continuous case record with Case Readiness scoring and 1930 / Bank calling scripts.', color: 'border-brand-primary/30 text-brand-primary bg-brand-soft' },
    { title: 'REPORT', tag: 'OFFICIAL CHANNELS', desc: 'Link official complaint numbers (Bank ticket, 1930 reference, NCRP acknowledgement).', color: 'border-surface-border text-text-primary bg-surface' },
    { title: 'CONTINUE', tag: 'CASE MEMORY', desc: 'Interprets bank rejection letters, explains what changed, and computes the next action.', color: 'border-brand-primary/40 text-brand-primary bg-brand-soft' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-10 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          SYSTEM ARCHITECTURE &bull; PRODUCT DIFFERENTIATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          How Nivaran Works
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed font-sans">
          Nivaran is a <strong>privacy-preserving fraud case intelligence platform</strong>. Sits before and around official Indian reporting channels (NCRP, 1930, banks) to continuously organize evidence and coordinate responses.
        </p>
      </div>

      {/* Core Differentiation Box (Specification #24) */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase tracking-wide border-b border-surface-border/60 pb-3">
          <Shield size={16} />
          <span>Product Positioning: Nivaran vs. Official Channels</span>
        </div>

        <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border text-xs text-text-secondary leading-relaxed font-sans italic text-center">
          &ldquo;Official systems handle reporting and investigation. Nivaran helps organise the information surrounding your case.&rdquo;
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded-lg bg-brand-soft border border-brand-primary/20 space-y-2">
            <div className="font-mono font-bold text-brand-primary uppercase flex items-center gap-1.5">
              <Layers size={14} />
              <span>NIVARAN CASE INTELLIGENCE</span>
            </div>
            <ul className="space-y-1 text-text-secondary">
              <li>&bull; Evidence capture from multiple documents</li>
              <li>&bull; Extraction &amp; user verification</li>
              <li>&bull; Multi-evidence reconciliation &amp; conflict detection</li>
              <li>&bull; Unified official reference management</li>
              <li>&bull; Plain-English response interpreter &amp; comparison</li>
              <li>&bull; Anonymized fraud network intelligence</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-2">
            <div className="font-mono font-bold text-text-primary uppercase flex items-center gap-1.5">
              <Building2 size={14} />
              <span>OFFICIAL STATUTORY CHANNELS</span>
            </div>
            <ul className="space-y-1 text-text-secondary">
              <li>&bull; 1930 / I4C National Helpline (Inter-bank lien freezes)</li>
              <li>&bull; cybercrime.gov.in / NCRP (Formal cyber police FIR)</li>
              <li>&bull; Bank Nodal Fraud Cells (Dispute investigation)</li>
              <li>&bull; RBI CMS Banking Ombudsman (Adjudication)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* The 7-Stage Core User Journey */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide border-b border-surface-border/60 pb-3">
          <FolderOpen size={16} className="text-brand-primary" />
          <span>The 7-Stage Case Lifecycle</span>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {lifecycleNodes.map((node, i) => (
            <React.Fragment key={i}>
              <div className={`p-4 rounded-card border ${node.color} transition-all shadow-subtle`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wide">
                    Step {i + 1}: {node.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border font-bold">
                    {node.tag}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 font-sans">
                  {node.desc}
                </p>
              </div>

              {i < lifecycleNodes.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown size={18} className="text-text-muted/60" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* RBI Zero-Liability Guidelines Summary */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase tracking-wide border-b border-surface-border/60 pb-3">
          <Scale size={16} />
          <span>RBI Guidelines on Customer Liability for Electronic Transactions</span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed font-sans">
          The Reserve Bank of India (RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18) establishes statutory timelines for customer protection:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-brand-green-soft/50 border border-brand-green/20 space-y-1">
            <div className="font-bold text-brand-green uppercase text-[11px]">Within 3 Days</div>
            <div className="text-text-secondary font-sans text-xs">Zero Customer Liability if reported to the bank within 3 working days of unauthorized debit.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-brand-amber-soft/50 border border-brand-amber/20 space-y-1">
            <div className="font-bold text-brand-amber uppercase text-[11px]">4 to 7 Days</div>
            <div className="text-text-secondary font-sans text-xs">Limited Customer Liability (capped at ₹5,000 to ₹10,000 based on account tier).</div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-1">
            <div className="font-bold text-text-muted uppercase text-[11px]">Beyond 7 Days</div>
            <div className="text-text-secondary font-sans text-xs">Determined as per Board-approved Bank Policy &amp; Ombudsman review.</div>
          </div>
        </div>
      </div>

    </div>
  );
};
