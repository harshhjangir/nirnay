import React from 'react';
import { ExternalLink, Lock, PhoneCall, Shield, ShieldCheck } from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useIncident();

  return (
    <footer className="border-t border-surface-border bg-surface text-text-secondary mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Platform Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded bg-brand-soft border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                <Shield size={16} />
              </div>
              <span className="font-display font-extrabold text-lg text-text-primary tracking-tight">
                NIVARAN
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Intelligent financial-cybercrime first-response and case-preparation platform. Sits before and around official Indian reporting channels to structure evidence in the critical initial hours.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-primary font-medium">
              <Lock size={12} />
              <span>Zero-Storage Client Encryption</span>
            </div>
          </div>

          {/* Col 2: Official Indian Government Channels */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary mb-3">
              Official Indian Authorities
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="tel:1930"
                  className="text-text-secondary hover:text-brand-primary flex items-center gap-1.5 font-mono font-medium"
                >
                  <PhoneCall size={12} className="text-brand-red" />
                  1930 (National Cyber Helpline)
                </a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-brand-primary flex items-center gap-1"
                >
                  <span>NCRP (cybercrime.gov.in)</span>
                  <ExternalLink size={11} className="text-text-muted" />
                </a>
              </li>
              <li>
                <a
                  href="https://cms.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-brand-primary flex items-center gap-1"
                >
                  <span>RBI Complaint Portal (CMS)</span>
                  <ExternalLink size={11} className="text-text-muted" />
                </a>
              </li>
              <li>
                <a
                  href="https://cert-in.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-brand-primary flex items-center gap-1"
                >
                  <span>CERT-In Incident Desk</span>
                  <ExternalLink size={11} className="text-text-muted" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary mb-3">
              Platform Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('intake')}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Report Incident (6-Step Intake)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('track_case')}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Track an Existing Case
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('bank_directory')}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Bank Fraud Helplines & SMS Codes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('learn')}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Fraud Playbooks & Prevention
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  How NIVARAN Works & Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Disclaimer */}
          <div className="bg-surface-elevated border border-surface-border p-4 rounded-card">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-amber mb-2">
              <ShieldCheck size={14} />
              <span>LEGAL & PROCEDURAL NOTICE</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              NIVARAN provides immediate procedural guidance, timeline structuring, and case dossier compilation. It does <strong className="text-text-secondary">not</strong> replace official statutory complaints on cybercrime.gov.in or formal instructions from your bank.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            &copy; {new Date().getFullYear()} NIVARAN &bull; Financial Fraud First-Response Platform. Built for Indian digital safety.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-brand-green flex items-center gap-1 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green"></span>
              ALL DATA PROCESSED LOCALLY
            </span>
            <span>WCAG AAA COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
