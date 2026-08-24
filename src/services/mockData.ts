import { AuthUser, IncidentCase, NotificationItem } from '../types';
import { KNOWN_CAMPAIGNS_DATABASE } from './fraudNetworkEngine';
import { generateGenericEscalationLadder } from './responseInterpreterEngine';

export const DEMO_USER: AuthUser = {
  id: 'usr-demo-001',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@example.com',
  phone: '+91 98451 92837',
  isDemo: true,
  createdAt: '2026-08-20T09:00:00+05:30'
};

export const DEMO_CASE_1: IncidentCase = {
  caseId: 'NVR-2026-00124',
  userId: 'usr-demo-001',
  createdAt: '2026-08-24T10:32:00+05:30',
  updatedAt: '2026-08-24T14:15:00+05:30',
  isDemo: true,
  statusProgress: 'under_investigation',
  nextAction: {
    title: 'Submit Formal Bank Dispute Notice with 1930 Acknowledgement',
    why: 'Under the RBI Zero-Liability circular, submitting written dispute proof within 3 working days protects your entitlement to refund reversal.',
    actionLabel: 'Generate Bank Dispute Notice',
    actionTab: 'references',
    urgency: 'critical_now'
  },
  progressTimeline: [
    {
      step: 1,
      label: 'Incident Reported',
      timestamp: '24 Aug 2026 · 10:32 AM',
      completed: true,
      description: 'Incident details, disputed amounts, and initial statement recorded on NIVARAN.'
    },
    {
      step: 2,
      label: 'Information Verified',
      timestamp: '24 Aug 2026 · 11:05 AM',
      completed: true,
      description: '12-digit UTR 423719820491 and recipient VPA validated against NPCI banking format.'
    },
    {
      step: 3,
      label: 'Complaint Forwarded',
      timestamp: '24 Aug 2026 · 12:14 PM',
      completed: true,
      description: 'Dossier generated and submitted to 1930 Helpline and HDFC Bank Fraud Cell.'
    },
    {
      step: 4,
      label: 'Under Investigation',
      timestamp: '24 Aug 2026 · 01:30 PM',
      completed: false,
      isCurrent: true,
      description: 'Beneficiary bank node lien request acknowledged under I4C Citizen Financial Cyber Fraud framework.'
    },
    {
      step: 5,
      label: 'Action / Resolution',
      timestamp: 'Pending',
      completed: false,
      description: 'Fund recovery, chargeback dispute adjudication, and legal closure.'
    },
    {
      step: 6,
      label: 'Closed',
      timestamp: 'Pending',
      completed: false,
      description: 'Final reconciliation and case archive.'
    }
  ],
  externalReferences: [
    {
      id: 'ref-hdfc-01',
      authority: 'bank',
      authorityName: 'HDFC Bank Fraud Cell',
      referenceNumber: 'HDFC-98127',
      dateSubmitted: '24 Aug 2026, 11:30 AM',
      status: 'awaiting_response',
      statusDisplay: 'Awaiting Bank Response',
      source: 'User entered',
      lastUpdated: '24 Aug 2026, 14:20',
      notes: 'Initial debit dispute logged via 1800-258-6161 fraud hotline.'
    },
    {
      id: 'ref-1930-01',
      authority: '1930',
      authorityName: '1930 / I4C Cyber Crime Helpline',
      referenceNumber: 'CF-728191',
      dateSubmitted: '24 Aug 2026, 10:45 AM',
      status: 'acknowledged',
      statusDisplay: 'Lien Acknowledged at Beneficiary Node',
      source: 'User entered',
      lastUpdated: '24 Aug 2026, 12:10',
      notes: 'Emergency hold request transmitted to Axis Bank nodal desk.'
    },
    {
      id: 'ref-ncrp-01',
      authority: 'ncrp',
      authorityName: 'cybercrime.gov.in (NCRP)',
      referenceNumber: '123456789012',
      dateSubmitted: '24 Aug 2026, 12:40 PM',
      status: 'submitted',
      statusDisplay: 'Formal Complaint Submitted',
      source: 'User entered',
      lastUpdated: '24 Aug 2026, 13:00',
      notes: 'Police Acknowledgement slip downloaded and saved.'
    },
    {
      id: 'ref-gpay-01',
      authority: 'payment_app',
      authorityName: 'Google Pay Grievance',
      referenceNumber: 'GPay-88429',
      dateSubmitted: '24 Aug 2026, 10:55 AM',
      status: 'dispute_raised',
      statusDisplay: 'In-App Dispute Raised',
      source: 'User entered',
      lastUpdated: '24 Aug 2026, 11:00',
      notes: 'Flagged transaction as fraudulent utility impersonation.'
    }
  ],
  responses: [
    {
      id: 'resp-001',
      responder: 'HDFC Bank Fraud Dispute Desk',
      authority: 'bank',
      date: '24 Aug 2026 · 02:00 PM',
      referenceNumber: 'HDFC-98127',
      decision: 'Initial Acknowledgement & Verification in Progress',
      reason: 'Transaction UTR 423719820491 logged for NPCI recall dispute.',
      requestedDocuments: ['NCRP Acknowledgement Copy (123456789012)', 'Signed Dispute Letter'],
      plainSummary: 'HDFC Bank has acknowledged your dispute and initiated a recall memo with Axis Bank. They have requested the official NCRP police complaint copy to finalize the chargeback review.',
      potentialNextAction: 'Submit the NCRP complaint copy (Ref: 123456789012) to the HDFC branch manager.',
      rawText: 'Dear Customer, we acknowledge receipt of your fraud claim ref HDFC-98127 regarding UPI transfer of INR 18,500. Please provide police/NCRP acknowledgement within 7 days.'
    }
  ],
  conflicts: [],
  connectedCampaign: KNOWN_CAMPAIGNS_DATABASE[0],
  escalationLadder: generateGenericEscalationLadder('HDFC Bank', 'HDFC-98127'),
  category: 'upi_fraud',
  whatHappenedSummary: 'I received an urgent call from someone claiming to be an electricity board officer (BESCOM) regarding electricity disconnection due to an un-updated previous month bill. The caller pressured me saying power will be disconnected in 15 minutes, sent a WhatsApp link, and asked me to approve a 15-rupee verification payment via Google Pay. When I entered my UPI PIN, ₹18,500 was debited immediately.',
  complainant: {
    name: 'Rajesh Sharma',
    phone: '+91 98451 92837',
    email: 'rajesh.sharma@example.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    alternatePhone: '+91 94482 10928'
  },
  transactions: [
    {
      id: 'tx-001',
      amount: 18500,
      currency: 'INR',
      timestamp: '2026-08-24 10:28:14',
      senderBank: 'HDFC Bank',
      senderAccountMasked: '9104',
      recipientUpiOrAcc: 'discom.billupdate.982@okaxis',
      recipientNameIfKnown: 'M/S BILLDESK POWER MGT (Fictitious)',
      utrNumber: '423719820491',
      paymentApp: 'Google Pay',
      paymentMethod: 'UPI',
      notes: 'Payment initiated after caller urged power would be cut within 15 minutes.'
    }
  ],
  evidence: [
    {
      id: 'ev-001',
      type: 'whatsapp_chat',
      title: 'WhatsApp Chat Transcript & Threat Notice',
      description: 'Incoming threat message from +91 70192 84920 claiming electricity disconnection notice with payment link.',
      timestamp: '2026-08-24 10:21:00',
      source: 'WhatsApp (+91 70192 84920)',
      status: 'verified',
      relevance: 'critical',
      fileName: 'chat_export_7019284920.txt',
      fileSizeBytes: 24500,
      contentSnippet: '[10:21] Suspicious: Dear consumer your electricity power will be disconnected tonight at 9.30pm because previous month bill was not updated. Please call officer immediately at 7019284920.',
      extractedData: {
        phoneNumber: '+91 70192 84920',
        url: 'http://bescom-bill-update.xyz/download.apk'
      }
    },
    {
      id: 'ev-002',
      type: 'screenshot',
      title: 'Google Pay Debited Receipt Screenshot',
      description: 'Proof of ₹18,500 transferred showing UTR 423719820491 to discom.billupdate.982@okaxis.',
      timestamp: '2026-08-24 10:28:30',
      source: 'Google Pay App',
      status: 'verified',
      relevance: 'critical',
      fileName: 'gpay_receipt_423719820491.png',
      fileSizeBytes: 428000,
      extractedData: {
        amount: 18500,
        utrNumber: '423719820491',
        upiId: 'discom.billupdate.982@okaxis',
        merchant: 'M/S BILLDESK POWER MGT'
      }
    },
    {
      id: 'ev-003',
      type: 'sms_text',
      title: 'HDFC Bank Debit Confirmation SMS',
      description: 'Bank confirmation SMS showing debit of Rs 18,500.00 from A/C **9104 via UPI reference 423719820491.',
      timestamp: '2026-08-24 10:29:05',
      source: 'HDFC Bank SMS (VM-HDFCBK)',
      status: 'verified',
      relevance: 'high',
      contentSnippet: 'Dear Customer, INR 18,500.00 debited from A/c XX9104 on 24-AUG-26 10:28:14 by UPI/423719820491/discom.bill/UPI. If not done by you, call 18002586161 immediately.',
      extractedData: {
        amount: 18500,
        utrNumber: '423719820491',
        bank: 'HDFC Bank',
        senderAccountMasked: '9104'
      }
    }
  ],
  timeline: [
    {
      id: 'tl-1',
      timestamp: '10:21 AM',
      title: 'Initial WhatsApp Threat Received',
      description: 'Received SMS & WhatsApp message claiming immediate power disconnection.',
      actor: 'suspect',
      source: 'From uploaded screenshot (ev-001)',
      urgency: 'warning'
    },
    {
      id: 'tl-2',
      timestamp: '10:24 AM',
      title: 'Deceptive Payment Link Opened',
      description: 'Opened payment verification link sent by caller on WhatsApp.',
      actor: 'victim',
      source: 'From user description',
      urgency: 'info'
    },
    {
      id: 'tl-3',
      timestamp: '10:27 AM',
      title: 'UPI PIN Entered under Social Pressure',
      description: 'Caller instructed that entering PIN was required for "reversal verification credit".',
      actor: 'victim',
      source: 'From user description',
      urgency: 'warning'
    },
    {
      id: 'tl-4',
      timestamp: '10:28 AM',
      title: '₹18,500 Transferred to Suspect Account',
      description: 'HDFC Bank debited ₹18,500 with UTR 423719820491 to discom.billupdate.982@okaxis.',
      actor: 'bank',
      source: 'From uploaded bank SMS & GPay receipt (ev-002, ev-003)',
      urgency: 'critical'
    },
    {
      id: 'tl-5',
      timestamp: '11:30 AM',
      title: 'Bank Dispute Registered (HDFC-98127)',
      description: 'Dispute recorded via HDFC Bank Fraud Hotline.',
      actor: 'authority',
      source: 'User entered external reference (ref-hdfc-01)',
      urgency: 'info'
    }
  ],
  analysis: {
    likelyType: 'Social Engineering & Electricity Disconnection UPI Phishing',
    fraudCategory: 'upi_fraud',
    confidence: 'high',
    riskLevel: 'critical',
    riskScore: 92,
    reasonFactors: [
      'Artificial urgency imposed (15-minute power cutoff threat)',
      'Impersonation of utility board (BESCOM / State Power DISCOM)',
      'Unverified UPI VPA with misleading handle (discom.billupdate...)',
      'Deceptive "PIN needed to receive reversal" psychological trigger',
      'Recent transaction timestamp (within active Golden Hour window)'
    ],
    recommendedImmediateStep: 'Call 1930 immediately to freeze the recipient VPA/Account at Axis Bank beneficiary node before fund layering occurs.',
    lossWindowStatus: 'golden_hour_active',
    goldenHourMinutesLeft: 95
  },
  actions: [
    {
      id: 'act-1',
      title: 'Call 1930 (National Cybercrime Financial Helpline)',
      why: 'Allows the Indian Cybercrime Coordination Centre (I4C) to trigger an inter-bank lien to freeze stolen funds at the receiving bank node.',
      how: 'Dial 1930 from your registered mobile phone. State your Bank (HDFC), UTR (423719820491), Amount (₹18,500), and Recipient VPA.',
      urgency: 'critical_now',
      category: 'freeze_funds',
      completed: true,
      officialChannel: '1930',
      scriptText: 'Hello, I need to report an ongoing financial cyber fraud. ₹18,500 was debited from my HDFC Bank account at 10:28 AM. The 12-digit UTR is 423719820491. Beneficiary UPI ID is discom.billupdate.982@okaxis. Please trigger a lien/freeze in the National Cyber Crime Reporting system.'
    },
    {
      id: 'act-2',
      title: 'Contact HDFC Bank Fraud Cell (1800 258 6161)',
      why: 'Your bank must issue a recall notice (RRN Recall) to the beneficiary bank and block further unauthorized debits.',
      how: 'Call 1800 258 6161 and press the option for unauthorized digital transaction / fraud.',
      urgency: 'critical_now',
      category: 'freeze_funds',
      completed: true,
      officialChannel: 'bank_fraud_cell',
      scriptText: 'My account number ending in 9104 has had an unauthorized fraudulent transfer of ₹18,500 via UPI UTR 423719820491. Please block my UPI handle and note down the dispute reference.'
    },
    {
      id: 'act-3',
      title: 'Preserve & Lock Digital Evidence',
      why: 'WhatsApp chats can be deleted for everyone by the suspect. Screenshots and unedited exports serve as legal evidence.',
      how: 'Export WhatsApp chat without media. Save screenshot of Google Pay receipt showing 12-digit UTR.',
      urgency: 'high_1hr',
      category: 'evidence',
      completed: true
    },
    {
      id: 'act-4',
      title: 'File Formal Complaint on cybercrime.gov.in (NCRP)',
      why: 'A formal FIR or Police Incident Record is required by banks for final dispute settlement and refund processing.',
      how: 'Visit cybercrime.gov.in → Report Cyber Crime → Financial Fraud. Attach the NIVARAN Case Dossier PDF.',
      urgency: 'medium_today',
      category: 'law_enforcement',
      completed: true,
      officialChannel: 'ncrp'
    }
  ],
  suspects: [
    {
      id: 'susp-1',
      type: 'upi_id',
      value: 'discom.billupdate.982@okaxis',
      source: 'Google Pay Receipt (ev-002)',
      matchingReportsCount: 17,
      notes: 'Beneficiary handle used in Google Pay transfer. Matched in 17 Nivaran reports.'
    },
    {
      id: 'susp-2',
      type: 'phone_number',
      value: '+91 70192 84920',
      source: 'WhatsApp Chat Export (ev-001)',
      matchingReportsCount: 17,
      notes: 'Number used for WhatsApp threat call.'
    },
    {
      id: 'susp-3',
      type: 'website_url',
      value: 'http://bescom-bill-update.xyz/download.apk',
      source: 'WhatsApp Chat Transcript',
      notes: 'Phishing download URL delivering malicious APK.'
    }
  ],
  userNotes: 'Contacted HDFC branch manager on 24-Aug. Waiting for response to submitted dispute letter.'
};

export const DEMO_CASE_2: IncidentCase = {
  caseId: 'NVR-2026-00089',
  userId: 'usr-demo-001',
  createdAt: '2026-08-22T16:10:00+05:30',
  updatedAt: '2026-08-23T11:20:00+05:30',
  isDemo: true,
  statusProgress: 'information_verified',
  nextAction: {
    title: 'Add NCRP Official Acknowledgement Number',
    why: 'Your Bank Fraud Cell requires the NCRP cybercrime.gov.in acknowledgement slip before processing the dispute claim.',
    actionLabel: 'Add NCRP Reference',
    actionTab: 'references',
    urgency: 'high_now'
  },
  progressTimeline: [
    {
      step: 1,
      label: 'Incident Reported',
      timestamp: '22 Aug 2026 · 04:10 PM',
      completed: true,
      description: 'Recorded fake airline refund customer support scam.'
    },
    {
      step: 2,
      label: 'Information Verified',
      timestamp: '22 Aug 2026 · 05:00 PM',
      completed: true,
      description: 'Transaction UTR 392019481029 verified with State Bank of India.'
    },
    {
      step: 3,
      label: 'Complaint Forwarded',
      timestamp: 'Pending submission',
      completed: false,
      isCurrent: true,
      description: 'Awaiting submission of formal complaint to NCRP portal.'
    },
    {
      step: 4,
      label: 'Under Investigation',
      timestamp: 'Pending',
      completed: false,
      description: 'Nodal coordination with recipient payment aggregator.'
    },
    {
      step: 5,
      label: 'Action / Resolution',
      timestamp: 'Pending',
      completed: false,
      description: 'Dispute adjudication.'
    },
    {
      step: 6,
      label: 'Closed',
      timestamp: 'Pending',
      completed: false,
      description: 'Case closure.'
    }
  ],
  externalReferences: [
    {
      id: 'ref-sbi-01',
      authority: 'bank',
      authorityName: 'State Bank of India (SBI)',
      referenceNumber: 'SBI-REF-49210',
      dateSubmitted: '22 Aug 2026, 05:30 PM',
      status: 'awaiting_response',
      statusDisplay: 'Ticket Logged with Fraud Cell',
      source: 'User entered',
      lastUpdated: '22 Aug 2026, 17:30',
      notes: 'Customer support dispute registered for fraudulent collect request.'
    }
  ],
  responses: [],
  conflicts: [],
  connectedCampaign: KNOWN_CAMPAIGNS_DATABASE[1],
  escalationLadder: generateGenericEscalationLadder('State Bank of India', 'SBI-REF-49210'),
  category: 'fake_customer_care',
  whatHappenedSummary: 'Searched Google for airline baggage customer care number after a flight delay. Called a number listed on Google search results (+91 91203 94812). The person said my refund of ₹7,200 is approved and sent a UPI collect request on PhonePe labeled "REFUND_CREDIT". When accepted, ₹7,200 was debited from my SBI savings account.',
  complainant: {
    name: 'Rajesh Sharma',
    phone: '+91 98451 92837',
    email: 'rajesh.sharma@example.com',
    city: 'Bengaluru',
    state: 'Karnataka'
  },
  transactions: [
    {
      id: 'tx-002',
      amount: 7200,
      currency: 'INR',
      timestamp: '2026-08-22 16:04:10',
      senderBank: 'State Bank of India (SBI)',
      senderAccountMasked: '2049',
      recipientUpiOrAcc: 'airhelp.refunds.912@ybl',
      recipientNameIfKnown: 'AIR TRAVEL REFUND HUB',
      utrNumber: '392019481029',
      paymentApp: 'PhonePe',
      paymentMethod: 'UPI',
      notes: 'UPI Collect request approved expecting credit.'
    }
  ],
  evidence: [
    {
      id: 'ev-010',
      type: 'screenshot',
      title: 'PhonePe Collect Request Transaction Receipt',
      description: 'Screenshot showing ₹7,200 debited via UPI Collect Request.',
      timestamp: '2026-08-22 16:05:00',
      source: 'PhonePe App',
      status: 'verified',
      relevance: 'critical',
      fileName: 'phonepe_collect_receipt.png',
      fileSizeBytes: 310000,
      extractedData: {
        amount: 7200,
        utrNumber: '392019481029',
        upiId: 'airhelp.refunds.912@ybl'
      }
    }
  ],
  timeline: [
    {
      id: 'tl-10',
      timestamp: '03:55 PM',
      title: 'Searched Airline Support Number on Google',
      description: 'Found poisoned SEO number +91 91203 94812 pretending to be airline helpdesk.',
      actor: 'victim',
      source: 'From user description',
      urgency: 'info'
    },
    {
      id: 'tl-11',
      timestamp: '04:04 PM',
      title: 'UPI Collect Request Accepted',
      description: 'PhonePe collect request accepted thinking it was a refund deposit.',
      actor: 'victim',
      source: 'From user description',
      urgency: 'warning'
    },
    {
      id: 'tl-12',
      timestamp: '04:05 PM',
      title: '₹7,200 Debited from SBI Account',
      description: 'Debit alert received from State Bank of India with UTR 392019481029.',
      actor: 'bank',
      source: 'From uploaded screenshot (ev-010)',
      urgency: 'critical'
    }
  ],
  analysis: {
    likelyType: 'Search Engine Poisoning & Fake Customer Care UPI Collect Fraud',
    fraudCategory: 'fake_customer_care',
    confidence: 'high',
    riskLevel: 'high',
    riskScore: 78,
    reasonFactors: [
      'Unverified phone number retrieved from search engine snippet',
      'Deceptive use of UPI Collect Request labeled as refund credit',
      'Entering PIN is never required to receive money'
    ],
    recommendedImmediateStep: 'File bank chargeback for fraudulent Collect Request and report search listing.',
    lossWindowStatus: 'window_narrowing',
    goldenHourMinutesLeft: 0
  },
  actions: [
    {
      id: 'act-10',
      title: 'Report Unauthorized Collect Request to SBI Fraud Cell',
      why: 'Notify State Bank of India to mark the collect request transaction reference as deceptive.',
      how: 'Call 1800 11 1109 or visit the home branch with transaction UTR 392019481029.',
      urgency: 'high_now',
      category: 'freeze_funds',
      completed: true,
      officialChannel: 'bank_fraud_cell'
    },
    {
      id: 'act-11',
      title: 'Submit Complaint on cybercrime.gov.in (NCRP)',
      why: 'Attach PhonePe transaction screenshot to obtain legal Police Acknowledgement Number.',
      how: 'Log in to cybercrime.gov.in and complete the financial fraud form.',
      urgency: 'medium_today',
      category: 'law_enforcement',
      completed: false,
      officialChannel: 'ncrp'
    }
  ],
  suspects: [
    {
      id: 'susp-10',
      type: 'phone_number',
      value: '+91 91203 94812',
      source: 'Google Search Result',
      matchingReportsCount: 8,
      notes: 'Fake airline support number on Google search.'
    },
    {
      id: 'susp-11',
      type: 'upi_id',
      value: 'airhelp.refunds.912@ybl',
      source: 'PhonePe Collect Request',
      matchingReportsCount: 8,
      notes: 'PhonePe Collect VPA.'
    }
  ]
};

export const INITIAL_DEMO_CASES: IncidentCase[] = [DEMO_CASE_1, DEMO_CASE_2];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'HDFC Bank Response Added (Ref: HDFC-98127)',
    message: 'HDFC Bank has acknowledged recall memo and requested NCRP copy.',
    timestamp: '24 Aug 2026 · 02:00 PM',
    read: false,
    type: 'response_alert',
    caseId: 'NVR-2026-00124'
  },
  {
    id: 'notif-2',
    title: 'Possible Connected Campaign Detected',
    message: 'Recipient handle discom.billupdate.982@okaxis matches 17 reports across the Nivaran network.',
    timestamp: '24 Aug 2026 · 01:30 PM',
    read: false,
    type: 'evidence_alert',
    caseId: 'NVR-2026-00124'
  },
  {
    id: 'notif-3',
    title: 'Case Readiness: 7 / 9 Items Available',
    message: 'Your case dossier has core transaction proof. Submit Bank Dispute Notice to complete escalation readiness.',
    timestamp: '24 Aug 2026 · 11:15 AM',
    read: false,
    type: 'action_reminder',
    caseId: 'NVR-2026-00124'
  }
];
