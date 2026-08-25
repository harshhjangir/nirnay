import { CaseResponse, CaseResponseComparison, EscalationStage, ExternalAuthority, IncidentCase } from '../types';

export function interpretAuthorityResponse(
  rawText: string,
  responderHint?: string,
  authorityHint?: ExternalAuthority,
  existingCase?: IncidentCase
): CaseResponse {
  const text = rawText.toLowerCase();
  const nowReadable = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // 1. Identify Authority & Responder
  let authority: ExternalAuthority = authorityHint || 'bank';
  let responder = responderHint || 'Bank Fraud Dispute Desk';

  if (text.includes('cybercrime.gov.in') || text.includes('ncrp') || text.includes('acknowledgement number')) {
    authority = 'ncrp';
    responder = 'National Cyber Crime Reporting Portal (NCRP)';
  } else if (text.includes('1930') || text.includes('i4c') || text.includes('helpline')) {
    authority = '1930';
    responder = '1930 / I4C Cyber Crime Cell';
  } else if (text.includes('google pay') || text.includes('gpay') || text.includes('phonepe') || text.includes('paytm')) {
    authority = 'payment_app';
    responder = 'Payment Application Grievance Desk';
  } else if (text.includes('hdfc')) {
    responder = 'HDFC Bank Fraud Dispute Desk';
  } else if (text.includes('sbi') || text.includes('state bank')) {
    responder = 'State Bank of India Grievance Cell';
  } else if (text.includes('icici')) {
    responder = 'ICICI Bank Fraud Operations';
  } else if (text.includes('axis')) {
    responder = 'Axis Bank Dispute Desk';
  }

  // 2. Extract Reference Number
  let referenceNumber: string | undefined;
  const refMatch = rawText.match(/(?:ref|complaint|ticket|sr|ack|case|crn)[\s#:]*([A-Za-z0-9\-]{5,20})/i);
  if (refMatch) {
    referenceNumber = refMatch[1];
  }

  // 3. Extract Amount & UTR from Response
  let extractedRespAmt: number | undefined;
  const amtMatch = rawText.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{2})?)/i) || rawText.match(/([\d,]+(?:\.\d{2})?)\s*(?:rs\.?|inr)/i);
  if (amtMatch) {
    const p = parseFloat(amtMatch[1].replace(/,/g, ''));
    if (!isNaN(p)) extractedRespAmt = p;
  }

  let extractedRespUtr: string | undefined;
  const utrMatch = rawText.match(/(?:upi\/|utr|rrn|ref|reference)[\s/:]*(\d{10,13})/i) || rawText.match(/\b(\d{12})\b/);
  if (utrMatch) {
    extractedRespUtr = utrMatch[1];
  }

  // 4. Classify Decision, Reason, and Plain-English Explanation
  let decision = 'Under Evaluation';
  let reason = 'Preliminary intake acknowledged by institution.';
  let whatTheySaid = 'The institution has recorded your reference and is reviewing internal logs.';
  let potentialNextAction = 'Retain this response in your case and check for requested documentation.';
  const requestedDocuments: string[] = [];

  if (
    text.includes('authorised') ||
    text.includes('authenticated') ||
    text.includes('otp entered') ||
    text.includes('pin entered') ||
    text.includes('liability rejected') ||
    text.includes('customer-authorised') ||
    text.includes('valid credentials')
  ) {
    decision = 'Dispute Rejected (Classified as Customer-Authorised)';
    reason = 'Transaction classified as customer-authorised because 2-factor OTP / UPI PIN was entered.';
    whatTheySaid = 'The bank has classified the transaction as customer-authorised because authentication credentials were entered during payment.';
    potentialNextAction = 'Review the bank\'s grievance / escalation route and retain this response in your case record.';
  } else if (
    text.includes('lien placed') ||
    text.includes('funds frozen') ||
    text.includes('freeze initiated') ||
    text.includes('hold placed')
  ) {
    decision = 'Lien / Fund Hold Placed at Beneficiary Bank';
    reason = 'Inter-bank lien memo processed via 1930 / I4C CFCFRMS network.';
    whatTheySaid = 'The beneficiary bank has placed a temporary lien hold on the recipient account.';
    potentialNextAction = 'Submit formal police FIR or NCRP acknowledgement to the bank nodal desk to proceed with magistrate refund disposal.';
  } else if (
    text.includes('fir copy') ||
    text.includes('police complaint') ||
    text.includes('documents required') ||
    text.includes('submit proof') ||
    text.includes('within 7 days')
  ) {
    decision = 'Supporting Evidence Requested';
    reason = 'The authority requires formal verification documents to progress your dispute.';
    whatTheySaid = 'The institution has acknowledged your claim and requested supporting evidence artifacts within the statutory review window.';
    potentialNextAction = 'Upload the requested NCRP / Police complaint copy (Ref: 123456789012) and signed dispute form.';
    requestedDocuments.push('NCRP Acknowledgement Copy', 'Signed Dispute Declaration', 'Chat Transcript Export');
  }

  // 5. Gather Case Context (What case contains)
  const whatCaseContains: string[] = [];
  if (existingCase) {
    if (existingCase.evidence.some(e => e.type === 'whatsapp_chat' || e.type === 'sms_text')) {
      whatCaseContains.push('Impersonation communication documented in evidence');
    }
    if (existingCase.evidence.some(e => e.type === 'screenshot')) {
      whatCaseContains.push('Payment receipt screenshot preserved');
    }
    if (existingCase.suspects.some(s => s.type === 'upi_id')) {
      whatCaseContains.push('Beneficiary VPA mismatch recorded');
    }
    if (existingCase.externalReferences.some(r => r.authority === '1930')) {
      whatCaseContains.push('1930 Cyber Helpline reference linked');
    }
  } else {
    whatCaseContains.push('Impersonation interaction documented');
    whatCaseContains.push('WhatsApp conversation preserved');
    whatCaseContains.push('Beneficiary mismatch recorded');
  }

  // 6. Response Comparison against Case Records
  let comparison: CaseResponseComparison | undefined;
  if (existingCase && existingCase.transactions.length > 0) {
    const primaryTx = existingCase.transactions[0];
    const amountMatch = extractedRespAmt ? extractedRespAmt === primaryTx.amount : true;
    const utrMatchBool = extractedRespUtr ? extractedRespUtr === primaryTx.utrNumber : true;

    if (!amountMatch || !utrMatchBool) {
      comparison = {
        matchesCaseAmount: amountMatch,
        matchesCaseUtr: utrMatchBool,
        transactionAmountMatch: amountMatch,
        discrepancies: [
          !amountMatch ? `Bank response cites ₹${extractedRespAmt?.toLocaleString('en-IN')}, while case record has ₹${primaryTx.amount.toLocaleString('en-IN')}.` : '',
          !utrMatchBool ? `Bank response cites UTR ${extractedRespUtr}, while case record has UTR ${primaryTx.utrNumber}.` : ''
        ].filter(Boolean),
        summary: '⚠ New information conflicts with existing case information.'
      };
    } else {
      comparison = {
        matchesCaseAmount: true,
        matchesCaseUtr: true,
        transactionAmountMatch: true,
        discrepancies: [],
        summary: '✓ Matches existing case record (Amount and UTR consistent)'
      };
    }
  }

  return {
    id: `resp-${Date.now()}`,
    responder,
    authority,
    date: nowReadable,
    referenceNumber,
    decision,
    reason,
    requestedDocuments: requestedDocuments.length > 0 ? requestedDocuments : undefined,
    whatTheySaid,
    whatThisRelatesTo: {
      transactionAmount: extractedRespAmt || (existingCase?.transactions[0]?.amount ?? 18500),
      utrNumber: extractedRespUtr || (existingCase?.transactions[0]?.utrNumber ?? '423719820491'),
      beneficiary: existingCase?.transactions[0]?.recipientUpiOrAcc ?? 'discom.billupdate.982@okaxis'
    },
    whatCaseContains,
    plainSummary: whatTheySaid,
    potentialNextAction,
    nextStepOptions: [potentialNextAction, 'Escalate to next grievance tier', 'Attach supporting documents'],
    escalationStage: 2,
    comparison,
    rawText
  };
}

export function generateGenericEscalationLadder(
  senderBank: string = 'HDFC Bank',
  bankComplaintRef?: string
): EscalationStage[] {
  return [
    {
      stageNumber: 1,
      title: '1. Bank Branch & Fraud Cell Complaint',
      authority: `${senderBank} Branch Manager / Customer Service`,
      requiredReference: bankComplaintRef || 'Bank Dispute Reference ID (e.g. HDFC-98127)',
      requiredEvidence: ['Bank Debit Statement', '12-Digit UTR', 'Written Dispute Letter'],
      waitingPeriodDays: 30,
      status: bankComplaintRef ? 'completed' : 'in_progress',
      eligibilityCheck: 'Must be filed promptly within the 3-day RBI zero-liability window.',
      description: 'First formal notice to your home bank demanding recall memo (RRN Recall) to recipient bank node.'
    },
    {
      stageNumber: 2,
      title: '2. Bank Internal Grievance Desk',
      authority: `${senderBank} Grievance Redressal Officer`,
      requiredReference: 'Initial Complaint Ticket Number',
      requiredEvidence: ['Initial Complaint Acknowledgement', 'Evidence of Social Engineering / Impersonation'],
      waitingPeriodDays: 15,
      status: bankComplaintRef ? 'eligible_next' : 'awaiting_prerequisites',
      eligibilityCheck: 'Eligible if Stage 1 is rejected or unaddressed after 7 working days.',
      description: 'Senior bank review reviewing customer liability disputes under RBI consumer protection circulars.'
    },
    {
      stageNumber: 3,
      title: '3. Principal Nodal Officer (PNO)',
      authority: `${senderBank} Principal Nodal Officer (State/Zonal)`,
      requiredReference: 'Grievance Redressal Reference Number',
      requiredEvidence: ['Grievance Escalation Trail', 'Formal FIR / NCRP Copy'],
      waitingPeriodDays: 15,
      status: 'awaiting_prerequisites',
      eligibilityCheck: 'Eligible if Grievance Desk rejects dispute or fails to respond.',
      description: 'Apex bank internal appellate authority before statutory regulatory escalation.'
    },
    {
      stageNumber: 4,
      title: '4. RBI Banking Ombudsman (CMS Portal)',
      authority: 'Reserve Bank of India Ombudsman (cms.rbi.org.in)',
      requiredReference: 'Bank Complaint Reference + PNO Rejection Memo',
      requiredEvidence: ['Complete NIVARAN Case Dossier', 'Written Bank Responses', 'NCRP Acknowledgement'],
      status: 'awaiting_prerequisites',
      eligibilityCheck: 'Eligible 30 days after initial bank complaint, or immediately upon receiving bank rejection notice.',
      description: 'Statutory independent banking adjudication under the Reserve Bank - Integrated Ombudsman Scheme, 2021.'
    }
  ];
}
