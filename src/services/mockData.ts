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

// DEMO CASE 1: Electricity Impersonation Call (₹18,500)
export const DEMO_CASE_1: IncidentCase = {
  caseId: 'NVR-2026-00124',
  userId: 'usr-demo-001',
  createdAt: '2026-08-24T10:32:00+05:30',
  updatedAt: '2026-08-24T14:20:00+05:30',
  isDemo: true,
  statusProgress: 'under_investigation',
  nextAction: {
    title: 'Review Bank Dispute Response & Prepare Grievance Escalation',
    why: 'HDFC Bank has classified the debit as customer-authorised due to PIN entry. Under RBI consumer circulars, submit social engineering evidence to the Bank Grievance Redressal Officer.',
    actionLabel: 'Review Bank Response & Escalation',
    actionTab: 'responses',
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
      authorityName: 'NCRP (cybercrime.gov.in)',
      referenceNumber: '2026/KA/0048192',
      dateSubmitted: '24 Aug 2026, 12:30 PM',
      status: 'submitted',
      statusDisplay: 'Submitted / Acknowledgement Generated',
      source: 'User entered',
      lastUpdated: '24 Aug 2026, 12:30',
      notes: 'Police acknowledgement receipt generated on national portal.'
    }
  ],
  responses: [
    {
      id: 'resp-hdfc-01',
      referenceId: 'ref-hdfc-01',
      responder: 'HDFC Bank Dispute Resolution Desk',
      date: '24 Aug 2026, 02:00 PM',
      decision: 'Dispute Rejected (Classified as Customer Authorised)',
      reason: 'Transaction executed using valid device binding and secret UPI MPIN.',
      whatTheySaid: 'The bank has classified the transaction as authorised because valid UPI MPIN was entered on the registered mobile device. Claim for chargeback is rejected at branch level.',
      whatThisRelatesTo: {
        transactionAmount: 18500,
        utrNumber: '423719820491',
        beneficiary: 'discom.billupdate.982@okaxis'
      },
      whatCaseContains: [
        'Impersonation threat call from +91 70192 84920 claiming BESCOM power disconnection',
        'WhatsApp screenshot with fake payment link (ev-001)',
        'Beneficiary mismatch: Electricity bill paid to private individual VPA (discom.billupdate.982@okaxis)'
      ],
      plainSummary: 'HDFC Bank rejected the initial dispute because your UPI PIN was entered. However, under RBI Consumer Liability Circulars, when social engineering deception is proved, you have the right to escalate to the Principal Nodal Grievance Officer and the RBI Banking Ombudsman.',
      potentialNextAction: 'Escalate to HDFC Principal Nodal Officer quoting RBI Zero Liability Circular (DBR.No.Leg.BC.78/09.07.005/2017-18) within 30 days.',
      nextStepOptions: [
        'Submit Escalation Letter to HDFC Grievance Redressal Officer',
        'Submit formal complaint to RBI CMS Portal (Banking Ombudsman)',
        'Provide NCRP Police Acknowledgement copy to the bank branch'
      ],
      escalationStage: 2,
      rawText: 'Dear Customer, with reference to dispute HDFC-98127 for UPI transfer of INR 18,500.00 (UTR 423719820491), internal logs confirm the transaction was authenticated by 6-digit MPIN. Hence the dispute is closed as customer authorised. For further grievance, contact grievance.redressal@hdfcbank.com.',
      source: 'Official Email Response',
      comparison: {
        matchesCaseAmount: true,
        matchesCaseUtr: true,
        discrepancies: [],
        summary: 'Response matches Case UTR 423719820491 and disputed amount ₹18,500.'
      }
    }
  ],
  escalationLadder: generateGenericEscalationLadder('HDFC Bank', 'HDFC-98127'),
  connectedCampaign: KNOWN_CAMPAIGNS_DATABASE[0],
  complainant: {
    name: 'Rajesh Sharma',
    phone: '+91 98451 92837',
    email: 'rajesh.sharma@example.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    alternatePhone: '+91 98451 00000',
    preferredLanguage: 'English'
  },
  category: 'upi_fraud',
  incidentDate: '2026-08-24',
  incidentTime: '10:28',
  amountLostTotal: 18500,
  whatHappenedSummary: 'I received an urgent call at 10:15 AM from a caller (+91 70192 84920) claiming to be from the Electricity Board (BESCOM). He said my previous month electricity bill was unpaid and power supply to my home would be cut off at 11:00 AM unless I paid a ₹15 verification charge immediately. He sent a WhatsApp message with a payment link. When I opened it on Google Pay to pay ₹15, a debit of ₹18,500 was processed to VPA discom.billupdate.982@okaxis (UTR: 423719820491). I realized I was defrauded and immediately contacted HDFC Bank and 1930.',
  transactions: [
    {
      id: 'tx-001',
      senderBank: 'HDFC Bank',
      senderAccountMasked: '9104',
      senderAccountType: 'savings',
      recipientName: 'M/S BILLDESK POWER MGT',
      recipientUpiOrAcc: 'discom.billupdate.982@okaxis',
      recipientBankIfsc: 'UTIB0000281',
      paymentMethod: 'UPI',
      paymentApp: 'Google Pay',
      amount: 18500,
      currency: 'INR',
      utrNumber: '423719820491',
      timestamp: '2026-08-24 10:28:14',
      status: 'debited_confirmed',
      source: 'OCR EXTRACTED',
      confidence: 'high'
    }
  ],
  evidence: [
    {
      id: 'ev-001',
      type: 'whatsapp_chat',
      title: 'WhatsApp Disconnection Threat Chat Export',
      description: 'Threat messages from +91 70192 84920 claiming BESCOM power disconnection.',
      timestamp: '2026-08-24 10:18:00',
      source: 'WhatsApp Chat Export',
      sourceTypeLabel: 'DOCUMENT EXTRACTED',
      status: 'verified',
      relevance: 'critical',
      fileName: 'whatsapp_bescom_chat.txt',
      fileSizeBytes: 42000,
      extractedData: {
        phone: '+917019284920',
        url: 'http://bescom-bill-update.xyz/download.apk'
      }
    },
    {
      id: 'ev-002',
      type: 'screenshot',
      title: 'Google Pay Payment Success Screen',
      description: 'Transaction confirmation showing ₹18,500 sent to discom.billupdate.982@okaxis with UTR 423719820491.',
      timestamp: '2026-08-24 10:28:14',
      source: 'Google Pay App',
      sourceTypeLabel: 'OCR EXTRACTED',
      status: 'verified',
      relevance: 'critical',
      fileName: 'gpay_receipt_18500.jpg',
      fileSizeBytes: 485000,
      extractedData: {
        amount: 18500,
        utrNumber: '423719820491',
        upiId: 'discom.billupdate.982@okaxis',
        senderBank: 'HDFC Bank'
      }
    },
    {
      id: 'ev-003',
      type: 'bank_sms',
      title: 'HDFC Bank Official Debit SMS Alert',
      description: 'SMS confirmation from HDFCBK: INR 18,500.00 debited from a/c **9104 by UPI/423719820491/discom.bill.',
      timestamp: '2026-08-24 10:28:30',
      source: 'HDFC Bank SMS',
      sourceTypeLabel: 'DOCUMENT EXTRACTED',
      status: 'verified',
      relevance: 'critical',
      extractedData: {
        amount: 18500,
        utrNumber: '423719820491',
        accountNumberMasked: '9104',
        senderBank: 'HDFC Bank'
      }
    }
  ],
  timeline: [
    {
      id: 'tl-1',
      timestamp: '10:15 AM',
      title: 'Fraudulent Disconnection Threat Call',
      description: 'Caller (+91 70192 84920) claimed to be Electricity Board officer demanding immediate ₹15 verification fee.',
      actor: 'suspect',
      source: 'User Statement',
      sourceLabel: 'USER REPORTED',
      urgency: 'critical'
    },
    {
      id: 'tl-2',
      timestamp: '10:18 AM',
      title: 'WhatsApp Deceptive Link Sent',
      description: 'Threat text received on WhatsApp with phishing payment link.',
      actor: 'suspect',
      source: 'WhatsApp chat export (ev-001)',
      sourceLabel: 'DOCUMENT EXTRACTED',
      urgency: 'warning'
    },
    {
      id: 'tl-3',
      timestamp: '10:28 AM',
      title: 'Unauthorized ₹18,500 UPI Debit Processed',
      description: 'Google Pay transfer processed to beneficiary VPA discom.billupdate.982@okaxis (UTR: 423719820491).',
      actor: 'bank',
      source: 'Google Pay screenshot (ev-002)',
      sourceLabel: 'DOCUMENT EXTRACTED',
      urgency: 'critical'
    },
    {
      id: 'tl-4',
      timestamp: '10:45 AM',
      title: 'Emergency 1930 Helpline Call Made',
      description: 'Citizen reported incident to 1930 National Cybercrime helpline. Reference CF-728191 generated.',
      actor: 'victim',
      source: '1930 Acknowledgement (CF-728191)',
      sourceLabel: 'EXTERNAL RESPONSE',
      urgency: 'info'
    },
    {
      id: 'tl-5',
      timestamp: '11:30 AM',
      title: 'HDFC Bank Fraud Dispute Logged',
      description: 'Formal dispute filed with HDFC Bank Fraud Control Unit under reference HDFC-98127.',
      actor: 'victim',
      source: 'HDFC Ticket (HDFC-98127)',
      sourceLabel: 'EXTERNAL RESPONSE',
      urgency: 'info'
    },
    {
      id: 'tl-6',
      timestamp: '02:00 PM',
      title: 'HDFC Dispute Response Received',
      description: 'HDFC Bank responded classifying transaction as customer-authorised due to PIN entry.',
      actor: 'bank',
      source: 'HDFC Email Response (resp-hdfc-01)',
      sourceLabel: 'EXTERNAL RESPONSE',
      urgency: 'warning'
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
    }
  ],
  suspects: [
    {
      id: 'susp-1',
      type: 'upi_id',
      value: 'discom.billupdate.982@okaxis',
      source: 'Google Pay Receipt (ev-002)',
      sourceTypeLabel: 'OCR EXTRACTED',
      matchingReportsCount: 17,
      notes: 'Beneficiary handle used in Google Pay transfer. Matched in 17 Nivaran reports.'
    },
    {
      id: 'susp-2',
      type: 'phone_number',
      value: '+91 70192 84920',
      source: 'WhatsApp Chat Export (ev-001)',
      sourceTypeLabel: 'USER ENTERED',
      matchingReportsCount: 17,
      notes: 'Number used for WhatsApp threat call.'
    },
    {
      id: 'susp-3',
      type: 'website_url',
      value: 'http://bescom-bill-update.xyz/download.apk',
      source: 'WhatsApp Chat Transcript',
      sourceTypeLabel: 'CASE TOOL',
      notes: 'Phishing download URL delivering malicious APK.'
    }
  ],
  userNotes: 'Contacted HDFC branch manager on 24-Aug. Waiting for response to submitted dispute letter.'
};

// DEMO CASE 2: Fake Airline Customer Care / Search Engine Poisoning (₹7,200)
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
      timestamp: '22 Aug 2026 · 06:15 PM',
      completed: true,
      description: 'Submitted dispute to SBI Branch.'
    }
  ],
  externalReferences: [
    {
      id: 'ref-sbi-01',
      authority: 'bank',
      authorityName: 'SBI Nodal Fraud Cell',
      referenceNumber: 'SBI-DISP-48192',
      dateSubmitted: '22 Aug 2026, 05:30 PM',
      status: 'submitted',
      statusDisplay: 'Submitted',
      source: 'User entered',
      lastUpdated: '22 Aug 2026, 05:30'
    }
  ],
  responses: [],
  escalationLadder: generateGenericEscalationLadder('State Bank of India', 'SBI-DISP-48192'),
  complainant: {
    name: 'Ananya Deshmukh',
    phone: '+91 98201 44819',
    email: 'ananya.d@example.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    preferredLanguage: 'English'
  },
  category: 'fake_customer_care',
  incidentDate: '2026-08-22',
  incidentTime: '16:04',
  amountLostTotal: 7200,
  whatHappenedSummary: 'Searched for airline flight refund support on Google and called +91 91203 94812. The person sent a PhonePe collect request claiming it was a refund credit. ₹7,200 was debited from my SBI account instead.',
  transactions: [
    {
      id: 'tx-002',
      senderBank: 'State Bank of India',
      senderAccountMasked: '4821',
      senderAccountType: 'savings',
      recipientName: 'AIRLINE REFUND DESK',
      recipientUpiOrAcc: 'airhelp.refunds.912@ybl',
      paymentMethod: 'UPI',
      paymentApp: 'PhonePe',
      amount: 7200,
      currency: 'INR',
      utrNumber: '392019481029',
      timestamp: '2026-08-22 16:05:00',
      status: 'debited_confirmed',
      source: 'OCR EXTRACTED',
      confidence: 'high'
    }
  ],
  evidence: [
    {
      id: 'ev-010',
      type: 'screenshot',
      title: 'PhonePe Collect Request Receipt',
      description: 'Screenshot showing ₹7,200 debited via UPI Collect Request.',
      timestamp: '2026-08-22 16:05:00',
      source: 'PhonePe App',
      sourceTypeLabel: 'OCR EXTRACTED',
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
      source: 'User description',
      sourceLabel: 'USER REPORTED',
      urgency: 'info'
    },
    {
      id: 'tl-11',
      timestamp: '04:05 PM',
      title: '₹7,200 Debited from SBI Account',
      description: 'Debit alert received from State Bank of India with UTR 392019481029.',
      actor: 'bank',
      source: 'PhonePe screenshot (ev-010)',
      sourceLabel: 'DOCUMENT EXTRACTED',
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
  actions: [],
  suspects: [
    {
      id: 'susp-10',
      type: 'phone_number',
      value: '+91 91203 94812',
      source: 'Google Search Result',
      sourceTypeLabel: 'CASE TOOL',
      matchingReportsCount: 8,
      notes: 'Fake airline support number on Google search.'
    },
    {
      id: 'susp-11',
      type: 'upi_id',
      value: 'airhelp.refunds.912@ybl',
      source: 'PhonePe Collect Request',
      sourceTypeLabel: 'OCR EXTRACTED',
      matchingReportsCount: 8,
      notes: 'PhonePe Collect VPA.'
    }
  ]
};

// DEMO CASE 3: Telegram Task / Job Fraud (₹65,000)
export const DEMO_CASE_3: IncidentCase = {
  caseId: 'NVR-2026-00052',
  userId: 'usr-demo-001',
  createdAt: '2026-08-19T14:15:00+05:30',
  updatedAt: '2026-08-20T10:00:00+05:30',
  isDemo: true,
  statusProgress: 'under_investigation',
  nextAction: {
    title: 'File Formal Police Cyber Cell FIR with Complete Transaction Trail',
    why: 'Loss exceeds ₹50,000 threshold. Submit the compiled multi-transaction Nivaran dossier to the Cyber Crime Police Station.',
    actionLabel: 'Export Case PDF for Cyber Cell',
    actionTab: 'evidence',
    urgency: 'critical_now'
  },
  progressTimeline: [
    {
      step: 1,
      label: 'Incident Reported',
      timestamp: '19 Aug 2026 · 02:15 PM',
      completed: true,
      description: 'Recorded Telegram hotel review rating task scam.'
    },
    {
      step: 2,
      label: 'Information Verified',
      timestamp: '19 Aug 2026 · 03:30 PM',
      completed: true,
      description: '3 sequential transfers totalling ₹65,000 verified with ICICI Bank.'
    },
    {
      step: 3,
      label: 'Complaint Forwarded',
      timestamp: '19 Aug 2026 · 04:45 PM',
      completed: true,
      description: '1930 Cyber Fraud ticket 1930-TEL-9921 recorded.'
    }
  ],
  externalReferences: [
    {
      id: 'ref-1930-tel',
      authority: '1930',
      authorityName: '1930 / I4C National Helpline',
      referenceNumber: '1930-TEL-9921',
      dateSubmitted: '19 Aug 2026, 04:45 PM',
      status: 'acknowledged',
      statusDisplay: 'Lien Placed on Primary Beneficiary',
      source: 'User entered',
      lastUpdated: '19 Aug 2026, 06:10'
    },
    {
      id: 'ref-icici-tel',
      authority: 'bank',
      authorityName: 'ICICI Bank Fraud Control Cell',
      referenceNumber: 'ICICI-FT-88319',
      dateSubmitted: '19 Aug 2026, 05:15 PM',
      status: 'awaiting_response',
      statusDisplay: 'Awaiting Bank Response',
      source: 'User entered',
      lastUpdated: '19 Aug 2026, 05:15'
    }
  ],
  responses: [],
  escalationLadder: generateGenericEscalationLadder('ICICI Bank', 'ICICI-FT-88319'),
  complainant: {
    name: 'Vikram Malhotra',
    phone: '+91 97112 39182',
    email: 'vikram.m@example.com',
    city: 'New Delhi',
    state: 'Delhi',
    preferredLanguage: 'English'
  },
  category: 'investment_fraud',
  incidentDate: '2026-08-19',
  incidentTime: '13:45',
  amountLostTotal: 65000,
  whatHappenedSummary: 'Added to a Telegram group offering ₹5,000 daily for rating Google Maps hotels. Paid ₹5,000 initial task deposit and received ₹6,500 back. Then instructed to deposit ₹25,000 and ₹35,000 into merchant accounts for "VIP Level 3 Task". Withdrawals were blocked demanding an additional ₹50,000 tax clearance.',
  transactions: [
    {
      id: 'tx-003',
      senderBank: 'ICICI Bank',
      senderAccountMasked: '1092',
      senderAccountType: 'savings',
      recipientName: 'ZENITH MERCHANDISE LLP',
      recipientUpiOrAcc: 'zenith.tasksettle@icici',
      paymentMethod: 'UPI',
      paymentApp: 'Google Pay',
      amount: 35000,
      currency: 'INR',
      utrNumber: '581920391827',
      timestamp: '2026-08-19 13:45:00',
      status: 'debited_confirmed',
      source: 'OCR EXTRACTED',
      confidence: 'high'
    },
    {
      id: 'tx-004',
      senderBank: 'ICICI Bank',
      senderAccountMasked: '1092',
      senderAccountType: 'savings',
      recipientName: 'APEX TRADING HUB',
      recipientUpiOrAcc: 'apex.merchant91@yesbank',
      paymentMethod: 'UPI',
      paymentApp: 'Google Pay',
      amount: 30000,
      currency: 'INR',
      utrNumber: '581920391811',
      timestamp: '2026-08-19 12:30:00',
      status: 'debited_confirmed',
      source: 'OCR EXTRACTED',
      confidence: 'high'
    }
  ],
  evidence: [
    {
      id: 'ev-020',
      type: 'telegram_chat',
      title: 'Telegram Task Group Chat Export',
      description: 'Chat logs with group admin @hr_meenakshi_tasks promising guaranteed returns on rating tasks.',
      timestamp: '2026-08-19 13:50:00',
      source: 'Telegram Export',
      sourceTypeLabel: 'DOCUMENT EXTRACTED',
      status: 'verified',
      relevance: 'critical',
      fileName: 'telegram_tasks_chat.txt',
      fileSizeBytes: 89000
    }
  ],
  timeline: [
    {
      id: 'tl-20',
      timestamp: '11:00 AM',
      title: 'Added to Telegram Job Group',
      description: 'Contacted by @hr_meenakshi_tasks offering part-time Google Maps hotel rating commissions.',
      actor: 'suspect',
      source: 'Telegram Chat',
      sourceLabel: 'DOCUMENT EXTRACTED',
      urgency: 'info'
    },
    {
      id: 'tl-21',
      timestamp: '01:45 PM',
      title: '₹65,000 Transferred in Sequential Tasks',
      description: 'Completed 2 transfers (₹30,000 and ₹35,000) to merchant accounts.',
      actor: 'victim',
      source: 'ICICI Statement',
      sourceLabel: 'DOCUMENT EXTRACTED',
      urgency: 'critical'
    }
  ],
  analysis: {
    likelyType: 'Telegram Task & Crypto-Rating Layering Scam',
    fraudCategory: 'investment_fraud',
    confidence: 'high',
    riskLevel: 'critical',
    riskScore: 95,
    reasonFactors: [
      'Initial small payout to induce false trust (bait mechanism)',
      'Escalating deposit requirements under "task completion" pretext',
      'Refusal to allow withdrawals without additional "tax" deposits'
    ],
    recommendedImmediateStep: 'Immediately stop sending further funds and report all merchant beneficiary accounts to 1930.',
    lossWindowStatus: 'window_narrowing',
    goldenHourMinutesLeft: 0
  },
  actions: [],
  suspects: [
    {
      id: 'susp-20',
      type: 'upi_id',
      value: 'zenith.tasksettle@icici',
      source: 'ICICI Statement',
      sourceTypeLabel: 'OCR EXTRACTED',
      matchingReportsCount: 42,
      notes: 'Mule merchant account associated with Telegram rating scam ring.'
    }
  ]
};

export const INITIAL_DEMO_CASES: IncidentCase[] = [DEMO_CASE_1, DEMO_CASE_2, DEMO_CASE_3];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'HDFC Bank Response Added (Ref: HDFC-98127)',
    message: 'HDFC Bank response: Dispute rejected as customer-authorised. Review escalation route.',
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
    title: 'Nivaran Case Readiness: 9 / 10 Items Ready',
    message: 'Your case contains full evidence and official references. Keep response records updated.',
    timestamp: '24 Aug 2026 · 11:15 AM',
    read: false,
    type: 'action_reminder',
    caseId: 'NVR-2026-00124'
  }
];
