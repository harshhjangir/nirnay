import React from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileDown,
  FolderOpen,
  PhoneCall,
  Search,
  Shield,
  ShieldCheck,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { generateCasePdf } from '../../services/pdfGenerator';

export const SubmissionSuccess: React.FC = () => {
  const { activeCase, setActiveTab, selectCase } = useIncident();

  const totalAmount = activeCase.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);
  const primaryUtr = activeCase.transactions[0]?.utrNumber || '423719820491';

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-in fade-in">
      
      {/* Main Success Card */}
      <div className="p-8 rounded-card-lg bg-surface border border-surface-border shadow-card text-center space-y-5">
        
        {/* Success Icon */}
        <div className="h-12 w-12 rounded-full bg-brand-green-soft border border-brand-green/30 flex items-center justify-center text-brand-green mx-auto">
          <CheckCircle2 size={24} />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-wider">
            FRAUD CASE ORGANIZED &bull; NIRNAY INTELLIGENCE ACTIVE
          </span>
          <h2 className="text-2xl font-display font-extrabold text-text-primary mt-1">
            Your Case Dossier is Ready
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Nirnay has extracted, verified, and structured your evidence into a continuous case file.
          </p>
        </div>

        {/* Generated Case ID Display Box */}
        <div className="p-5 rounded-lg bg-surface-elevated border border-surface-border space-y-1.5 font-mono">
          <span className="text-[11px] text-text-muted uppercase font-semibold block">
            OFFICIAL CASE IDENTIFIER
          </span>
          <div className="text-2xl font-black text-brand-primary tracking-tight">
            {activeCase.caseId}
          </div>
          <div className="text-xs text-text-secondary font-sans pt-1">
            Disputed Loss: <strong className="text-brand-red font-mono">₹{totalAmount.toLocaleString('en-IN')}</strong> &bull; Status: <span className="font-semibold text-brand-primary">Case Recorded</span>
          </div>
        </div>

        {/* Immediate Next Action Banner */}
        <div className="p-4 rounded-lg bg-brand-soft border border-brand-primary/30 text-left space-y-2">
          <div className="text-xs font-bold text-brand-primary font-mono flex items-center gap-1.5 uppercase">
            <PhoneCall size={14} />
            PRIMARY NEXT ACTION &bull; DIAL 1930 NOW
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            Quote your 12-digit UTR (<strong className="font-mono text-text-primary">{primaryUtr}</strong>) and Bank (<strong className="font-semibold text-text-primary">{activeCase.transactions[0]?.senderBank || 'HDFC Bank'}</strong>) to the 1930 helpline to trigger an inter-bank lien freeze before funds are layered.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => selectCase(activeCase.caseId)}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors shadow-card flex items-center justify-center gap-2"
          >
            <FolderOpen size={15} />
            <span>Open Case in Intelligence Hub</span>
          </button>

          <button
            onClick={() => generateCasePdf(activeCase)}
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-surface hover:bg-surface-elevated text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <FileDown size={15} className="text-brand-primary" />
            <span>Download PDF Summary</span>
          </button>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-3 rounded-lg bg-surface-subtle hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>NCRP Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>

      </div>

    </div>
  );
};
