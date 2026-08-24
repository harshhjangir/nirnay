import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck,
  FileText,
  Info,
  Layers,
  PhoneCall,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { Modal } from '../common/Modal';

export const EmergencyWorkflow: React.FC = () => {
  const { setActiveTab } = useIncident();
  const [activeStepModal, setActiveStepModal] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'STOP FURTHER TRANSFERS',
      tag: 'IMMEDIATE',
      color: 'border-brand-red/30 bg-brand-red-soft text-brand-red',
      shortDesc: 'Disconnect phone internet / Turn on Airplane Mode if remote app was installed. Block UPI access.',
      detail: 'If you installed screen-sharing tools (AnyDesk, TeamViewer) or downloaded an APK, scammers can view incoming OTPs. Turn ON Airplane mode immediately. Do not attempt further test payments.',
      actionLabel: 'Device Security Guide',
      icon: Smartphone
    },
    {
      number: '02',
      title: 'CONTACT YOUR BANK',
      tag: 'WITHIN 15 MINS',
      color: 'border-brand-amber/30 bg-brand-amber-soft text-brand-amber',
      shortDesc: 'Call bank fraud helpline to freeze debit account and log an unauthorized transaction dispute.',
      detail: 'Your bank can issue an internal recall memo (RRN Recall) to the recipient bank and hotlist your debit card or UPI handle to prevent subsequent unauthorized debits.',
      actionLabel: 'View Bank Numbers',
      icon: Building2,
      actionTab: 'bank_directory'
    },
    {
      number: '03',
      title: 'CALL 1930 (I4C HELPLINE)',
      tag: 'GOLDEN HOUR',
      color: 'border-brand-red/40 bg-brand-red-soft text-brand-red font-bold',
      shortDesc: 'National Cyber Crime Reporting Helpline connects directly to beneficiary bank nodal officers.',
      detail: 'Dial 1930 immediately. Under the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS), I4C places a lien on the recipient bank account before the fraudster transfers money out.',
      actionLabel: '1930 Helpline Guide',
      icon: PhoneCall,
      actionTab: 'bank_directory'
    },
    {
      number: '04',
      title: 'PRESERVE EVIDENCE',
      tag: 'DO NOT DELETE',
      color: 'border-brand-blue/30 bg-brand-blue-soft text-brand-blue',
      shortDesc: 'Save original WhatsApp chats, payment confirmation screenshots, debit SMS, and call records.',
      detail: 'Do not delete chat transcripts or call records. Export WhatsApp conversations without media. Capture screenshots showing 12-digit UTR numbers and transaction timestamps.',
      actionLabel: 'Evidence Checklist',
      icon: FileCheck,
      actionTab: 'learn'
    },
    {
      number: '05',
      title: 'FILE OFFICIAL NCRP REPORT',
      tag: 'LEGAL RECORD',
      color: 'border-brand-green/30 bg-brand-green-soft text-brand-green',
      shortDesc: 'Submit complete incident details on cybercrime.gov.in (NCRP) with the generated NIVARAN Dossier.',
      detail: 'Completing the formal NCRP complaint generates an official Police Acknowledgement Number required by banks and the RBI Ombudsman for financial claim adjudication.',
      actionLabel: 'View Case Portal',
      icon: CheckCircle2,
      actionTab: 'track_case'
    }
  ];

  const pillars = [
    {
      title: 'UNDERSTAND',
      desc: 'Explain what happened in plain language. Identify likely fraud patterns without confusing legal jargon.',
      icon: Search,
      color: 'bg-brand-blue-soft text-brand-blue'
    },
    {
      title: 'ORGANIZE',
      desc: 'Bring transactions, 12-digit UTRs, and digital screenshots together into a standardized legal dossier.',
      icon: Layers,
      color: 'bg-brand-soft text-brand-primary'
    },
    {
      title: 'ACT',
      desc: 'Get word-for-word scripts and direct phone helplines for 1930 and bank fraud escalation cells.',
      icon: PhoneCall,
      color: 'bg-brand-red-soft text-brand-red'
    },
    {
      title: 'TRACK',
      desc: 'Follow your case progress step-by-step from initial report to bank inquiry resolution.',
      icon: TrendingUp,
      color: 'bg-brand-green-soft text-brand-green'
    }
  ];

  return (
    <div className="space-y-0">
      {/* 1. Emergency Protocol Section ("Minutes matter.") */}
      <section className="py-14 bg-surface border-b border-surface-border">
        <div className="container mx-auto px-4">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-red uppercase tracking-wider mb-2">
                <Clock size={14} />
                <span>EMERGENCY FIRST-RESPONSE PROTOCOL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
                Minutes matter.
              </h2>
              <p className="mt-2 text-sm text-text-secondary max-w-2xl leading-relaxed">
                Financial cyber fraud follows a strict operational timeline. Taking the right actions in the first 2 hours multiplies the likelihood of freezing stolen funds.
              </p>
            </div>

            <div className="bg-surface-elevated border border-surface-border p-3.5 rounded-card flex items-center gap-3 shrink-0 shadow-subtle">
              <div className="h-9 w-9 rounded-lg bg-brand-amber-soft border border-brand-amber/30 flex items-center justify-center text-brand-amber shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="text-xs">
                <div className="font-bold text-text-primary font-mono">GOLDEN HOUR WINDOW: 0 - 120 MINS</div>
                <div className="text-text-muted">Inter-bank lien success rate drops after funds layer</div>
              </div>
            </div>
          </div>

          {/* 5-Step Horizontal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative rounded-card bg-surface border border-surface-border hover:border-surface-border-active hover:shadow-card transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-black text-text-muted/50 group-hover:text-text-primary transition-colors">
                        {step.number}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${step.color}`}>
                        {step.tag}
                      </span>
                    </div>

                    <div className="h-8 w-8 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-center text-text-primary mb-3">
                      <Icon size={16} />
                    </div>

                    {/* Step Title & Copy */}
                    <h3 className="text-xs font-bold text-text-primary tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4">
                      {step.shortDesc}
                    </p>
                  </div>

                  {/* Card Action */}
                  <button
                    onClick={() => {
                      if (step.actionTab) {
                        setActiveTab(step.actionTab);
                      } else {
                        setActiveStepModal(idx);
                      }
                    }}
                    className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-semibold text-brand-primary hover:text-brand-hover transition-colors w-full"
                  >
                    <span>{step.actionLabel}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Institutional Disclaimer */}
          <div className="mt-8 p-4 rounded-card bg-surface-elevated border border-surface-border text-xs text-text-muted flex items-start gap-3">
            <Info size={16} className="text-brand-blue shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-text-secondary font-semibold">Institutional Notice:</strong> NIVARAN provides guidance and case preparation. It does not replace official instructions from your bank, law enforcement, or the 1930 helpline. Always verify official bank phone numbers directly on the back of your debit card or the official bank website.
            </p>
          </div>

        </div>
      </section>

      {/* 2. Trust & Pillars Section ("Built to help you act quickly.") */}
      <section className="py-14 bg-bg-primary border-b border-surface-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>HOW NIVARAN PROTECTS CITIZENS</span>
            </div>
            <h2 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
              Built to help you act quickly.
            </h2>
            <p className="text-sm text-text-secondary">
              A structured four-part response system designed to replace confusion with control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${p.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-text-primary">
                    {p.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step Detail Modal */}
      {activeStepModal !== null && (
        <Modal
          isOpen={activeStepModal !== null}
          onClose={() => setActiveStepModal(null)}
          title={`Step ${steps[activeStepModal].number}: ${steps[activeStepModal].title}`}
          subtitle={steps[activeStepModal].tag}
        >
          <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
            <div className="p-3.5 rounded-lg bg-surface-elevated border border-surface-border text-text-primary font-medium">
              {steps[activeStepModal].shortDesc}
            </div>
            <p className="text-xs leading-relaxed">{steps[activeStepModal].detail}</p>
            <div className="p-3 rounded-lg bg-brand-blue-soft border border-brand-blue/20 text-xs text-brand-blue flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>Take this step before filing lengthy forms. Immediate isolation stops recurring debits.</span>
            </div>
            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setActiveStepModal(null)}
                className="px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold text-xs"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
