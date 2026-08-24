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
  | 'email';

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
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: 'victim' | 'suspect' | 'system' | 'bank';
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
  timeline: TimelineEvent[];
  analysis: IncidentAnalysis;
  actions: ActionItem[];
  suspects: SuspectIdentifier[];
  ncrpAckNumber?: string;
  bankComplaintNumber?: string;
  statusProgress: CaseStatusProgress;
  progressTimeline: StatusTimelineEvent[];
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
  type: 'status_change' | 'action_reminder' | 'evidence_alert' | 'system';
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
}
