export type FraudCategory =
  | 'upi_fraud'
  | 'fake_customer_care'
  | 'investment_scam'
  | 'investment_fraud'
  | 'job_scam'
  | 'otp_theft'
  | 'remote_access'
  | 'phishing'
  | 'qr_code_scam'
  | 'digital_arrest'
  | 'other';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type ConfidenceLevel = 'high' | 'medium' | 'preliminary';

export type DataSourceLabel =
  | 'USER ENTERED'
  | 'OCR EXTRACTED'
  | 'CASE TOOL'
  | 'DOCUMENT EXTRACTED'
  | 'NIRNAY NETWORK'
  | 'EXTERNAL RESPONSE'
  | 'EXTERNALLY VERIFIED';

export type TimelineSourceLabel =
  | 'USER REPORTED'
  | 'DOCUMENT EXTRACTED'
  | 'USER CONFIRMED'
  | 'EXTERNAL RESPONSE';

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
  senderAccountType?: string;
  recipientUpiOrAcc: string;
  recipientName?: string;
  recipientNameIfKnown?: string;
  recipientBankIfsc?: string;
  utrNumber: string;
  paymentApp: 'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'NetBanking' | 'Cred' | 'Amazon Pay' | 'Other' | string;
  paymentMethod: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'Debit Card' | 'Credit Card' | 'Wallet' | string;
  source?: DataSourceLabel | string;
  confidence?: ConfidenceLevel;
  status?: string;
  notes?: string;
}

export type EvidenceType =
  | 'screenshot'
  | 'whatsapp_chat'
  | 'sms_text'
  | 'bank_statement'
  | 'bank_sms'
  | 'telegram_chat'
  | 'call_recording'
  | 'url_link'
  | 'apk_file'
  | 'qr_code'
  | 'email'
  | 'tool_output'
  | 'audio_recording'
  | 'other';

export interface EvidenceExtractedData {
  amount?: number;
  date?: string;
  time?: string;
  utrNumber?: string;
  upiId?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  url?: string;
  bank?: string;
  senderBank?: string;
  merchant?: string;
  recipient?: string;
  recipientName?: string;
  referenceNumber?: string;
  senderAccountMasked?: string;
  accountNumberMasked?: string;
  rawSnippet?: string;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  timestamp: string;
  source: string;
  sourceTypeLabel?: DataSourceLabel;
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
  field: string;
  sourceA: { name: string; value: string };
  sourceB: { name: string; value: string };
  status: 'unresolved' | 'resolved';
  resolutionNote?: string;
  suggestedAction: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: 'victim' | 'suspect' | 'scammer' | 'system' | 'bank' | 'authority';
  source: string;
  sourceLabel: TimelineSourceLabel;
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
  riskScore: number;
  reasonFactors: string[];
  recommendedImmediateStep: string;
  lossWindowStatus: 'golden_hour_active' | 'window_narrowing' | 'secondary_risk';
  goldenHourMinutesLeft?: number;
}

export interface SuspectIdentifier {
  id: string;
  type: 'upi_id' | 'phone_number' | 'bank_account' | 'website_url' | 'apk_name' | 'social_handle';
  value: string;
  source?: string;
  sourceTypeLabel?: DataSourceLabel;
  matchingReportsCount?: number;
  threatLevel?: 'confirmed_malicious' | 'suspicious_pattern' | 'unverified';
  notes?: string;
}

export interface ComplainantInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  alternatePhone?: string;
  preferredLanguage?: string;
}

export type ExternalAuthority = 'bank' | '1930' | 'ncrp' | 'payment_app' | 'merchant' | 'police';
export type ExternalStatus = 'submitted' | 'acknowledged' | 'under_review' | 'awaiting_response' | 'closed' | 'dispute_raised';
export type ExternalReferenceSourceType = 'User entered' | 'Imported from response' | 'Externally verified';

export interface ExternalReference {
  id: string;
  authority: ExternalAuthority;
  authorityName: string;
  referenceNumber: string;
  dateSubmitted: string;
  status: ExternalStatus;
  statusDisplay: string;
  source: ExternalReferenceSourceType;
  lastUpdated: string;
  notes?: string;
}

export interface EscalationStage {
  stageNumber: number;
  title: string;
  authority: string;
  description: string;
  status: 'locked' | 'eligible_next' | 'submitted' | 'completed' | 'in_progress' | 'awaiting_prerequisites';
  timeframe?: string;
  requiredReference?: string;
  requiredEvidence?: string[];
  waitingPeriodDays?: number;
  eligibilityCheck: string;
  actionKey?: string;
}

export interface CaseResponseComparison {
  matchesCaseAmount?: boolean;
  matchesCaseUtr?: boolean;
  matchesCaseBeneficiary?: boolean;
  transactionAmountMatch?: boolean;
  utrMatch?: boolean;
  discrepancies: string[];
  summary: string;
}

export interface CaseResponse {
  id: string;
  referenceId?: string;
  referenceNumber?: string;
  authority?: ExternalAuthority;
  responder: string;
  date: string;
  decision: string;
  reason: string;
  requestedDocuments?: string[];
  whatTheySaid: string;
  whatThisRelatesTo?: {
    transactionAmount?: number;
    utrNumber?: string;
    beneficiary?: string;
    disputeReference?: string;
  };
  whatCaseContains?: string[];
  plainSummary: string;
  potentialNextAction: string;
  nextStepOptions?: string[];
  escalationStage?: number;
  rawText: string;
  source?: string;
  comparison?: CaseResponseComparison;
}

export interface ConnectedCampaign {
  id?: string;
  campaignId?: string;
  title: string;
  totalReportsCount: number;
  totalLossEstimate: number;
  commonIndicators: string[];
  status?: string;
  matchingIdentifiers?: string[];
  confidenceNotice: string;
}

export interface NextAction {
  title: string;
  why: string;
  actionLabel: string;
  actionTab?: string;
  urgency: 'critical_now' | 'high_now' | 'medium_today' | 'routine';
}

export interface IncidentCase {
  caseId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  nextAction: NextAction;
  statusProgress: CaseStatusProgress;
  progressTimeline: StatusTimelineEvent[];
  externalReferences: ExternalReference[];
  responses: CaseResponse[];
  escalationLadder?: EscalationStage[];
  connectedCampaign?: ConnectedCampaign;
  category: FraudCategory;
  incidentDate?: string;
  incidentTime?: string;
  amountLostTotal?: number;
  whatHappenedSummary: string;
  complainant: ComplainantInfo;
  transactions: TransactionDetail[];
  evidence: EvidenceItem[];
  conflicts?: EvidenceConflict[];
  timeline: TimelineEvent[];
  analysis: IncidentAnalysis;
  actions: ActionItem[];
  suspects: SuspectIdentifier[];
  userNotes?: string;
}

export interface CaseReadinessItem {
  id: string;
  label: string;
  description: string;
  available: boolean;
  category?: string;
  actionTab?: 'transactions' | 'evidence' | 'complainant' | 'references' | 'narrative';
}

export interface CaseReadiness {
  totalCount: number;
  availableCount: number;
  percentage: number;
  statusMessage: string;
  items: CaseReadinessItem[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_change' | 'action_reminder' | 'evidence_alert' | 'response_alert';
  caseId?: string;
}

export type NivaranToolVerdict =
  | 'NO_KNOWN_MATCH'
  | 'POTENTIAL_RISK_SIGNALS'
  | 'REPORTED_IN_NIRNAY'
  | 'INSUFFICIENT_INFORMATION'
  | 'HIGH_RISK_ALERT'
  | 'PARSED_TRANSACTION';

export interface NivaranToolSignal {
  type: 'critical' | 'warning' | 'info';
  label: string;
  description: string;
}

export interface NivaranToolResult {
  toolId: 'upi_check' | 'phone_check' | 'url_check' | 'payment_request_check' | 'before_you_pay' | 'qr_scan' | 'qr_check' | 'sms_parser' | 'call_story' | 'call_story_check';
  toolName: string;
  timestamp: string;
  query: string;
  summary: string;
  verdict: NivaranToolVerdict;
  signals?: NivaranToolSignal[];
  extractedData?: Record<string, any>;
  guidance?: string | string[];
  suggestedAction?: string;
  matchingReportsCount?: number;
  relatedCases?: any[];
  disclaimer?: string;
}

export interface BankEmergencyContact {
  bankName: string;
  category?: string;
  fraudHotline?: string;
  fraudHelpline?: string;
  generalCustomerCare?: string;
  tollFree?: string;
  ussdCode?: string;
  smsBlockNumber?: string;
  smsBlockSyntax?: string;
  smsDeactivationFormat?: string;
  smsSendNumber?: string;
  portalUrl?: string;
  nodalGrievanceEmail?: string;
  email?: string;
  upiHandles?: string[];
}

export interface IdentifierCheckResult {
  query: string;
  identifierType?: 'upi_vpa' | 'phone_number' | 'bank_account' | 'url' | 'unknown';
  type?: 'upi' | 'phone' | 'url' | 'account' | string;
  riskRating?: 'safe' | 'suspicious' | 'dangerous' | 'unknown';
  threatLevelDisplay?: string;
  verdict?: 'suspicious' | 'dangerous' | 'unverified' | 'neutral' | string;
  verdictTitle?: string;
  confidence?: string;
  riskScore?: number;
  matchedReportsCount?: number;
  signals: Array<{
    type: 'critical' | 'warning' | 'info';
    label: string;
    description: string;
  }>;
  guidance: string[];
  actionRecommendation?: string;
  disclaimer?: string;
  similarReportPatterns?: string[];
}
