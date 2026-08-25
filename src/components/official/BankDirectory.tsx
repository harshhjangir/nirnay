import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  Copy,
  ExternalLink,
  PhoneCall,
  Search,
  ShieldCheck
} from 'lucide-react';
import { BANK_DIRECTORY } from '../../services/bankDirectoryData';

export const BankDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredBanks = BANK_DIRECTORY.filter(b =>
    b.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          OFFICIAL ESCALATION DIRECTORY &bull; INDIAN BANKING NODAL HELPLINES
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          Bank Emergency Fraud Helplines
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
          Direct verified 24x7 fraud cell contacts, instant emergency SMS card/UPI blocking syntaxes, and USSD offline codes for major Indian commercial and payments banks.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-card bg-surface border border-surface-border shadow-subtle flex items-center gap-3">
        <Search size={18} className="text-text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by bank name (e.g. SBI, HDFC, ICICI, Axis, Paytm, Canara...)"
          className="w-full bg-transparent border-none text-sm text-text-primary placeholder:text-text-muted outline-none font-sans"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-mono text-text-muted hover:text-text-primary px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Bank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBanks.map((bank) => (
          <div
            key={bank.bankName}
            className="p-5 rounded-card-lg bg-surface border border-surface-border hover:border-surface-border-active hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-blue-soft text-brand-blue border border-brand-blue/20">
                  {bank.category}
                </span>
                {bank.ussdCode && (
                  <span className="text-[10px] font-mono text-text-muted font-semibold">
                    USSD: {bank.ussdCode}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-text-primary">
                {bank.bankName}
              </h3>

              {/* Direct Fraud Hotline */}
              <div className="p-3 rounded-lg bg-brand-red-soft border border-brand-red/25 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-brand-red">
                  24x7 Dedicated Fraud Helpline:
                </div>
                <a
                  href={`tel:${bank.fraudHelpline}`}
                  className="text-base font-mono font-bold text-brand-red hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall size={14} />
                  <span>{bank.fraudHelpline}</span>
                </a>
              </div>

              {/* SMS Block Syntax */}
              <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1 text-xs">
                <div className="text-[10px] font-mono text-text-muted uppercase flex justify-between">
                  <span>SMS Emergency Block Syntax:</span>
                  <span>To: {bank.smsBlockNumber}</span>
                </div>
                <div className="flex items-center justify-between font-mono font-bold text-text-primary pt-0.5">
                  <span className="truncate pr-2">{bank.smsBlockSyntax}</span>
                  <button
                    onClick={() => copyText(bank.bankName, bank.smsBlockSyntax || '')}
                    className="p-1 text-text-muted hover:text-brand-primary"
                    title="Copy SMS format"
                  >
                    {copiedId === bank.bankName ? <Check size={12} className="text-brand-green" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Phishing Reporting Email */}
              <div className="text-[11px] font-mono text-text-muted truncate">
                <span>Email: </span>
                <a href={`mailto:${bank.email}`} className="text-text-secondary hover:underline">
                  {bank.email}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted">Toll-Free: {bank.tollFree}</span>
              <a
                href={bank.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Official Portal</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-card bg-surface-elevated border border-surface-border text-xs text-text-muted flex items-start gap-3 shadow-subtle">
        <ShieldCheck size={16} className="text-brand-green shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-text-secondary font-mono">Verification Precaution:</strong> All helpline numbers listed above are verified against official Reserve Bank of India (RBI) records. Never trust phone numbers retrieved from unverified search engine ads or forwarded social media messages.
        </p>
      </div>
    </div>
  );
};
