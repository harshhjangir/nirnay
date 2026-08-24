import { ActionItem, EvidenceItem, FraudCategory, IncidentAnalysis, TransactionDetail } from '../types';

interface IntakeData {
  category: FraudCategory;
  whatHappened: string;
  transactions: TransactionDetail[];
  evidence: EvidenceItem[];
  hasRemoteAppInstalled?: boolean;
  sharedOtp?: boolean;
  isUrgentThreat?: boolean;
  externalContactChannel?: string;
}

export function analyzeIncident(data: IntakeData): IncidentAnalysis {
  let riskScore = 60;
  const reasonFactors: string[] = [];
  let likelyType = 'Digital Financial Cybercrime';
  let confidence: 'high' | 'medium' | 'preliminary' = 'medium';
  let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'high';
  let recommendedImmediateStep = 'Call 1930 immediately to log an emergency lien on the recipient account.';

  // Determine category nuances
  switch (data.category) {
    case 'upi_fraud':
      likelyType = 'UPI Social Engineering / Deceptive Payment Request';
      reasonFactors.push('Payment authorized under deception or malicious link');
      reasonFactors.push('Direct peer-to-peer or merchant VPA transfer');
      riskScore += 15;
      break;
    case 'fake_customer_care':
      likelyType = 'Impersonation Fraud / Fake Customer Support';
      reasonFactors.push('Caller impersonated official representative (bank/utility/service)');
      reasonFactors.push('Unsolicited contact directing financial transaction');
      riskScore += 20;
      break;
    case 'investment_scam':
      likelyType = 'High-Yield Investment / Task-Based Telegram Fraud';
      reasonFactors.push('Promises of quick returns or commission for rating tasks');
      reasonFactors.push('Layered deposits to multiple rotating beneficiary accounts');
      riskScore += 15;
      break;
    case 'job_scam':
      likelyType = 'Part-Time Job / Freelance Deposit Scam';
      reasonFactors.push('Victim asked to deposit security fee or crypto to release earnings');
      break;
    case 'otp_theft':
      likelyType = 'Credential / SMS OTP Interception';
      reasonFactors.push('2FA credential or debit card details compromised');
      riskScore += 25;
      break;
    case 'remote_access':
      likelyType = 'Remote Screen-Sharing Compromise (AnyDesk/TeamViewer/RustDesk)';
      reasonFactors.push('Third-party screen sharing or unauthorized remote control granted');
      reasonFactors.push('High risk of persistent device monitoring and OTP sniffing');
      riskScore += 30;
      break;
    case 'phishing':
      likelyType = 'Credential Phishing / Spoofed Banking Portal';
      reasonFactors.push('Sensitive banking login entered on unverified external webpage');
      riskScore += 20;
      break;
    case 'qr_code_scam':
      likelyType = 'Deceptive QR Code (PIN for Credit Scam)';
      reasonFactors.push('Deceptive claim that scanning QR or entering PIN receives money');
      riskScore += 15;
      break;
    case 'digital_arrest':
      likelyType = 'Digital Arrest & Law Enforcement Impersonation';
      reasonFactors.push('False intimidation regarding CBI, Customs, Police or Narcotics case');
      reasonFactors.push('Victim coerced under psychological surveillance');
      riskScore += 25;
      break;
    default:
      likelyType = 'Digital Financial Cybercrime Incident';
      reasonFactors.push('Financial anomaly detected');
      break;
  }

  // Calculate elapsed time from primary transaction for Golden Hour
  let goldenHourMinutesLeft = 120;
  let lossWindowStatus: 'golden_hour_active' | 'window_narrowing' | 'secondary_risk' = 'golden_hour_active';

  if (data.transactions.length > 0) {
    const totalAmount = data.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    if (totalAmount > 50000) {
      reasonFactors.push(`High monetary impact (₹${totalAmount.toLocaleString('en-IN')})`);
      riskScore += 10;
    } else if (totalAmount > 0) {
      reasonFactors.push(`Transaction amount documented (₹${totalAmount.toLocaleString('en-IN')})`);
    }

    if (data.transactions.some(tx => tx.utrNumber && tx.utrNumber.trim().length >= 10)) {
      reasonFactors.push('Valid 12-digit UTR/RRN available for inter-bank recall');
      confidence = 'high';
    } else {
      reasonFactors.push('UTR/RRN not yet confirmed (required for 1930 / I4C tracking)');
    }

    // Try parsing timestamp
    const firstTx = data.transactions[0];
    if (firstTx.timestamp) {
      const txTime = new Date(firstTx.timestamp).getTime();
      const now = Date.now();
      if (!isNaN(txTime)) {
        const diffMinutes = Math.max(0, Math.floor((now - txTime) / (1000 * 60)));
        if (diffMinutes <= 180) {
          goldenHourMinutesLeft = Math.max(0, 180 - diffMinutes);
          lossWindowStatus = 'golden_hour_active';
          reasonFactors.push(`Within Golden Hour window (${goldenHourMinutesLeft} mins remaining for highest freeze success rate)`);
        } else if (diffMinutes <= 1440) {
          goldenHourMinutesLeft = 0;
          lossWindowStatus = 'window_narrowing';
          reasonFactors.push('Transaction occurred within 24 hours (secondary banking escalation required)');
        } else {
          goldenHourMinutesLeft = 0;
          lossWindowStatus = 'secondary_risk';
          reasonFactors.push('Over 24 hours elapsed (requires formal NCRP police filing & bank ombudsman trail)');
        }
      }
    }
  }

  // Evidence factors
  if (data.evidence.length > 0) {
    confidence = 'high';
    reasonFactors.push(`${data.evidence.length} verified digital evidence artifact(s) attached`);
  } else {
    reasonFactors.push('No direct evidence artifacts attached yet');
  }

  // Final risk capping
  riskScore = Math.min(100, Math.max(20, riskScore));
  if (riskScore >= 75) {
    riskLevel = 'critical';
    recommendedImmediateStep = 'Immediately dial 1930 and contact your bank fraud cell to initiate a beneficiary node lien.';
  } else if (riskScore >= 50) {
    riskLevel = 'high';
    recommendedImmediateStep = 'Notify your bank fraud desk and preserve all communication transcripts.';
  } else {
    riskLevel = 'medium';
    recommendedImmediateStep = 'Review account statements, block compromised cards/UPI, and submit NCRP case.';
  }

  return {
    likelyType,
    fraudCategory: data.category,
    confidence,
    riskLevel,
    riskScore,
    reasonFactors,
    recommendedImmediateStep,
    lossWindowStatus,
    goldenHourMinutesLeft
  };
}

export function generateActionPlan(
  category: FraudCategory,
  transactions: TransactionDetail[],
  analysis: IncidentAnalysis
): ActionItem[] {
  const totalAmount = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
  const primaryTx = transactions[0];
  const primaryBank = primaryTx?.senderBank || 'your bank';
  const utr = primaryTx?.utrNumber || 'Pending UTR';

  const actions: ActionItem[] = [
    {
      id: 'act-call-1930',
      title: 'Call 1930 (National Cybercrime Financial Helpline)',
      why: 'Allows the Indian Cybercrime Coordination Centre (I4C) to coordinate an immediate freeze with the recipient bank node.',
      how: 'Dial 1930 immediately. Keep your bank name, account number, 12-digit UTR, and amount ready.',
      urgency: 'critical_now',
      category: 'freeze_funds',
      completed: false,
      officialChannel: '1930',
      scriptText: `Hello, I need to report financial cyber fraud. An amount of ₹${totalAmount.toLocaleString('en-IN')} was debited from my ${primaryBank} account. The transaction UTR is ${utr}. Recipient is ${primaryTx?.recipientUpiOrAcc || 'unknown'}. Please initiate an inter-bank lien.`
    },
    {
      id: 'act-bank-fraud-cell',
      title: `Contact ${primaryBank} Fraud Control Unit`,
      why: 'Your bank must issue a recall notice (RRN message) to the beneficiary bank and block further unauthorized debits.',
      how: `Call the 24x7 fraud helpline for ${primaryBank} and report unauthorized digital debit. Request a dispute acknowledgement number.`,
      urgency: 'critical_now',
      category: 'freeze_funds',
      completed: false,
      officialChannel: 'bank_fraud_cell',
      scriptText: `I am reporting an unauthorized/fraudulent transaction from my account. Amount: ₹${totalAmount.toLocaleString('en-IN')}, UTR: ${utr}. Please record an immediate fraud dispute ticket and block my UPI access temporarily.`
    }
  ];

  if (category === 'remote_access') {
    actions.push({
      id: 'act-remote-uninstall',
      title: 'Isolate Device & Uninstall Remote Management Software',
      why: 'Screen-sharing applications (AnyDesk, TeamViewer, RustDesk) allow attackers to continuously capture SMS OTPs and credentials.',
      how: 'Immediately turn ON Airplane Mode. Open Settings → Apps → Uninstall the screen sharing tool. Restart device.',
      urgency: 'high_now',
      category: 'account_security',
      completed: false
    });
  }

  if (category === 'otp_theft' || category === 'phishing') {
    actions.push({
      id: 'act-reset-credentials',
      title: 'Change NetBanking & UPI PINs from a Clean Device',
      why: 'If passwords or OTPs were compromised, attackers may attempt further scheduled transfers.',
      how: 'Log in to your bank portal from a secure secondary device or browser and update passwords/PINs.',
      urgency: 'high_1hr',
      category: 'account_security',
      completed: false
    });
  }

  actions.push(
    {
      id: 'act-preserve-evidence',
      title: 'Preserve Unmodified Digital Evidence',
      why: 'Suspects often delete WhatsApp chats or delete fake websites. Complete chat logs and original screenshots are legally required.',
      how: 'Export full chat history (without media). Save bank debit SMS and payment app transaction PDF.',
      urgency: 'high_1hr',
      category: 'evidence',
      completed: false
    },
    {
      id: 'act-file-ncrp',
      title: 'File Formal Cyber Complaint on cybercrime.gov.in (NCRP)',
      why: 'An official National Cybercrime Reporting Portal complaint generates a legal Acknowledgement Number required by banks to process claim reversals.',
      how: 'Log in to cybercrime.gov.in → Select "Report Financial Fraud" → Fill in transaction details and attach the NIVARAN Case Dossier.',
      urgency: 'medium_today',
      category: 'law_enforcement',
      completed: false,
      officialChannel: 'ncrp'
    }
  );

  return actions;
}
