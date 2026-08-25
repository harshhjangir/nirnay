import { CaseReadiness, CaseReadinessItem, IncidentCase } from '../types';

export function calculateCaseReadiness(c: IncidentCase): CaseReadiness {
  const items: CaseReadinessItem[] = [
    {
      id: 'tx_amount',
      label: 'Incident & Disputed Amount',
      category: 'core_transaction',
      available: c.transactions.some(tx => tx.amount > 0),
      description: 'Documented monetary transfer amount in INR.',
      actionTab: 'transactions'
    },
    {
      id: 'tx_utr',
      label: '12-Digit UTR / Transaction Reference',
      category: 'core_transaction',
      available: c.transactions.some(tx => Boolean(tx.utrNumber && tx.utrNumber.trim().length >= 10)),
      description: 'Core banking reference required for 1930 / I4C inter-bank fund hold.',
      actionTab: 'transactions'
    },
    {
      id: 'sender_bank',
      label: 'Debited Bank Name',
      category: 'core_transaction',
      available: c.transactions.some(tx => Boolean(tx.senderBank && tx.senderBank.trim().length > 0)),
      description: 'Your originating financial institution where debit occurred.',
      actionTab: 'transactions'
    },
    {
      id: 'recipient_id',
      label: 'Beneficiary UPI ID / Account',
      category: 'core_transaction',
      available: c.transactions.some(tx => Boolean(tx.recipientUpiOrAcc && tx.recipientUpiOrAcc.trim().length > 3)),
      description: 'Destination VPA or account where funds were received.',
      actionTab: 'transactions'
    },
    {
      id: 'receipt_screenshot',
      label: 'Payment Receipt / Screenshot Evidence',
      category: 'evidence',
      available: c.evidence.some(e => e.type === 'screenshot' || e.type === 'bank_statement'),
      description: 'Visual proof of debit from UPI app or banking statement.',
      actionTab: 'evidence'
    },
    {
      id: 'chat_threat_evidence',
      label: 'Communication Evidence / Chat Record',
      category: 'evidence',
      available: c.evidence.some(e => e.type === 'whatsapp_chat' || e.type === 'sms_text' || e.type === 'call_recording' || e.type === 'email'),
      description: 'Original WhatsApp chat transcript, SMS alert, or call interaction record.',
      actionTab: 'evidence'
    },
    {
      id: 'suspect_identifier',
      label: 'Suspect Identifier (Phone / Link)',
      category: 'evidence',
      available: c.suspects.length > 0 || c.evidence.some(e => Boolean(e.extractedData?.phoneNumber || e.extractedData?.url)),
      description: 'Phone number, deceptive URL, or APK handle used by caller.',
      actionTab: 'evidence'
    },
    {
      id: 'narrative',
      label: 'Incident Narrative Statement',
      category: 'evidence',
      available: Boolean(c.whatHappenedSummary && c.whatHappenedSummary.trim().length >= 25),
      description: 'Factual statement of sequence of events.',
      actionTab: 'narrative'
    },
    {
      id: 'bank_reference',
      label: 'Bank Formal Complaint Reference',
      category: 'official_reference',
      available: c.externalReferences.some(r => r.authority === 'bank' && Boolean(r.referenceNumber)),
      description: 'Official dispute/ticket ID from your home bank fraud cell.',
      actionTab: 'references'
    },
    {
      id: 'ncrp_reference',
      label: '1930 / NCRP Acknowledgement Number',
      category: 'official_reference',
      available: c.externalReferences.some(r => (r.authority === '1930' || r.authority === 'ncrp') && Boolean(r.referenceNumber)),
      description: 'Statutory acknowledgement from cybercrime.gov.in or 1930.',
      actionTab: 'references'
    }
  ];

  const availableCount = items.filter(i => i.available).length;
  const totalCount = items.length;
  const percentage = Math.round((availableCount / totalCount) * 100);

  const missingCount = totalCount - availableCount;
  let statusMessage = `${availableCount} / ${totalCount} information items ready.`;
  if (missingCount > 0) {
    statusMessage = `Your case is missing ${missingCount} useful piece${missingCount > 1 ? 's' : ''} of information.`;
  }

  return {
    availableCount,
    totalCount,
    percentage,
    statusMessage,
    items
  };
}
