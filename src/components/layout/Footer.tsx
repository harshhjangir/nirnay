import React from 'react';
import { ExternalLink, FolderOpen, Lock, PhoneCall, Shield, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useIncident();

  return (
    <footer className="border-t border-surface-border bg-surface-subtle/50 text-text-secondary mt-12 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        
        {/* Uniform 4-Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Box 1: Platform Info Card */}
          <div className="p-4.5 rounded-card bg-surface border border-surface-border shadow-subtle flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-brand-primary text-white flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <span className="font-display font-extrabold text-base text-text-primary tracking-tight">
                  NIRNAY
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Privacy-preserving fraud case intelligence platform. Sits before and around official Indian reporting channels (NCRP, 1930, banks) to continuously organize evidence.
              </p>
            </div>
            <div className="pt-2 border-t border-surface-border/60 flex items-center gap-1.5 text-[11px] font-mono text-brand-primary font-semibold">
              <Lock size={12} />
              <span>Confidential Memory Boundary</span>
            </div>
          </div>

          {/* Box 2: Official Indian Government Channels Card */}
          <div className="p-4.5 rounded-card bg-surface border border-surface-border shadow-subtle flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-text-primary mb-2.5">
                <PhoneCall size={13} className="text-brand-red" />
                <span>Official Authorities</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="tel:1930"
                    className="text-text-primary hover:text-brand-red flex items-center justify-between font-mono font-bold bg-brand-red-soft px-2.5 py-1.5 rounded border border-brand-red/20 transition-colors"
                  >
                    <span>1930 (National Helpline)</span>
                    <span className="text-[10px] text-brand-red">TOLL-FREE</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-brand-primary flex items-center justify-between py-0.5 transition-colors"
                  >
                    <span>cybercrime.gov.in (NCRP)</span>
                    <ExternalLink size={11} className="text-text-muted" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://cms.rbi.org.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-brand-primary flex items-center justify-between py-0.5 transition-colors"
                  >
                    <span>RBI CMS (Ombudsman)</span>
                    <ExternalLink size={11} className="text-text-muted" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-surface-border/60 text-[10px] font-mono text-text-muted">
              Statutory Reporting &amp; Liens
            </div>
          </div>

          {/* Box 3: Quick Navigation Hub Card */}
          <div className="p-4.5 rounded-card bg-surface border border-surface-border shadow-subtle flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-text-primary mb-2.5">
                <FolderOpen size={13} className="text-brand-primary" />
                <span>Case Hub Links</span>
              </div>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => setActiveTab('intake')}
                    className="text-text-secondary hover:text-brand-primary text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>&bull; Build My Case</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="text-text-secondary hover:text-brand-primary text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>&bull; My Cases Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('track_case')}
                    className="text-text-secondary hover:text-brand-primary text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>&bull; Public Case Tracking</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className="text-text-secondary hover:text-brand-primary text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>&bull; Nirnay Mini-Tools</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('bank_directory')}
                    className="text-text-secondary hover:text-brand-primary text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>&bull; Bank Helplines</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-surface-border/60 text-[10px] font-mono text-text-muted">
              Quick Shortcuts
            </div>
          </div>

          {/* Box 4: Institutional Ecosystem Notice Card */}
          <div className="p-4.5 rounded-card bg-surface border border-surface-border shadow-subtle flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary mb-2">
                <ShieldCheck size={14} />
                <span>ECOSYSTEM NOTICE</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Official systems handle reporting and investigation. Nirnay helps organize the information surrounding your case. Nirnay does not replace official statutory reports on cybercrime.gov.in or formal instructions from your bank.
              </p>
            </div>
            <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[10px] font-mono text-brand-primary">
              <span>CIVIC INTELLIGENCE</span>
              <span>NON-GOVERNMENT</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <div>
            &copy; {new Date().getFullYear()} NIRNAY &bull; Privacy-Preserving Fraud Case Intelligence.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-brand-primary flex items-center gap-1 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
              CLIENT-SIDE DATA ISOLATION ACTIVE
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
