export type FraudCategory =
  | 'upi_fraud'
  | 'fake_customer_care'
  | 'investment_scam'
  | 'job_scam'
  | 'otp_theft'
  | 'remote_access'
  | 'phishing'
  | 'qr_code_scam'
  | 'digital_arrest'
  | 'other';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type ConfidenceLevel = 'high' | 'medium' | 'preliminary';

export type CaseStatusProgress =
  | 'incident_reported'
  | 'information_verified'
  | 'complaint_forwarded'
  | 'under_investigation'
  | 'action_resolution'
  | 'closed';

export interface StatusTimelineEvent {
  step: number;
  label: string;
  timestamp: string;
  completed: boolean;
  isCurrent?: boolean;
  description: string;
}

export interface TransactionDetail {
  id: string;
  amount: number;
  currency: string;
  timestamp: string;
  senderBank: string;
  senderAccountMasked: string;
  recipientUpiOrAcc: string;
  recipientNameIfKnown?: string;
  utrNumber: string; // 12-digit UTR/RRN
  paymentApp: 'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'NetBanking' | 'Cred' | 'Amazon Pay' | 'Other';
  paymentMethod: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'Debit Card' | 'Credit Card' | 'Wallet';
  notes?: string;
}

export type EvidenceType =
  | 'screenshot'
  | 'whatsapp_chat'
  | 'sms_text'
  | 'bank_statement'
  | 'call_recording'
  | 'url_link'
  | 'apk_file'
  | 'qr_code'
  | 'email';

export interface EvidenceExtractedData {
  amount?: number;
  date?: string;
  time?: string;
  utrNumber?: string;
  upiId?: string;
  phoneNumber?: string;
  email?: string;
  url?: string;
  bank?: string;
  merchant?: string;
  recipient?: string;
  referenceNumber?: string;
  senderAccountMasked?: string;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  timestamp: string;
  source: string; // e.g. "WhatsApp", "HDFC SMS Alert", "UPI Receipt"
  status: 'verified' | 'pending_review' | 'flagged';
  relevance: 'critical' | 'high' | 'supporting';
  fileSizeBytes?: number;
  fileName?: string;
  contentSnippet?: string;
  fileUrl?: string;
  extractedData?: EvidenceExtractedData;
}

export interface EvidenceConflict {
  id: string;
  field: string; // e.g. "Disputed Amount", "UTR Number", "Recipient"
  sourceA: { name: string; value: string }; // e.g. { name: "Bank SMS Alert", value: "₹18,500" }
  sourceB: { name: string; value: string }; // e.g. { name: "Uploaded Receipt", value: "₹15,500" }
  status: 'unresolved' | 'resolved';
  resolutionNote?: string;
  suggestedAction: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: 'victim' | 'suspect' | 'system' | 'bank' | 'authority';
  source: string; // e.g. "From uploaded screenshot", "From user description", "User entered", "Imported from bank response"
  urgency?: 'critical' | 'warning' | 'info';
}

export type ActionUrgency = 'critical_now' | 'high_now' | 'high_1hr' | 'medium_today' | 'routine';

export interface ActionItem {
  id: string;
  title: string;
  why: string;
  how: string;
  urgency: ActionUrgency;
  category: 'freeze_funds' | 'law_enforcement' | 'account_security' | 'evidence' | 'documentation';
  completed: boolean;
  officialChannel?: '1930' | 'ncrp' | 'bank_fraud_cell' | 'telecom';
  scriptText?: string;
}

export interface IncidentAnalysis {
  likelyType: string;
  fraudCategory: FraudCategory;
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  reasonFactors: string[];
  recommendedImmediateStep: string;
  lossWindowStatus: 'golden_hour_active' | 'window_narrowing' | 'secondary_risk';
  goldenHourMinutesLeft?: number;
}

export interface SuspectIdentifier {
  id: string;
  type: 'upi_id' | 'phone_number' | 'bank_account' | 'website_url' | 'apk_name' | 'social_handle';
  value: string;
  source?: string; // e.g. "Nivaran UPI Check", "WhatsApp Chat Screenshot", "User entered"
  firstDetected?: string;
  matchingReportsCount?: number;
  notes?: string;
}

export interface ComplainantInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  alternatePhone?: string;
}

// -------------------------------------------------------------
// EXTERNAL COMPLAINT REFERENCES (Bank, 1930, NCRP, UPI app, etc.)
// -------------------------------------------------------------
export type ExternalAuthority =
  | 'bank'
  | '1930'
  | 'ncrp'
  | 'payment_app'
  | 'merchant'
  | 'platform'
  | 'police'
  | 'other';

export type ExternalStatus =
  | 'submitted'
  | 'acknowledged'
  | 'awaiting_response'
  | 'under_review'
  | 'dispute_raised'
  | 'rejected'
  | 'resolved'
  | 'pending_user_action';

export interface ExternalReference {
  id: string;
  authority: ExternalAuthority;
  authorityName: string; // e.g. "HDFC Bank", "1930 (I4C Helpline)", "cybercrime.gov.in (NCRP)", "Google Pay"
  referenceNumber: string; // e.g. "HDFC-98127", "CF-728191", "123456789012", "GPay-88429"
  dateSubmitted: string;
  status: ExternalStatus;
  statusDisplay: string; // e.g. "Awaiting response", "Acknowledged", "Submitted"
  source: string; // e.g. "User entered", "SMS parsed"
  lastUpdated: string;
  notes?: string;
}

// -------------------------------------------------------------
// CASE READINESS ENGINE (e.g. 7 / 9 items available)
// -------------------------------------------------------------
export interface CaseReadinessItem {
  id: string;
  label: string;
  available: boolean;
  category: 'core_transaction' | 'evidence' | 'official_reference';
  description: string;
  actionTab?: string;
}

export interface CaseReadiness {
  availableCount: number;
  totalCount: number;
  percentage: number;
  statusMessage: string;
  items: CaseReadinessItem[];
}

// -------------------------------------------------------------
// RESPONSE INTERPRETER (Bank emails, letters, NCRP messages)
// -------------------------------------------------------------
export interface CaseResponse {
  id: string;
  responder: string; // e.g. "HDFC Bank Fraud Dispute Desk", "NCRP (cybercrime.gov.in)", "Google Pay Support"
  authority: ExternalAuthority;
  date: string;
  referenceNumber?: string;
  decision: string; // e.g. "Dispute rejected / Transaction classified as customer-authorised"
  reason: string; // e.g. "Transaction authenticated with 2-factor OTP / UPI PIN"
  requestedDocuments?: string[];
  plainSummary: string; // "The bank has treated the transaction as authorised. Your case currently contains evidence that the payment followed an impersonation call."
  potentialNextAction: string; // "Review the bank's grievance/escalation process."
  rawText?: string;
}

// -------------------------------------------------------------
// ESCALATION TRACKER (Bank Complaint -> Grievance -> Ombudsman)
// -------------------------------------------------------------
export interface EscalationStage {
  stageNumber: number;
  title: string;
  authority: string;
  requiredReference: string;
  requiredEvidence: string[];
  waitingPeriodDays?: number;
  deadlineDate?: string;
  status: 'completed' | 'in_progress' | 'eligible_next' | 'awaiting_prerequisites';
  eligibilityCheck: string;
  description: string;
}

// -------------------------------------------------------------
// FRAUD NETWORK INTELLIGENCE (Connected Campaigns)
// -------------------------------------------------------------
export interface ConnectedCampaign {
  id: string;
  title: string; // e.g. "State Electricity DISCOM Impersonation Campaign"
  totalReportsCount: number; // e.g. 17 Nivaran reports
  totalLossEstimate: number; // e.g. 482000
  commonIndicators: string[]; // ["+91 70192 84920", "discom.billupdate.982@okaxis", "15-minute power cutoff threat script", "₹15 verification credit trick"]
  status: 'potentially_connected_reports';
  confidenceNotice: string; // "Probabilistic signal based on matching identifiers across user reports."
  matchingIdentifiers: string[];
}

// -------------------------------------------------------------
// NIVARAN MINI TOOLKIT OUTPUTS
// -------------------------------------------------------------
export interface NivaranToolResult {
  toolId: 'upi_check' | 'phone_check' | 'url_check' | 'payment_request_check' | 'qr_check' | 'sms_parser' | 'call_story_check';
  toolName: string;
  timestamp: string;
  query: string;
  summary: string;
  verdict: 'POTENTIAL_RISK_SIGNALS' | 'NO_KNOWN_MATCH' | 'INSUFFICIENT_INFORMATION' | 'HIGH_RISK_ALERT' | 'PARSED_TRANSACTION';
  extractedData?: EvidenceExtractedData;
  signals?: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }>;
  suggestedAction?: string;
}

// -------------------------------------------------------------
// CORE CASE DATA MODEL
// -------------------------------------------------------------
export interface IncidentCase {
  caseId: string;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
  userId?: string;
  complainant: ComplainantInfo;
  category: FraudCategory;
  whatHappenedSummary: string;
  transactions: TransactionDetail[];
  evidence: EvidenceItem[];
  conflicts: EvidenceConflict[];
  timeline: TimelineEvent[];
  analysis: IncidentAnalysis;
  actions: ActionItem[];
  suspects: SuspectIdentifier[];
  externalReferences: ExternalReference[];
  responses: CaseResponse[];
  connectedCampaign?: ConnectedCampaign;
  escalationLadder?: EscalationStage[];
  statusProgress: CaseStatusProgress;
  progressTimeline: StatusTimelineEvent[];
  nextAction: {
    title: string;
    why: string;
    actionLabel: string;
    actionTab?: string;
    urgency: ActionUrgency;
  };
  userNotes?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isDemo: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_change' | 'action_reminder' | 'evidence_alert' | 'system' | 'conflict_alert' | 'response_alert';
  caseId?: string;
}

export interface BankEmergencyContact {
  bankName: string;
  category: 'Public Sector' | 'Private Sector' | 'Payments Bank';
  fraudHelpline: string;
  tollFree: string;
  smsBlockSyntax: string;
  smsBlockNumber: string;
  email: string;
  ussdCode?: string;
  portalUrl: string;
}

export interface IdentifierCheckResult {
  query: string;
  type: 'upi_id' | 'phone_number' | 'bank_account' | 'url' | 'unknown';
  riskScore: number; // 0 - 100
  verdict: 'POTENTIAL_RISK_SIGNALS' | 'NO_KNOWN_MATCH' | 'INSUFFICIENT_INFORMATION' | 'HIGH_RISK_ALERT';
  verdictTitle: string;
  confidence: 'High' | 'Moderate' | 'Low';
  signals: Array<{
    type: 'warning' | 'info' | 'critical';
    label: string;
    description: string;
  }>;
  guidance: string[];
  disclaimer: string;
  matchingReportsCount?: number;
  relatedCases?: string[];
  extractedData?: EvidenceExtractedData;
}
