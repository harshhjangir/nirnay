import { CaseResponse, EscalationStage, ExternalAuthority } from '../types';

export function interpretAuthorityResponse(
  rawText: string,
  responderHint?: string,
  authorityHint?: ExternalAuthority
): CaseResponse {
  const text = rawText.toLowerCase();
  const nowReadable = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // 1. Identify Authority & Responder
  let authority: ExternalAuthority = authorityHint || 'bank';
  let responder = responderHint || 'Bank Fraud Control Unit';

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

  // 3. Classify Decision, Reason, and Plain-English Explanation
  let decision = 'Under Evaluation';
  let reason = 'Preliminary intake acknowledged by authority.';
  let plainSummary = 'The institution has recorded your dispute reference.';
  let potentialNextAction = 'Monitor for official updates and preserve your original dispute reference number.';
  const requestedDocuments: string[] = [];

  if (
    text.includes('authorised by customer') ||
    text.includes('authenticated') ||
    text.includes('otp entered') ||
    text.includes('pin entered') ||
    text.includes('liability rejected') ||
    text.includes('customer liability')
  ) {
    decision = 'Dispute Rejected (Classified as Customer-Authorised)';
    reason = 'The bank states the transaction was authorized using your 2-Factor OTP or UPI PIN.';
    plainSummary = 'The bank has treated the transaction as customer-authorised because the security PIN/OTP was entered. However, if the PIN was entered under social engineering deception or malware impersonation, you have the statutory right to escalate to the Bank Principal Nodal Officer and the RBI Banking Ombudsman under the RBI Zero-Liability framework.';
    potentialNextAction = 'Escalate to Stage 2: Bank Internal Grievance Desk / Principal Nodal Officer quoting third-party fraud deception within the 3-day notification window.';
  } else if (
    text.includes('lien placed') ||
    text.includes('funds frozen') ||
    text.includes('freeze initiated') ||
    text.includes('hold on beneficiary')
  ) {
    decision = 'Lien / Fund Freeze Acknowledged at Recipient Node';
    reason = 'Inter-bank freeze memo placed under 1930 / I4C mechanism.';
    plainSummary = 'The receiving bank node has placed a lien on the beneficiary account. The funds are held pending formal police / magistrate disposal order.';
    potentialNextAction = 'Submit formal police FIR or NCRP complaint copy to both banks to initiate the fund recovery disposal process.';
  } else if (
    text.includes('fir copy') ||
    text.includes('police complaint') ||
    text.includes('documents required') ||
    text.includes('submit proof')
  ) {
    decision = 'Additional Documentation Requested';
    reason = 'The authority requires formal evidence artifacts to process your claim.';
    plainSummary = 'The review is on hold until supporting documents (such as NCRP acknowledgement or bank statement) are submitted.';
    potentialNextAction = 'Upload the requested NCRP / Police complaint copy and transaction receipt to the institution portal.';
    requestedDocuments.push('NCRP Acknowledgement Copy', 'Bank Debit Statement', 'Chat Transcript Export');
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
    plainSummary,
    potentialNextAction,
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
      eligibilityCheck: 'Must be filed immediately within the 3-day RBI zero-liability window.',
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
      description: 'Senior bank review reviewing customer liability disputes under RBI consumer protection norms.'
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
