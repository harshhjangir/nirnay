import { EvidenceConflict, EvidenceItem, TransactionDetail } from '../types';

export interface VerifiedMatch {
  field: string;
  value: string;
  sources: string[];
  description: string;
}

export interface ConsistencyCheckResult {
  verifiedMatches: VerifiedMatch[];
  conflicts: EvidenceConflict[];
  hasConflicts: boolean;
  summary: string;
}

export function evaluateEvidenceConsistency(
  transactions: TransactionDetail[],
  evidence: EvidenceItem[],
  existingConflicts: EvidenceConflict[] = []
): ConsistencyCheckResult {
  const verifiedMatches: VerifiedMatch[] = [];
  const dynamicConflicts: EvidenceConflict[] = [...existingConflicts];

  const primaryTx = transactions[0];
  if (!primaryTx) {
    return {
      verifiedMatches: [],
      conflicts: dynamicConflicts,
      hasConflicts: dynamicConflicts.some(c => c.status === 'unresolved'),
      summary: 'No transaction data available for consistency evaluation.'
    };
  }

  // 1. Check Amount Matches
  const amountSources: Array<{ source: string; amount: number }> = [];
  amountSources.push({ source: `Transaction Record (${primaryTx.senderBank})`, amount: primaryTx.amount });

  evidence.forEach(ev => {
    if (ev.extractedData?.amount) {
      amountSources.push({ source: ev.title || ev.source, amount: ev.extractedData.amount });
    }
  });

  if (amountSources.length > 1) {
    const firstAmt = amountSources[0].amount;
    const allMatch = amountSources.every(a => a.amount === firstAmt);

    if (allMatch) {
      verifiedMatches.push({
        field: 'Disputed Amount',
        value: `₹${firstAmt.toLocaleString('en-IN')}`,
        sources: amountSources.map(s => s.source),
        description: `Disputed amount ₹${firstAmt.toLocaleString('en-IN')} verified across ${amountSources.length} separate records.`
      });
    } else {
      const mismatched = amountSources.find(a => a.amount !== firstAmt);
      if (mismatched && !dynamicConflicts.some(c => c.field === 'Disputed Amount')) {
        dynamicConflicts.push({
          id: `conf-amt-${Date.now()}`,
          field: 'Disputed Amount',
          sourceA: { name: amountSources[0].source, value: `₹${amountSources[0].amount.toLocaleString('en-IN')}` },
          sourceB: { name: mismatched.source, value: `₹${mismatched.amount.toLocaleString('en-IN')}` },
          status: 'unresolved',
          suggestedAction: 'Review the actual bank statement debit to confirm the exact disputed figure before official filing.'
        });
      }
    }
  }

  // 2. Check UTR Matches
  const utrSources: Array<{ source: string; utr: string }> = [];
  if (primaryTx.utrNumber) {
    utrSources.push({ source: 'Transaction Ledger', utr: primaryTx.utrNumber.trim() });
  }

  evidence.forEach(ev => {
    if (ev.extractedData?.utrNumber) {
      utrSources.push({ source: ev.title || ev.source, utr: ev.extractedData.utrNumber.trim() });
    }
  });

  if (utrSources.length > 1) {
    const firstUtr = utrSources[0].utr;
    const allMatch = utrSources.every(u => u.utr === firstUtr);

    if (allMatch) {
      verifiedMatches.push({
        field: '12-Digit UTR / NPCI Reference',
        value: firstUtr,
        sources: utrSources.map(u => u.source),
        description: `UTR ${firstUtr} confirmed across ${utrSources.length} evidence sources.`
      });
    } else {
      const mismatched = utrSources.find(u => u.utr !== firstUtr);
      if (mismatched && !dynamicConflicts.some(c => c.field === 'UTR Reference')) {
        dynamicConflicts.push({
          id: `conf-utr-${Date.now()}`,
          field: 'UTR Reference',
          sourceA: { name: utrSources[0].source, value: utrSources[0].utr },
          sourceB: { name: mismatched.source, value: mismatched.utr },
          status: 'unresolved',
          suggestedAction: 'Verify the 12-digit UTR directly from the official bank debit SMS before quoting to 1930.'
        });
      }
    }
  }

  // 3. Recipient VPA Matches
  const vpaSources: Array<{ source: string; vpa: string }> = [];
  if (primaryTx.recipientUpiOrAcc) {
    vpaSources.push({ source: 'Disputed Transaction', vpa: primaryTx.recipientUpiOrAcc.trim().toLowerCase() });
  }

  evidence.forEach(ev => {
    if (ev.extractedData?.upiId) {
      vpaSources.push({ source: ev.title || ev.source, vpa: ev.extractedData.upiId.trim().toLowerCase() });
    }
  });

  if (vpaSources.length > 1) {
    const firstVpa = vpaSources[0].vpa;
    const allMatch = vpaSources.every(v => v.vpa === firstVpa);

    if (allMatch) {
      verifiedMatches.push({
        field: 'Beneficiary UPI Handle',
        value: firstVpa,
        sources: vpaSources.map(v => v.source),
        description: `Recipient handle ${firstVpa} confirmed across evidence documents.`
      });
    }
  }

  const unresolvedConflicts = dynamicConflicts.filter(c => c.status === 'unresolved');

  return {
    verifiedMatches,
    conflicts: dynamicConflicts,
    hasConflicts: unresolvedConflicts.length > 0,
    summary: unresolvedConflicts.length > 0
      ? `Attention: ${unresolvedConflicts.length} information conflict(s) detected across evidence. Review before submission.`
      : verifiedMatches.length > 0
      ? `Evidence consistency verified: ${verifiedMatches.length} facts match across records.`
      : 'Evidence details recorded.'
  };
}
