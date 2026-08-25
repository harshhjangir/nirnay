import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  FileCheck,
  FileText,
  HelpCircle,
  Layers,
  PhoneCall,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { Modal } from '../common/Modal';

export const EmergencyWorkflow: React.FC = () => {
  const { setActiveTab, setIntakeStep, selectCase, activeCase } = useIncident();
  const [activeStepModal, setActiveStepModal] = useState<number | null>(null);

  // 7-Step Nivaran Core Journey (Specification #2)
  const journeySteps = [
    {
      step: '01',
      title: 'CAPTURE',
      tag: 'EVIDENCE-FIRST',
      desc: 'Start with whatever evidence you have: payment screenshot, bank SMS, statement, WhatsApp chat, or email.',
      detail: 'No long manual forms required up front. Nivaran accepts screenshots, PDF statements, and raw transaction SMS text.'
    },
    {
      step: '02',
      title: 'UNDERSTAND',
      tag: 'OCR & PATTERNS',
      desc: 'Automated parameter extraction for amounts, 12-digit UTRs, VPAs, timestamps, and deception tactics.',
      detail: 'Extracts exact banking identifiers with explicit source labels. Identifies modus operandi without legal jargon.'
    },
    {
      step: '03',
      title: 'VERIFY',
      tag: 'NO BLIND OCR',
      desc: 'Confirm extracted fields directly. Every single parameter is inspectable and user-editable.',
      detail: 'Nivaran marks fields with confidence tags ("Looks clear", "Please verify"). Direct inline editing ensures total accuracy.'
    },
    {
      step: '04',
      title: 'CONNECT',
      tag: 'RECONCILIATION',
      desc: 'Cross-compares multiple evidence sources to verify matching amounts and flag information conflicts.',
      detail: 'Discrepancies between your bank SMS and payment receipt are detected automatically before you report them to authorities.'
    },
    {
      step: '05',
      title: 'PREPARE',
      tag: 'CASE DOSSIER',
      desc: 'Builds a standardized case record with Nivaran Case Readiness scoring and calling scripts.',
      detail: 'Generates word-for-word scripts for 1930 and bank helplines with exact 12-digit UTR and bank details ready.'
    },
    {
      step: '06',
      title: 'REPORT',
      tag: 'OFFICIAL CHANNELS',
      desc: 'Link official complaint numbers (Bank ticket, 1930 reference, NCRP acknowledgement).',
      detail: 'Unifies all official tickets into a single tracking record. Truthful status tracking without fabricated claims.'
    },
    {
      step: '07',
      title: 'CONTINUE',
      tag: 'CASE MEMORY',
      desc: 'Upload incoming bank or NCRP responses. Nivaran explains what changed and identifies the next action.',
      detail: 'Interprets bank rejection letters, compares against case evidence, and provides structured escalation ladder steps.'
    }
  ];

  return (
    <section className="py-12 bg-surface-subtle/50 border-b border-surface-border">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
            THE NIVARAN CASE INTELLIGENCE LIFECYCLE
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
            One Fraud &bull; One Case &bull; One Continuous Record
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Instead of starting from scratch at every helpline, Nivaran acts as your persistent fraud case intelligence layer.
          </p>
        </div>

        {/* 7-Step Journey Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {journeySteps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle flex flex-col justify-between hover:border-brand-primary/40 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-primary">
                    {s.step}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle border border-surface-border text-text-muted">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                  {s.title}
                </h3>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Nivaran vs Official Channels Ecosystem Box (Specification #24) */}
        <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-primary" />
              <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
                Ecosystem Architecture: How Nivaran Coordinates with Official Infrastructure
              </span>
            </div>
            <span className="text-[11px] font-mono text-text-muted">
              Non-Government Coordination Layer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left: Nivaran's Role */}
            <div className="md:col-span-6 p-4 rounded-lg bg-brand-soft border border-brand-primary/20 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary font-mono uppercase">
                <Layers size={15} />
                <span>NIVARAN (Case Intelligence Layer)</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Turns scattered receipts, WhatsApp threats, and bank SMS alerts into a verified, reconciled fraud dossier. Maintains case memory, detects discrepancies, and tracks external responses.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-brand-primary">
                <span className="px-2 py-0.5 rounded bg-surface border border-brand-primary/30">Evidence Capture</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-brand-primary/30">Reconciliation</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-brand-primary/30">Response Interpreter</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-brand-primary/30">Readiness Score</span>
              </div>
            </div>

            {/* Right: Official Channels */}
            <div className="md:col-span-6 p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-text-primary font-mono uppercase">
                <Building2 size={15} />
                <span>OFFICIAL STATUTORY CHANNELS</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Statutory authorities conduct investigations, enforce banking liens, reverse disputed transactions, and adjudicate legal claims under official mandates.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-text-muted">
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-border">1930 / I4C Helpline</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-border">NCRP (cybercrime.gov.in)</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-border">Bank Nodal Fraud Cells</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-border">RBI Banking Ombudsman</span>
              </div>
            </div>

          </div>

          <div className="text-center text-xs text-text-muted italic">
            “Official systems handle reporting and investigation. Nivaran helps organise the information surrounding your case.”
          </div>
        </div>

      </div>
    </section>
  );
};
