import { CaseReadiness, CaseReadinessItem, IncidentCase } from '../types';

export function calculateCaseReadiness(c: IncidentCase): CaseReadiness {
  const items: CaseReadinessItem[] = [
    {
      id: 'tx_amount',
      label: 'Disputed Transaction Amount',
      category: 'core_transaction',
      available: c.transactions.some(tx => tx.amount > 0),
      description: 'Documented monetary loss in INR.',
      actionTab: 'transactions'
    },
    {
      id: 'tx_utr',
      label: '12-Digit UTR / NPCI Reference ID',
      category: 'core_transaction',
      available: c.transactions.some(tx => Boolean(tx.utrNumber && tx.utrNumber.trim().length >= 10)),
      description: 'Central transaction identifier for 1930 / I4C fund freezing.',
      actionTab: 'transactions'
    },
    {
      id: 'sender_bank',
      label: 'Debited Bank Information',
      category: 'core_transaction',
      available: c.transactions.some(tx => Boolean(tx.senderBank && tx.senderBank.trim().length > 0)),
      description: 'Your originating bank where the debit occurred.',
      actionTab: 'transactions'
    },
    {
      id: 'recipient_id',
      label: 'Recipient UPI ID / Bank Account',
      category: 'core_transaction',
      available: c.transactions.some(tx => Boolean(tx.recipientUpiOrAcc && tx.recipientUpiOrAcc.trim().length > 3)),
      description: 'Destination identifier where money was transferred.',
      actionTab: 'transactions'
    },
    {
      id: 'narrative',
      label: 'Detailed Incident Statement',
      category: 'evidence',
      available: Boolean(c.whatHappenedSummary && c.whatHappenedSummary.trim().length >= 25),
      description: 'Factual chronological statement of how fraud occurred.',
      actionTab: 'narrative'
    },
    {
      id: 'receipt_screenshot',
      label: 'Payment Receipt / Debit Screenshot',
      category: 'evidence',
      available: c.evidence.some(e => e.type === 'screenshot' || e.type === 'bank_statement'),
      description: 'Visual proof of debit from UPI app or netbanking portal.',
      actionTab: 'evidence'
    },
    {
      id: 'chat_threat_evidence',
      label: 'Chat / SMS Threat Transcript',
      category: 'evidence',
      available: c.evidence.some(e => e.type === 'whatsapp_chat' || e.type === 'sms_text' || e.type === 'call_recording'),
      description: 'Original suspect messages, deceptive links, or caller records.',
      actionTab: 'evidence'
    },
    {
      id: 'bank_reference',
      label: 'Bank Formal Complaint Reference Number',
      category: 'official_reference',
      available: c.externalReferences.some(r => r.authority === 'bank' && Boolean(r.referenceNumber)),
      description: 'Official ticket/dispute ID from your bank fraud desk.',
      actionTab: 'references'
    },
    {
      id: 'ncrp_reference',
      label: '1930 / NCRP Acknowledgement Number',
      category: 'official_reference',
      available: c.externalReferences.some(r => (r.authority === '1930' || r.authority === 'ncrp') && Boolean(r.referenceNumber)),
      description: 'Statutory acknowledgement from cybercrime.gov.in or 1930 helpline.',
      actionTab: 'references'
    }
  ];

  const availableCount = items.filter(i => i.available).length;
  const totalCount = items.length;
  const percentage = Math.round((availableCount / totalCount) * 100);

  let statusMessage = 'Case dossier ready for 1930 & bank dispute.';
  if (availableCount <= 4) {
    statusMessage = 'Critical evidence missing. Add UTR and payment screenshot.';
  } else if (!c.externalReferences.some(r => r.authority === 'bank')) {
    statusMessage = 'Missing Bank Complaint Reference. Notify your bank fraud cell.';
  } else if (!c.externalReferences.some(r => r.authority === '1930' || r.authority === 'ncrp')) {
    statusMessage = 'Missing 1930 / NCRP Acknowledgement Number.';
  }

  return {
    availableCount,
    totalCount,
    percentage,
    statusMessage,
    items
  };
}
