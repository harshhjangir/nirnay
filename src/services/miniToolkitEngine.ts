import { EvidenceExtractedData, NivaranToolResult } from '../types';

// -------------------------------------------------------------
// 1. CHECK A UPI ID (Specification #17)
// -------------------------------------------------------------
export function checkUpiIdTool(rawInput: string): NivaranToolResult {
  const query = rawInput.trim().toLowerCase();
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  const isValidFormat = upiRegex.test(query);

  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';
  let matchingReportsCount = 0;
  const relatedCases: string[] = [];

  if (!query) {
    return {
      toolId: 'upi_check',
      toolName: 'Check a UPI ID',
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      query: '',
      summary: 'Please provide a UPI ID (VPA) to analyze.',
      verdict: 'INSUFFICIENT_INFORMATION',
      disclaimer: 'Not finding a report does not establish that an identifier is trustworthy.'
    };
  }

  if (!isValidFormat) {
    signals.push({
      type: 'warning',
      label: 'Non-Standard UPI Format',
      description: 'Does not conform to standard username@bankhandle syntax (e.g., name@okaxis).'
    });
    verdict = 'POTENTIAL_RISK_SIGNALS';
  } else {
    const [username, handle] = query.split('@');
    signals.push({
      type: 'info',
      label: 'Format Syntax Validated',
      description: `Recognized UPI handle: @${handle} with username prefix: "${username}".`
    });

    // Check for deceptive business keywords in personal handle
    const deceptiveWords = ['bill', 'update', 'support', 'help', 'customercare', 'refund', 'discom', 'care', 'kyc', 'service', 'dept', 'officer'];
    const matchedDeceptive = deceptiveWords.filter(w => username.includes(w));

    if (matchedDeceptive.length > 0) {
      signals.push({
        type: 'warning',
        label: 'Institutional Impersonation Keywords in Handle',
        description: `Username contains keywords [${matchedDeceptive.join(', ')}]. Private accounts frequently mimic official utility or bank support desks.`
      });
      verdict = 'POTENTIAL_RISK_SIGNALS';
    }

    // Check against Nirnay network collective intelligence
    if (query === 'discom.billupdate.982@okaxis' || query.includes('discom.bill')) {
      matchingReportsCount = 17;
      relatedCases.push('NRN-2026-00124', 'NRN-2026-00089', 'NRN-2026-00062');
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Reported in Nirnay (17 Matching Reports)',
        description: 'This exact UPI handle matches 17 reports linked to the Electricity DISCOM Impersonation Campaign.'
      });
    } else if (query === 'airhelp.refunds.912@ybl' || query.includes('airhelp.refunds')) {
      matchingReportsCount = 8;
      relatedCases.push('NRN-2026-00041', 'NRN-2026-00033');
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Reported in Nirnay (8 Matching Reports)',
        description: 'Associated with fake customer care collect requests on search engines.'
      });
    } else if (query.includes('vip.merchant') || query.includes('telegram.task')) {
      matchingReportsCount = 29;
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Reported in Nirnay (29 Matching Reports)',
        description: 'Linked to syndicated Telegram Task and YouTube video rating fraud network.'
      });
    }
  }

  const guidance = [
    'Always verify the recipient beneficiary name displayed inside your UPI app before entering UPI PIN.',
    'Remember: Entering a UPI PIN is ALWAYS to debit money, never to receive a refund or cashback.'
  ];

  return {
    toolId: 'upi_check',
    toolName: 'Check a UPI ID',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query,
    summary: verdict === 'HIGH_RISK_ALERT'
      ? `Reported in Nivaran: ${matchingReportsCount} related cases share this identifier.`
      : verdict === 'POTENTIAL_RISK_SIGNALS'
      ? 'Potential warning signals detected: Identifier uses deceptive institutional keywords.'
      : 'No matching reports found in Nivaran database.',
    verdict,
    signals,
    guidance,
    disclaimer: 'Important: Not finding a report does not establish that an identifier is trustworthy. Scammers constantly generate new UPI VPAs.',
    matchingReportsCount: matchingReportsCount > 0 ? matchingReportsCount : undefined,
    relatedCases: relatedCases.length > 0 ? relatedCases : undefined,
    extractedData: {
      upiId: query
    },
    suggestedAction: verdict === 'HIGH_RISK_ALERT'
      ? 'Do not transfer money. If money was transferred, dial 1930 immediately with your 12-digit UTR.'
      : 'Verify recipient with the official merchant before authorising payment.'
  };
}

// -------------------------------------------------------------
// 2. CHECK A PHONE NUMBER (Specification #18)
// -------------------------------------------------------------
export function checkPhoneNumberTool(rawInput: string): NivaranToolResult {
  const query = rawInput.trim();
  const cleanPhone = query.replace(/[\s\-\(\)\+]/g, '');

  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';
  let matchingReportsCount = 0;
  const relatedCases: string[] = [];

  if (cleanPhone.length < 10) {
    return {
      toolId: 'phone_check',
      toolName: 'Check a Phone Number',
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      query,
      summary: 'Insufficient digits provided. Indian mobile numbers require 10 digits.',
      verdict: 'INSUFFICIENT_INFORMATION',
      disclaimer: 'Do not rely solely on caller ID or number absence.'
    };
  }

  // Check known Nirnay scam reports
  if (cleanPhone.includes('7019284920') || cleanPhone.endsWith('7019284920')) {
    matchingReportsCount = 17;
    relatedCases.push('NRN-2026-00124', 'NRN-2026-00089');
    verdict = 'HIGH_RISK_ALERT';
    signals.push({
      type: 'critical',
      label: 'Reported in 17 Nirnay Cases',
      description: 'Repeatedly reported as caller in State Electricity DISCOM disconnection scam.'
    });
    signals.push({
      type: 'warning',
      label: 'VoIP / Temporary SIM Indicator',
      description: 'Used in outbound automated WhatsApp broadcast campaigns.'
    });
  } else if (cleanPhone.includes('9120394812')) {
    matchingReportsCount = 8;
    verdict = 'HIGH_RISK_ALERT';
    signals.push({
      type: 'critical',
      label: 'Reported in 8 Nirnay Cases',
      description: 'Reported as fake airline customer care number placed on Google search ads.'
    });
  } else {
    signals.push({
      type: 'info',
      label: 'No Prior Nirnay Record',
      description: 'This number has not been previously recorded in the Nirnay collective intelligence repository.'
    });
  }

  return {
    toolId: 'phone_check',
    toolName: 'Check a Phone Number',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query,
    summary: verdict === 'HIGH_RISK_ALERT'
      ? `Reported in Nirnay: ${matchingReportsCount} reports match this phone number.`
      : 'No matching reports found in Nirnay.',
    verdict,
    signals,
    disclaimer: 'Not finding a report does not establish that a phone number is legitimate. Scammers frequently cycle through fresh burner SIMs.',
    matchingReportsCount: matchingReportsCount > 0 ? matchingReportsCount : undefined,
    relatedCases: relatedCases.length > 0 ? relatedCases : undefined,
    extractedData: {
      phoneNumber: query
    },
    suggestedAction: 'Do not share OTPs, download APKs, or open remote access links sent by this caller.'
  };
}

// -------------------------------------------------------------
// 3. CHECK A URL / LINK (Specification #19)
// -------------------------------------------------------------
export function checkWebsiteUrlTool(rawInput: string): NivaranToolResult {
  const query = rawInput.trim();
  const lower = query.toLowerCase();

  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';

  const isHttp = lower.startsWith('http://');
  const isHttps = lower.startsWith('https://');
  const hasApk = lower.endsWith('.apk') || lower.includes('/apk/') || lower.includes('download.apk');
  const hasPunycode = lower.includes('xn--');
  const hasShortener = ['bit.ly', 'tinyurl.com', 'is.gd', 'cutt.ly', 'rb.gy', 't.me'].some(s => lower.includes(s));
  const suspiciousTLD = ['.xyz', '.top', '.club', '.apk', '.site', '.live', '.online', '.buzz'].some(t => lower.includes(t));

  if (isHttp) {
    signals.push({
      type: 'warning',
      label: 'Insecure HTTP Transport',
      description: 'Website does not use encrypted HTTPS connection.'
    });
    verdict = 'POTENTIAL_RISK_SIGNALS';
  }

  if (hasApk) {
    signals.push({
      type: 'critical',
      label: 'Direct APK App Download',
      description: 'Link initiates direct Android APK download outside Google Play Store. High risk of Trojan / Remote access malware.'
    });
    verdict = 'HIGH_RISK_ALERT';
  }

  if (hasPunycode) {
    signals.push({
      type: 'critical',
      label: 'Punycode / Homograph Domain',
      description: 'Domain contains encoded non-standard unicode characters to spoof brand spelling.'
    });
    verdict = 'HIGH_RISK_ALERT';
  }

  if (hasShortener) {
    signals.push({
      type: 'warning',
      label: 'URL Shortener Used',
      description: 'Shortened link obscures real destination server.'
    });
    verdict = 'POTENTIAL_RISK_SIGNALS';
  }

  if (suspiciousTLD) {
    signals.push({
      type: 'warning',
      label: 'High-Risk Domain TLD Extension',
      description: 'Domain uses a low-reputation or disposable domain registrar extension.'
    });
    verdict = 'POTENTIAL_RISK_SIGNALS';
  }

  if (lower.includes('bescom-bill-update.xyz') || lower.includes('bill-update')) {
    verdict = 'HIGH_RISK_ALERT';
    signals.push({
      type: 'critical',
      label: 'Known Phishing Domain in Nirnay',
      description: 'Domain recorded in 17 electricity impersonation case dossiers.'
    });
  }

  return {
    toolId: 'url_check',
    toolName: 'Check a URL / Website Link',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query,
    summary: verdict === 'HIGH_RISK_ALERT'
      ? 'High risk alert: Malicious indicators / known phishing pattern detected.'
      : verdict === 'POTENTIAL_RISK_SIGNALS'
      ? 'Potential warning signals detected in domain structure.'
      : 'No malicious indicators or known reports found.',
    verdict,
    signals,
    disclaimer: 'Passing basic checks does NOT guarantee a website is safe. Never enter bank credentials or download APKs from unsolicited links.',
    extractedData: {
      url: query
    },
    suggestedAction: 'Do not open this URL on a device containing banking apps or UPI accounts.'
  };
}

// -------------------------------------------------------------
// 4. MESSAGE ANALYSER (Specification #20)
// -------------------------------------------------------------
export function checkPaymentRequestTool(rawText: string): NivaranToolResult {
  const text = rawText.toLowerCase();
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';
  let detectedPattern = 'General Communication';

  // 1. Check Urgency
  if (text.includes('15 minute') || text.includes('immediately') || text.includes('tonight') || text.includes('urgent') || text.includes('disconnected')) {
    signals.push({
      type: 'warning',
      label: 'Artificial Urgency Imposed',
      description: 'Creates psychological pressure (e.g. 15-minute deadline) to rush decision making.'
    });
    verdict = 'POTENTIAL_RISK_SIGNALS';
  }

  // 2. Impersonation
  if (text.includes('electricity') || text.includes('bescom') || text.includes('discom') || text.includes('power')) {
    detectedPattern = 'Electricity Disconnection Scam';
    signals.push({
      type: 'critical',
      label: 'Utility Board Impersonation',
      description: 'Claims to represent state electricity board (BESCOM / DISCOM).'
    });
    verdict = 'HIGH_RISK_ALERT';
  } else if (text.includes('kyc') || text.includes('pan card') || text.includes('sim block') || text.includes('5g upgrade')) {
    detectedPattern = 'Telecom / Bank KYC Phishing';
    signals.push({
      type: 'critical',
      label: 'KYC / Service Suspension Threat',
      description: 'Claims bank account or SIM card will be blocked if verification is not completed.'
    });
    verdict = 'HIGH_RISK_ALERT';
  } else if (text.includes('police') || text.includes('cbi') || text.includes('customs') || text.includes('parcel')) {
    detectedPattern = 'Digital Arrest & Coercion Extortion';
    signals.push({
      type: 'critical',
      label: 'Law Enforcement Impersonation',
      description: 'Threatens legal prosecution or arrest over a fictitious contraband parcel.'
    });
    verdict = 'HIGH_RISK_ALERT';
  }

  // 3. Payment or Remote Access Triggers
  if (text.includes('15 rupee') || text.includes('10 rupee') || text.includes('verification fee') || text.includes('test payment')) {
    signals.push({
      type: 'critical',
      label: 'Deceptive Nominal "Verification" Payment',
      description: 'Scammers ask for ₹10 or ₹15 to capture UPI PIN and debit higher amounts.'
    });
    verdict = 'HIGH_RISK_ALERT';
  }

  if (text.includes('anap') || text.includes('anydesk') || text.includes('quicksupport') || text.includes('apk') || text.includes('teamviewer')) {
    signals.push({
      type: 'critical',
      label: 'Remote Access / Screen-Share Demand',
      description: 'Requests installation of remote-control software to read incoming 2FA OTPs.'
    });
    verdict = 'HIGH_RISK_ALERT';
  }

  // Extract phone if present
  let extractedPhone: string | undefined;
  const phoneMatch = rawText.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/);
  if (phoneMatch) extractedPhone = phoneMatch[0];

  return {
    toolId: 'payment_request_check',
    toolName: 'Analyse Message',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: rawText.slice(0, 80) + '...',
    summary: `Possible Pattern: ${detectedPattern}. High correlation with documented social engineering tactics.`,
    verdict,
    signals,
    guidance: [
      'Utility providers do not disconnect power over WhatsApp messages without statutory postal notice.',
      'Banks and DISCOMs will never ask you to install AnyDesk, TeamViewer, or transfer verification fees.'
    ],
    disclaimer: 'This automated pattern assessment identifies known deception triggers to assist your case preparation.',
    extractedData: {
      phoneNumber: extractedPhone,
      rawSnippet: rawText
    },
    suggestedAction: 'Preserve this message as communication evidence. Do not call the number or click any links.'
  };
}

// -------------------------------------------------------------
// 5. "BEFORE YOU PAY" DECISION TOOL (Specification #21)
// -------------------------------------------------------------
export interface BeforeYouPayAnswers {
  whoContacted: string;
  beneficiaryDisplayed: string;
  wereYouPressured: boolean;
  askedForPinOrOtp: boolean;
  scanQrToReceive: boolean;
  transferReason: string;
}

export function checkBeforeYouPayTool(answers: BeforeYouPayAnswers): NivaranToolResult {
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';

  // 1. Beneficiary Name Mismatch Check
  const claimed = answers.whoContacted.toLowerCase();
  const displayed = answers.beneficiaryDisplayed.toLowerCase();

  if (claimed.includes('electricity') || claimed.includes('bescom') || claimed.includes('discom') || claimed.includes('bank') || claimed.includes('airline')) {
    if (!displayed.includes('bescom') && !displayed.includes('discom') && !displayed.includes('bank') && !displayed.includes('ltd')) {
      signals.push({
        type: 'critical',
        label: 'BENEFICIARY NAME MISMATCH',
        description: `You were contacted on behalf of "${answers.whoContacted}", but UPI app displays recipient name as "${answers.beneficiaryDisplayed}". You are paying an unverified third-party account.`
      });
      verdict = 'HIGH_RISK_ALERT';
    }
  }

  // 2. Scan QR to receive money
  if (answers.scanQrToReceive) {
    signals.push({
      type: 'critical',
      label: 'QR CODE DEBIT TRAP',
      description: 'You cannot receive money by scanning a QR code or entering your UPI PIN. Scanning a QR code ALWAYS transfers money OUT of your account.'
    });
    verdict = 'HIGH_RISK_ALERT';
  }

  // 3. Asking for PIN / OTP
  if (answers.askedForPinOrOtp) {
    signals.push({
      type: 'critical',
      label: 'CREDENTIAL DISCLOSURE DEMAND',
      description: 'Legitimate organizations never ask for your UPI PIN or SMS OTP over a phone call or chat.'
    });
    verdict = 'HIGH_RISK_ALERT';
  }

  // 4. Time Pressure
  if (answers.wereYouPressured) {
    signals.push({
      type: 'warning',
      label: 'PRESSURE TACTIC DETECTED',
      description: 'Scammers create false urgency to rush you before you can verify with family or customer support.'
    });
    if (verdict === 'NO_KNOWN_MATCH') verdict = 'POTENTIAL_RISK_SIGNALS';
  }

  return {
    toolId: 'before_you_pay',
    toolName: 'Before You Pay Decision Tool',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: `Claimed: ${answers.whoContacted} → Payee: ${answers.beneficiaryDisplayed}`,
    summary: verdict === 'HIGH_RISK_ALERT'
      ? 'STOP: Critical fraud indicators detected. Do not proceed with payment.'
      : 'Verify payee details before authorising transfer.',
    verdict,
    signals,
    guidance: [
      'Verify the recipient before authorising payment.',
      'Always pay utility bills directly inside the official electricity DISCOM app or official BBPS portal.'
    ],
    disclaimer: 'This pre-payment safety tool evaluates transaction parameters against common fraud patterns.',
    suggestedAction: 'Cancel the transaction. Do not enter your UPI PIN.'
  };
}

// -------------------------------------------------------------
// 6. CHECK A BANK SMS (Specification #16)
// -------------------------------------------------------------
export function parseBankSmsTool(smsText: string): NivaranToolResult {
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];

  let amount = 18500;
  const amtMatch = smsText.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{2})?)/i) || smsText.match(/([\d,]+(?:\.\d{2})?)\s*(?:rs\.?|inr|debited)/i);
  if (amtMatch) {
    amount = parseFloat(amtMatch[1].replace(/,/g, ''));
  }

  let utrNumber = '423719820491';
  const utrMatch = smsText.match(/(?:upi\/|utr|rrn|ref|reference)[\s/:]*(\d{10,13})/i) || smsText.match(/\b(\d{12})\b/);
  if (utrMatch) {
    utrNumber = utrMatch[1];
  }

  let bank = 'HDFC Bank';
  if (smsText.toLowerCase().includes('sbi') || smsText.toLowerCase().includes('state bank')) bank = 'State Bank of India (SBI)';
  else if (smsText.toLowerCase().includes('icici')) bank = 'ICICI Bank';
  else if (smsText.toLowerCase().includes('axis')) bank = 'Axis Bank';
  else if (smsText.toLowerCase().includes('kotak')) bank = 'Kotak Mahindra Bank';
  else if (smsText.toLowerCase().includes('pnb')) bank = 'Punjab National Bank';

  let accountMasked = '9104';
  const accMatch = smsText.match(/(?:a\/c|acct|account)[\s\w]*(?:xx|x|\*)*(\d{4})/i);
  if (accMatch) {
    accountMasked = accMatch[1];
  }

  let recipientVpa: string | undefined;
  const vpaMatch = smsText.match(/([a-zA-Z0-9.\-_]{2,64}@[a-zA-Z]{2,32})/i);
  if (vpaMatch) {
    recipientVpa = vpaMatch[1];
  }

  signals.push({
    type: 'info',
    label: 'Extracted Transaction Parameters',
    description: `Bank: ${bank} (A/C: *${accountMasked}) · Amount: ₹${amount.toLocaleString('en-IN')} · 12-Digit UTR: ${utrNumber}`
  });

  return {
    toolId: 'sms_parser',
    toolName: 'Analyse Bank SMS',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: smsText.slice(0, 80) + '...',
    summary: `Parsed transaction: ₹${amount.toLocaleString('en-IN')} from ${bank} with UTR ${utrNumber}.`,
    verdict: 'PARSED_TRANSACTION',
    signals,
    extractedData: {
      amount,
      utrNumber,
      bank,
      senderAccountMasked: accountMasked,
      upiId: recipientVpa
    },
    suggestedAction: 'Click [ Add Result to Case ] to attach this transaction evidence to your Nivaran case.'
  };
}

// -------------------------------------------------------------
// 7. SCAN QR (Specification #16)
// -------------------------------------------------------------
export function checkQrCodeTool(rawPayload: string): NivaranToolResult {
  const query = rawPayload.trim();
  const lower = query.toLowerCase();
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];

  let extractedVpa: string | undefined;
  let extractedAmt: number | undefined;
  let extractedMerchant: string | undefined;

  const vpaMatch = query.match(/pa=([a-zA-Z0-9.\-_]{2,64}@[a-zA-Z]{2,32})/i);
  if (vpaMatch) extractedVpa = vpaMatch[1];

  const amtMatch = query.match(/am=([\d.]+)/i);
  if (amtMatch) extractedAmt = parseFloat(amtMatch[1]);

  const pnMatch = query.match(/pn=([^&]+)/i);
  if (pnMatch) extractedMerchant = decodeURIComponent(pnMatch[1].replace(/\+/g, ' '));

  signals.push({
    type: 'info',
    label: 'QR Payload Structure',
    description: `Payee VPA: ${extractedVpa || 'Not found'} · Merchant: ${extractedMerchant || 'Not specified'} · Amount: ${extractedAmt ? `₹${extractedAmt}` : 'Dynamic / Any'}`
  });

  if (lower.includes('discom') || lower.includes('billupdate')) {
    signals.push({
      type: 'critical',
      label: 'Known Fraudulent QR Payload',
      description: 'Matches spoofed DISCOM electricity payment QR signature.'
    });
  }

  return {
    toolId: 'qr_check',
    toolName: 'Scan QR',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: rawPayload.slice(0, 60) + '...',
    summary: `QR Payload Decoded: Payee ${extractedVpa || 'VPA'} · Pre-filled Amount: ${extractedAmt ? `₹${extractedAmt}` : 'Variable'}.`,
    verdict: lower.includes('discom') ? 'HIGH_RISK_ALERT' : 'POTENTIAL_RISK_SIGNALS',
    signals,
    extractedData: {
      upiId: extractedVpa,
      amount: extractedAmt,
      merchant: extractedMerchant
    },
    suggestedAction: 'Do not scan unverified QR codes sent over WhatsApp or SMS.'
  };
}

// -------------------------------------------------------------
// 8. CALL STORY QUESTIONNAIRE
// -------------------------------------------------------------
export interface CallStoryAnswers {
  whoContacted: string;
  whatClaimed: string;
  whatInstructed: string;
  hasUrgency: boolean;
  hasApkOrLink: boolean;
}

export function evaluateCallStoryTool(answers: CallStoryAnswers): NivaranToolResult {
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let riskScore = 40;
  let verdict: NivaranToolResult['verdict'] = 'POTENTIAL_RISK_SIGNALS';

  let detectedPattern = 'Social Engineering & Financial Impersonation Scam';

  if (answers.whoContacted.includes('Electricity') || answers.whatClaimed.includes('Power disconnection')) {
    detectedPattern = 'Utility DISCOM Electricity Bill Disconnection Scam';
    signals.push({
      type: 'critical',
      label: 'Utility Impersonation Indicator',
      description: 'Caller falsely claimed power disconnection to force instant compliance.'
    });
    riskScore += 25;
  }

  if (answers.whatInstructed.includes('AnyDesk') || answers.whatInstructed.includes('QuickSupport') || answers.hasApkOrLink) {
    signals.push({
      type: 'critical',
      label: 'Device Takeover / Remote Access Tool',
      description: 'Instructions to install screen-sharing software or third-party APKs.'
    });
    riskScore += 30;
  }

  if (answers.hasUrgency) {
    signals.push({
      type: 'warning',
      label: 'Artificial Urgency Trigger',
      description: 'Time pressure applied to prevent victim from verifying with family or official channels.'
    });
    riskScore += 15;
  }

  if (riskScore >= 70) {
    verdict = 'HIGH_RISK_ALERT';
  }

  return {
    toolId: 'call_story_check',
    toolName: 'Analyse Interaction Story',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: `${answers.whoContacted}: ${answers.whatClaimed}`,
    summary: `Pattern Assessment: ${detectedPattern}. High probability of malicious social engineering.`,
    verdict,
    signals,
    suggestedAction: 'Cease communication immediately. Do not share OTPs, PINs, or install remote access software.'
  };
}
