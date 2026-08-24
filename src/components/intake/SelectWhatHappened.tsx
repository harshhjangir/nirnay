import React from 'react';
import {
  Briefcase,
  HelpCircle,
  KeyRound,
  QrCode,
  Send,
  ShieldAlert,
  Smartphone,
  TrendingUp,
  UserX,
  ArrowRight
} from 'lucide-react';
import { FraudCategory } from '../../types';
import { useIncident } from '../../context/IncidentContext';

export const SelectWhatHappened: React.FC = () => {
  const { draftIncident, updateDraft, setIntakeStep } = useIncident();

  const categories: Array<{
    id: FraudCategory;
    title: string;
    description: string;
    icon: any;
    tag: string;
    samplePhrases: string[];
  }> = [
    {
      id: 'upi_fraud',
      title: 'Tricked into sending money or paying a fake request',
      description: 'Sent money via Google Pay, PhonePe, Paytm, or BHIM after being misled about a bill, delivery fee, or reward.',
      icon: Send,
      tag: 'UPI / Direct Transfer',
      samplePhrases: ['Electricity bill update', 'Courier parcel fee', 'Marketplace advance']
    },
    {
      id: 'fake_customer_care',
      title: 'Contacted by a fake customer-care representative',
      description: 'Found a number on Google or received a call from someone claiming to represent a bank, telecom, or airline.',
      icon: UserX,
      tag: 'Impersonation',
      samplePhrases: ['Bank KYC expired', 'SIM 5G upgrade', 'Airline refund support']
    },
    {
      id: 'investment_scam',
      title: 'Invested in a high-return trading or Telegram task scheme',
      description: 'Promised daily profits for rating videos, liking posts, or investing in crypto/stocks through WhatsApp/Telegram groups.',
      icon: TrendingUp,
      tag: 'Task / Ponzi Scheme',
      samplePhrases: ['YouTube like rating', 'VIP Trading Account', 'Crypto daily returns']
    },
    {
      id: 'remote_access',
      title: 'Installed a remote access app on phone or computer',
      description: 'Instructed to download AnyDesk, TeamViewer, QuickSupport, RustDesk, or a custom APK file.',
      icon: Smartphone,
      tag: 'Device Takeover',
      samplePhrases: ['AnyDesk / QuickSupport code', 'Downloaded APK on WhatsApp', 'Screen sharing']
    },
    {
      id: 'otp_theft',
      title: 'Shared an OTP, PIN, or banking password',
      description: 'Disclosed a 6-digit SMS verification code, card CVV, or banking password over a call or unverified webpage.',
      icon: KeyRound,
      tag: 'Credential Theft',
      samplePhrases: ['Shared 6-digit SMS code', 'Card CVV on fake link', 'PIN entered for refund']
    },
    {
      id: 'qr_code_scam',
      title: 'Scanned a QR code thinking I would receive payment',
      description: 'Buyer or sender sent a QR code claiming "Scan and enter PIN to receive money into your bank account".',
      icon: QrCode,
      tag: 'QR Manipulation',
      samplePhrases: ['Scan to receive money', 'OLX/Marketplace buyer QR', 'Double refund QR']
    },
    {
      id: 'digital_arrest',
      title: 'Threatened with arrest by fake Police, CBI, or Customs',
      description: 'Video call or phone threat claiming illegal parcel or money laundering case, demanding "escrow deposits".',
      icon: ShieldAlert,
      tag: 'Coercion / Extortion',
      samplePhrases: ['FedEx parcel seized', 'Fake Mumbai Police video', 'Digital arrest bail']
    },
    {
      id: 'job_scam',
      title: 'Asked to deposit money for a work-from-home job',
      description: 'Offered part-time or data-entry employment and asked for registration, training, or kit fees.',
      icon: Briefcase,
      tag: 'Employment Fraud',
      samplePhrases: ['Data entry kit fee', 'Review evaluator deposit', 'HR onboarding bond']
    },
    {
      id: 'other',
      title: 'Not sure / Something else happened',
      description: 'Unusual debit on account or financial loss that does not clearly fit the categories above.',
      icon: HelpCircle,
      tag: 'Unclassified',
      samplePhrases: ['Unexpected SMS debit alert', 'Unauthorized netbanking withdrawal']
    }
  ];

  const handleSelect = (catId: FraudCategory) => {
    updateDraft({ category: catId });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 1 OF 5 &bull; INCIDENT CATEGORY
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          What happened?
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Select the scenario that most closely matches your situation. This tailors the emergency containment advice.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = draftIncident.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`text-left p-5 rounded-card border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-surface border-brand-primary ring-2 ring-brand-primary/20 shadow-card'
                  : 'bg-surface border-surface-border hover:border-surface-border-active hover:shadow-subtle'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-primary text-white' : 'bg-surface-subtle text-brand-primary'}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-text-muted">
                    {cat.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-text-primary leading-snug mb-1.5">
                  {cat.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {cat.description}
                </p>
              </div>

              {/* Sample Triggers */}
              <div className="pt-2.5 border-t border-surface-border/60">
                <div className="text-[10px] font-mono text-text-muted mb-1 uppercase">Common patterns:</div>
                <div className="flex flex-wrap gap-1">
                  {cat.samplePhrases.map((phrase, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-subtle text-text-secondary font-mono">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="flex justify-end pt-4 border-t border-surface-border">
        <button
          onClick={() => setIntakeStep(2)}
          className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-2"
        >
          <span>Continue to Describe What Happened</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
