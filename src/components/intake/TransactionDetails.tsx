import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Plus,
  Trash2,
  User,
  CreditCard
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { TransactionDetail } from '../../types';
import { BANK_DIRECTORY } from '../../services/bankDirectoryData';

export const TransactionDetails: React.FC = () => {
  const {
    draftIncident,
    addDraftTransaction,
    removeDraftTransaction,
    updateDraft,
    setIntakeStep
  } = useIncident();

  const [amount, setAmount] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>(
    new Date().toISOString().slice(0, 16).replace('T', ' ')
  );
  const [senderBank, setSenderBank] = useState<string>('State Bank of India (SBI)');
  const [senderAccount, setSenderAccount] = useState<string>('');
  const [recipientUpiOrAcc, setRecipientUpiOrAcc] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [paymentApp, setPaymentApp] = useState<TransactionDetail['paymentApp']>('Google Pay');
  const [paymentMethod, setPaymentMethod] = useState<TransactionDetail['paymentMethod']>('UPI');
  const [notes, setNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const complainant = draftIncident.complainant;

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a valid disputed transaction amount greater than ₹0.');
      return;
    }
    if (!recipientUpiOrAcc.trim()) {
      setValidationError('Please enter the recipient UPI ID, phone number, or account number.');
      return;
    }

    setValidationError(null);
    addDraftTransaction({
      amount: numAmount,
      currency: 'INR',
      timestamp: timestamp || new Date().toISOString(),
      senderBank,
      senderAccountMasked: senderAccount ? senderAccount.slice(-4) : 'XXXX',
      recipientUpiOrAcc: recipientUpiOrAcc.trim(),
      recipientNameIfKnown: recipientName.trim(),
      utrNumber: utrNumber.trim(),
      paymentApp,
      paymentMethod,
      notes
    });

    // Reset single tx form fields
    setAmount('');
    setRecipientUpiOrAcc('');
    setRecipientName('');
    setUtrNumber('');
    setNotes('');
  };

  const handleComplainantChange = (field: string, val: string) => {
    updateDraft({
      complainant: {
        ...complainant,
        [field]: val
      }
    });
  };

  const handleProceed = () => {
    if (draftIncident.transactions.length === 0) {
      // If user typed into the amount field without clicking "Add", try adding it
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount > 0 && recipientUpiOrAcc.trim()) {
        addDraftTransaction({
          amount: numAmount,
          currency: 'INR',
          timestamp: timestamp || new Date().toISOString(),
          senderBank,
          senderAccountMasked: senderAccount ? senderAccount.slice(-4) : 'XXXX',
          recipientUpiOrAcc: recipientUpiOrAcc.trim(),
          recipientNameIfKnown: recipientName.trim(),
          utrNumber: utrNumber.trim(),
          paymentApp,
          paymentMethod,
          notes
        });
        setValidationError(null);
        setIntakeStep(4);
        return;
      }

      setValidationError('Please add at least one disputed transaction to proceed.');
      return;
    }

    setValidationError(null);
    setIntakeStep(4);
  };

  const totalAmount = draftIncident.transactions.reduce((s, tx) => s + (tx.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 3 OF 5 &bull; FINANCIAL TRANSACTIONS & JURISDICTION
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Transaction & Debited Account Details
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          The 12-digit UTR/RRN number is the central identifier used by 1930 and bank nodal officers to trace and freeze funds across the banking network.
        </p>
      </div>

      {validationError && (
        <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Complainant Details Card */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide border-b border-surface-border/60 pb-2.5">
          <User size={15} className="text-brand-primary" />
          <span>Complainant Identification (Optional for Confidential Assessment)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-text-muted font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={complainant.name}
              onChange={(e) => handleComplainantChange('name', e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-text-muted font-medium mb-1">Mobile Number</label>
            <input
              type="tel"
              value={complainant.phone}
              onChange={(e) => handleComplainantChange('phone', e.target.value)}
              placeholder="+91 98451 92837"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-text-muted font-medium mb-1">City / District</label>
            <input
              type="text"
              value={complainant.city}
              onChange={(e) => handleComplainantChange('city', e.target.value)}
              placeholder="e.g. Bengaluru"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-text-muted font-medium mb-1">State</label>
            <input
              type="text"
              value={complainant.state}
              onChange={(e) => handleComplainantChange('state', e.target.value)}
              placeholder="e.g. Karnataka"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Existing Logged Transactions List */}
      {draftIncident.transactions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
              Documented Disputed Transactions ({draftIncident.transactions.length})
            </h3>
            <span className="text-xs font-mono text-brand-red font-bold">
              Total: ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2.5">
            {draftIncident.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-card bg-surface border border-surface-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold font-mono text-brand-red">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-brand-blue-soft text-[11px] font-mono text-brand-blue border border-brand-blue/20">
                      {tx.paymentMethod} &bull; {tx.paymentApp}
                    </span>
                    <span className="text-text-muted font-mono text-[11px]">{tx.timestamp}</span>
                  </div>
                  <div className="text-text-secondary">
                    From <strong className="text-text-primary">{tx.senderBank}</strong> (A/C: *{tx.senderAccountMasked}) &rarr; To <strong className="text-brand-amber font-mono">{tx.recipientUpiOrAcc}</strong>
                  </div>
                  <div className="text-[11px] font-mono text-text-muted">
                    UTR / RRN: <span className="text-text-primary font-bold">{tx.utrNumber || 'Pending Confirmation'}</span>
                    {tx.recipientNameIfKnown && ` (${tx.recipientNameIfKnown})`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeDraftTransaction(tx.id)}
                  className="p-2 rounded-lg text-text-muted hover:text-brand-red hover:bg-brand-red-soft transition-colors self-end md:self-center"
                  title="Remove transaction"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Transaction Form Card */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <Plus size={15} className="text-brand-primary" />
            <span>Add Disputed Payment Details</span>
          </div>
          <span className="text-[11px] text-text-muted">
            Add all tranches if funds were sent multiple times
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Amount */}
          <div>
            <label className="block text-text-primary font-semibold mb-1">
              Disputed Amount (INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-text-muted font-mono">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="18500"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg pl-7 pr-3 py-2 text-base font-mono font-bold text-text-primary outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Payment App */}
          <div>
            <label className="block text-text-primary font-semibold mb-1">
              Payment App Used
            </label>
            <select
              value={paymentApp}
              onChange={(e) => setPaymentApp(e.target.value as any)}
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
            >
              <option value="Google Pay">Google Pay (GPay)</option>
              <option value="PhonePe">PhonePe</option>
              <option value="Paytm">Paytm UPI / Wallet</option>
              <option value="BHIM">BHIM UPI</option>
              <option value="NetBanking">Bank NetBanking / Mobile App</option>
              <option value="Cred">Cred UPI</option>
              <option value="Amazon Pay">Amazon Pay</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-text-primary font-semibold mb-1">
              Date & Approx Time
            </label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="YYYY-MM-DD HH:MM"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono outline-none focus:border-brand-primary"
            />
          </div>

          {/* Debiting Bank */}
          <div>
            <label className="block text-text-primary font-semibold mb-1">
              Your Debited Bank
            </label>
            <select
              value={senderBank}
              onChange={(e) => setSenderBank(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
            >
              {BANK_DIRECTORY.map(b => (
                <option key={b.bankName} value={b.bankName}>{b.bankName}</option>
              ))}
            </select>
          </div>

          {/* Debited Account Last 4 */}
          <div>
            <label className="block text-text-primary font-semibold mb-1">
              Account Last 4 Digits
            </label>
            <input
              type="text"
              maxLength={4}
              value={senderAccount}
              onChange={(e) => setSenderAccount(e.target.value)}
              placeholder="e.g. 9104"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono outline-none focus:border-brand-primary"
            />
          </div>

          {/* Recipient UPI or Account */}
          <div>
            <label className="block text-text-primary font-semibold mb-1">
              Recipient UPI ID / Bank A/C *
            </label>
            <input
              type="text"
              value={recipientUpiOrAcc}
              onChange={(e) => setRecipientUpiOrAcc(e.target.value)}
              placeholder="e.g. suspect.vpa@okaxis"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono outline-none focus:border-brand-primary"
            />
          </div>

          {/* 12-Digit UTR */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-text-primary font-semibold">
                12-Digit UTR / UPI Reference ID (Crucial for 1930)
              </label>
              <span className="text-[11px] text-brand-blue font-medium">Find in Bank SMS or UPI App</span>
            </div>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 423719820491"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono font-bold outline-none focus:border-brand-primary"
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-text-primary font-semibold mb-1">
              Recipient Name (if shown)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. BILLDESK SERVICES"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAddTx}
            className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface-subtle text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <Plus size={14} className="text-brand-primary" />
            <span>Add Transaction to List</span>
          </button>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => setIntakeStep(2)}
          className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Narrative</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-2"
        >
          <span>Continue to Evidence Upload</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
