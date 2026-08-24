import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  QrCode,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  UserX
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const PreventionCenter: React.FC = () => {
  const [selectedPlaybookIndex, setSelectedPlaybookIndex] = useState<number | null>(null);

  const playbooks = [
    {
      id: 'upi-fraud',
      title: 'UPI Intent & Social Engineering Fraud',
      subtitle: 'Fake bill updates, electricity disconnections, and deceptive payment links',
      icon: Send,
      category: 'UPI & Instant Transfers',
      tagColor: 'border-brand-primary/20 bg-brand-soft text-brand-primary',
      howItStarts: 'Victim receives an urgent SMS or WhatsApp call claiming their electricity or gas connection will be disconnected tonight due to an un-updated previous month bill.',
      attackerScript: '"Sir, I am calling from the state electricity board. Your bill of ₹11 is pending verification. If not done in 15 minutes, the substation will cut your power. Click this link and enter your UPI PIN to approve update."',
      victimSees: 'A payment gateway page with a disguised merchant name or an APK download link for "DiscomBillUpdate.apk".',
      warningSigns: [
        'Artificial urgency ("Power will be cut in 15 minutes")',
        'Unsolicited call from a regular 10-digit mobile number rather than an official SMS header',
        'Asking victim to transfer a nominal amount (₹10 or ₹15) to "verify the line"',
        'Insistence on entering UPI PIN on a link sent over WhatsApp'
      ],
      whatToDo: [
        'Never pay utility bills through links received on WhatsApp or SMS.',
        'Use official state DISCOM apps or authorized payment portals (Bharat BillPay / BBPS).',
        'If already paid, dial 1930 immediately with the 12-digit UTR.'
      ],
      attackFlowSteps: [
        '1. Attacker sends threat SMS',
        '2. Victim calls suspect number',
        '3. Attacker sends phishing link / APK',
        '4. Victim enters UPI PIN',
        '5. Account debited'
      ]
    },
    {
      id: 'fake-customer-care',
      title: 'Fake Customer Care & Search Engine Spoofing',
      subtitle: 'Altered contact numbers on Google search & Google Maps listings',
      icon: UserX,
      category: 'Search Engine Poisoning',
      tagColor: 'border-brand-amber/30 bg-brand-amber-soft text-brand-amber',
      howItStarts: 'Victim searches Google for customer service numbers for airlines, courier delivery (BlueDart/DTDC), or banking apps.',
      attackerScript: '"Thank you for calling support. We see your refund of ₹4,200 is stuck. To reverse it back to your bank account, please accept the collect request sent on your PhonePe/Google Pay."',
      victimSees: 'A "Collect Request" on UPI for ₹4,200 labeled as "REFUND_APPROVAL".',
      warningSigns: [
        'Top search result on Google showing a mobile phone (+91 9xxx...) instead of toll-free 1800 numbers',
        'Representative instructing you to install AnyDesk or accept a UPI collect request',
        'Claim that you need to enter your PIN to "receive a refund"'
      ],
      whatToDo: [
        'Only use contact details from the verified mobile app or physical billing invoice.',
        'Remember: Entering your UPI PIN always DEBITS money, never credits.',
        'Report the fake listing on Google Search / Maps.'
      ],
      attackFlowSteps: [
        '1. Fraudster posts fake SEO number',
        '2. Victim calls seeking support',
        '3. Scammer sends UPI Collect Request',
        '4. Victim enters PIN expecting refund',
        '5. Bank account debited'
      ]
    },
    {
      id: 'task-scam',
      title: 'Task-Based & Telegram Investment Schemes',
      subtitle: 'Like YouTube videos, rate Google reviews, crypto trading VIP clubs',
      icon: TrendingUp,
      category: 'Investment Fraud',
      tagColor: 'border-brand-blue/20 bg-brand-blue-soft text-brand-blue',
      howItStarts: 'Victim receives a WhatsApp message offering part-time earnings: ₹150 for liking 3 YouTube videos or rating 5-star hotels on Google.',
      attackerScript: '"Congratulations! You earned ₹450 for trial tasks. To unlock VIP Task #4 and earn ₹12,000, please deposit ₹3,000 to the merchant wallet."',
      victimSees: 'A professional-looking fake web dashboard showing rapidly multiplying fake profits that cannot be withdrawn without paying "tax" or "clearance fees".',
      warningSigns: [
        'Unsolicited work invitations on Telegram/WhatsApp from foreign country codes',
        'Initial small payments (₹200 - ₹500) sent to build trust',
        'Requirement to send money to different individual bank accounts to "recharge"'
      ],
      whatToDo: [
        'Cease all communications immediately. Do not pay additional "withdrawal fees".',
        'Take screenshots of all Telegram chats, group member IDs, and payment UTRs.',
        'File complaint on 1930 and NCRP.'
      ],
      attackFlowSteps: [
        '1. WhatsApp invitation',
        '2. Small payout given',
        '3. Moved to VIP Telegram group',
        '4. Large deposits demanded',
        '5. Withdrawal blocked'
      ]
    },
    {
      id: 'remote-access',
      title: 'Remote Access Tool & Screen-Mirroring Takeover',
      subtitle: 'AnyDesk, TeamViewer QuickSupport, RustDesk compromise',
      icon: Smartphone,
      category: 'Device Takeover',
      tagColor: 'border-brand-red/30 bg-brand-red-soft text-brand-red',
      howItStarts: 'Suspect claims to be technical support resolving an app glitch, KYC verification, or reward disbursement.',
      attackerScript: '"Sir, please install the QuickSupport app from Play Store and read out the 9-digit code so our technician can verify your screen settings."',
      victimSees: 'The remote application displays an active connection; attacker secretly observes incoming bank OTP notifications.',
      warningSigns: [
        'Anyone asking you to install AnyDesk, TeamViewer, RustDesk, or AirDroid for banking issues',
        'Instruction to open your banking or UPI app while remote software is running'
      ],
      whatToDo: [
        'Immediately switch phone to AIRPLANE MODE.',
        'Uninstall the screen sharing application from Settings.',
        'Change all banking passwords and UPI PINs from an uncompromised secondary device.'
      ],
      attackFlowSteps: [
        '1. Attacker calls claiming tech support',
        '2. Victim installs AnyDesk/QuickSupport',
        '3. 9-digit session code shared',
        '4. Attacker views OTP notifications',
        '5. Unauthorized funds transfer'
      ]
    },
    {
      id: 'qr-code-scam',
      title: 'Deceptive QR Code (PIN for Credit Scam)',
      subtitle: 'Marketplace buyers on OLX, Facebook, and classifieds',
      icon: QrCode,
      category: 'Marketplace Fraud',
      tagColor: 'border-brand-amber/30 bg-brand-amber-soft text-brand-amber',
      howItStarts: 'Victim posts an item for sale (furniture, electronics, vehicle). Scammer contacts immediately without bargaining and offers advance payment.',
      attackerScript: '"I have sent you an advance of ₹15,000 via barcode. Scan this QR code and type your PIN to receive money directly into your bank."',
      victimSees: 'A QR code image sent on WhatsApp labeled "BANK_DEPOSIT_RECEIVE_QR".',
      warningSigns: [
        'Buyer agrees to purchase instantly without seeing the item or negotiating price',
        'Sending QR codes with claims that scanning receives money'
      ],
      whatToDo: [
        'Rule of Thumb: Scanning a QR code and entering a PIN is ALWAYS for debiting money from your account.',
        'Never scan QR codes to receive payments.',
        'Report buyer profile on the marketplace platform.'
      ],
      attackFlowSteps: [
        '1. Ad posted on marketplace',
        '2. Fake buyer agrees instantly',
        '3. Sends QR code on WhatsApp',
        '4. Victim scans and enters PIN',
        '5. Seller account debited'
      ]
    },
    {
      id: 'digital-arrest',
      title: 'Digital Arrest & Law Enforcement Extortion',
      subtitle: 'Fake CBI, Mumbai Police, Customs & Narcotics calls',
      icon: ShieldAlert,
      category: 'Coercive Extortion',
      tagColor: 'border-brand-red/30 bg-brand-red-soft text-brand-red',
      howItStarts: 'Automated call claiming "FedEx parcel containing passports/drugs seized in your name" or direct Skype video call from fake police officers in uniform.',
      attackerScript: '"You are under 24-hour Digital Arrest by the Supreme Court/CBI. Transfer your liquid funds to the Reserve Bank security escrow account for anti-money laundering verification."',
      victimSees: 'A video call showing a staged police station backdrop, fake arrest warrants with government seals, and intimidating officers.',
      warningSigns: [
        'There is NO legal concept of "Digital Arrest" under Indian Law / CrPC.',
        'Police and CBI never conduct interrogation via Skype or WhatsApp video.',
        'Government agencies never ask citizens to transfer money to "security verification accounts".'
      ],
      whatToDo: [
        'Immediately disconnect the call.',
        'Do not transfer money under any circumstances.',
        'Report the numbers to 1930 and your local Cyber Police station.'
      ],
      attackFlowSteps: [
        '1. Automated IVR Parcel warning',
        '2. Transferred to fake "Police Officer"',
        '3. Video call with fake police backdrop',
        '4. Coercion to transfer "escrow funds"',
        '5. Extortion of life savings'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          FINANCIAL CYBERCRIME INTELLIGENCE &bull; PREVENTION PLAYBOOKS
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          How Financial Frauds Operate
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
          Deconstructed attack sequences, psychological triggers, and counter-actions for the most prevalent digital financial fraud schemes in India.
        </p>
      </div>

      {/* Grid of Playbooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {playbooks.map((pb, idx) => {
          const Icon = pb.icon;
          return (
            <div
              key={pb.id}
              className="rounded-card-lg bg-surface border border-surface-border hover:border-surface-border-active hover:shadow-card transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-surface-subtle text-brand-primary">
                    <Icon size={20} />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${pb.tagColor}`}>
                    {pb.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-text-primary leading-snug">
                    {pb.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {pb.subtitle}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border text-xs text-text-secondary line-clamp-3 leading-relaxed">
                  <strong className="text-text-primary">How it starts:</strong> {pb.howItStarts}
                </div>
              </div>

              {/* 2D Attack Flow Micro-Visualization */}
              <div className="pt-3 border-t border-surface-border/60 space-y-2">
                <div className="text-[10px] font-mono text-text-muted uppercase font-semibold">Attack Sequence:</div>
                <div className="space-y-1 text-[11px] font-mono text-text-secondary">
                  {pb.attackFlowSteps.slice(0, 3).map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" />
                      <span className="truncate">{step}</span>
                    </div>
                  ))}
                  <div className="text-[10px] text-text-muted pl-3">+ 2 more stages</div>
                </div>

                <button
                  onClick={() => setSelectedPlaybookIndex(idx)}
                  className="w-full pt-2 flex items-center justify-between text-xs font-semibold text-brand-primary hover:text-brand-hover transition-colors"
                >
                  <span>Deconstruct Modus Operandi</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Playbook Detail Modal */}
      {selectedPlaybookIndex !== null && (
        <Modal
          isOpen={selectedPlaybookIndex !== null}
          onClose={() => setSelectedPlaybookIndex(null)}
          title={playbooks[selectedPlaybookIndex].title}
          subtitle={playbooks[selectedPlaybookIndex].category}
          maxWidth="xl"
        >
          <div className="space-y-5 text-xs text-text-secondary">
            
            {/* Custom 2D Flow Diagram */}
            <div className="p-4 rounded-card bg-surface-subtle border border-surface-border space-y-3">
              <div className="text-xs font-mono font-bold text-brand-primary uppercase">
                Attack Sequence & Transaction Flow Diagram:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                {playbooks[selectedPlaybookIndex].attackFlowSteps.map((step, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-surface border border-surface-border text-center flex flex-col justify-center shadow-subtle">
                    <span className="text-[10px] text-text-muted mb-1 font-bold">STAGE {i + 1}</span>
                    <span className="text-text-primary font-medium">{step.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What Attacker Says vs What Victim Sees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-brand-red-soft border border-brand-red/30 space-y-1.5">
                <div className="font-mono font-bold text-brand-red uppercase text-xs flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  What the Attacker Says:
                </div>
                <p className="font-mono text-text-primary italic leading-relaxed">
                  {playbooks[selectedPlaybookIndex].attackerScript}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5">
                <div className="font-mono font-bold text-brand-blue uppercase text-xs flex items-center gap-1.5">
                  <BookOpen size={14} />
                  What the Victim Sees:
                </div>
                <p className="leading-relaxed text-text-secondary font-sans">
                  {playbooks[selectedPlaybookIndex].victimSees}
                </p>
              </div>
            </div>

            {/* Warning Signs */}
            <div className="space-y-2">
              <div className="font-mono font-bold text-brand-amber uppercase text-xs flex items-center gap-1.5">
                <AlertTriangle size={14} />
                Critical Warning Signs & Red Flags:
              </div>
              <ul className="space-y-1.5 bg-brand-amber-soft/40 p-3.5 rounded-lg border border-brand-amber/20">
                {playbooks[selectedPlaybookIndex].warningSigns.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-amber mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to do */}
            <div className="space-y-2">
              <div className="font-mono font-bold text-brand-primary uppercase text-xs flex items-center gap-1.5">
                <ShieldCheck size={14} />
                What to do (Defensive Protocol):
              </div>
              <ul className="space-y-1.5 bg-brand-soft p-3.5 rounded-lg border border-brand-primary/20">
                {playbooks[selectedPlaybookIndex].whatToDo.map((todo, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-primary font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                    <span>{todo}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPlaybookIndex(null)}
                className="px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold text-xs shadow-subtle"
              >
                Close Playbook
              </button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
};
