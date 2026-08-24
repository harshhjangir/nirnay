import React from 'react';
import {
  ArrowDown,
  Building2,
  CheckCircle,
  Clock,
  FileCheck,
  HelpCircle,
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

  const flowNodes = [
    { title: 'Victim of Digital Financial Fraud', desc: 'Experiencing sudden monetary loss, panic, and uncertainty', color: 'border-brand-red/30 text-brand-red bg-brand-red-soft' },
    { title: 'NIVARAN Emergency Response Layer', desc: 'Immediate incident triage, classification, and device containment', color: 'border-brand-primary/30 text-brand-primary bg-brand-soft' },
    { title: 'Pattern & Heuristic Analysis', desc: 'Identifies modus operandi (UPI Social Engineering, Remote Access, Phishing)', color: 'border-brand-blue/30 text-brand-blue bg-brand-blue-soft' },
    { title: 'Evidence & Transaction Structuring', desc: 'Extracts 12-digit UTR, timestamps, and verifies digital screenshots', color: 'border-brand-amber/30 text-brand-amber bg-brand-amber-soft' },
    { title: 'Personalized Action & Call Scripts', desc: 'Word-for-word scripts for calling 1930 and bank fraud desks', color: 'border-brand-primary/30 text-brand-primary bg-brand-soft' },
    { title: 'Structured Case Summary Package', desc: 'Generates standardized PDF dossier & formal bank dispute notices', color: 'border-surface-border text-text-primary bg-surface' },
    { title: 'Official Handover Channels', desc: 'Direct escalation to 1930 Helpline, cybercrime.gov.in (NCRP), and Bank Nodal Officers', color: 'border-brand-primary/40 text-brand-primary bg-brand-soft' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-10 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          SYSTEM ARCHITECTURE &bull; ECOSYSTEM POSITIONING
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          How NIVARAN Works
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed">
          NIVARAN is an intelligent first-response and case-preparation platform. It sits <strong>before and around</strong> existing Indian reporting infrastructure (1930 and NCRP) to bridge the critical information gap during the golden hours of fraud.
        </p>
      </div>

      {/* The Core Architecture Flow */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide border-b border-surface-border/60 pb-3">
          <Shield size={16} className="text-brand-primary" />
          <span>The NIVARAN Operational Triage Pipeline</span>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {flowNodes.map((node, i) => (
            <React.Fragment key={i}>
              <div className={`p-4 rounded-card border ${node.color} transition-all shadow-subtle`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wide">
                    Step {i + 1}: {node.title}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 font-sans">
                  {node.desc}
                </p>
              </div>

              {i < flowNodes.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown size={18} className="text-text-muted/60" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Why NIVARAN Sits Before Official Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-blue uppercase">
            <Zap size={15} />
            <span>The Problem with Raw Reporting</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            When victims call 1930 or log onto cybercrime.gov.in in panic, they frequently lack the exact 12-digit UTR numbers, beneficiary VPA handles, or device isolation steps needed. Without accurate parameters, the inter-bank freeze cannot be triggered in time.
          </p>
        </div>

        <div className="p-5 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
            <ShieldCheck size={15} />
            <span>The NIVARAN Solution</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            NIVARAN guides the victim step-by-step to extract clean technical identifiers, isolate active screen-sharing malwares, generate a structured legal dossier, and speak to operators with word-for-word confidence.
          </p>
        </div>
      </div>

      {/* RBI Zero-Liability Guidelines Summary */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-amber uppercase tracking-wide border-b border-surface-border/60 pb-3">
          <Scale size={16} />
          <span>RBI Guidelines on Customer Liability for Unauthorized Transactions</span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed font-sans">
          The Reserve Bank of India (RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18) establishes clear timeframes for customer liability reversal:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-brand-green-soft/50 border border-brand-green/20 space-y-1">
            <div className="font-bold text-brand-green uppercase text-[11px]">Within 3 Days</div>
            <div className="text-text-secondary font-sans text-xs">Zero Customer Liability if reported within 3 working days of unauthorized debit.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-brand-amber-soft/50 border border-brand-amber/20 space-y-1">
            <div className="font-bold text-brand-amber uppercase text-[11px]">4 to 7 Days</div>
            <div className="text-text-secondary font-sans text-xs">Limited Customer Liability (capped at ₹5,000 to ₹10,000 based on account type).</div>
          </div>

          <div className="p-3.5 rounded-lg bg-brand-red-soft/50 border border-brand-red/20 space-y-1">
            <div className="font-bold text-brand-red uppercase text-[11px]">Beyond 7 Days</div>
            <div className="text-text-secondary font-sans text-xs">Liability determined per Bank Board-approved policy. Immediate filing is paramount.</div>
          </div>
        </div>
      </div>

      {/* Data Privacy & Zero Retention */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-subtle space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-primary uppercase">
          <Lock size={15} />
          <span>Data Privacy & Zero Remote Retention</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed font-sans">
          NIVARAN operates client-side inside your browser session. Your account numbers, phone numbers, and evidence artifacts are processed locally and compiled directly into your downloadable PDF dossier. No financial data is transmitted to third-party marketing servers.
        </p>
      </div>

      {/* Action CTA */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() => {
            setIntakeStep(1);
            setActiveTab('intake');
          }}
          className="px-8 py-3.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-card"
        >
          Start Incident Assessment Now &rarr;
        </button>
      </div>
    </div>
  );
};
