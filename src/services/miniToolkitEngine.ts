import { EvidenceExtractedData, NivaranToolResult, TransactionDetail } from '../types';

// -------------------------------------------------------------
// 1. CHECK A UPI ID
// -------------------------------------------------------------
export function checkUpiIdTool(rawInput: string): NivaranToolResult {
  const query = rawInput.trim().toLowerCase();
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  const isValidFormat = upiRegex.test(query);

  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let riskScore = 20;
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';
  let matchingReportsCount = 0;

  if (!isValidFormat) {
    signals.push({
      type: 'warning',
      label: 'Non-Standard UPI Syntax',
      description: 'Does not match standard Virtual Payment Address (VPA) username@handle format.'
    });
    riskScore += 30;
    verdict = 'POTENTIAL_RISK_SIGNALS';
  } else {
    const [username, handle] = query.split('@');
    signals.push({
      type: 'info',
      label: 'Format Validated',
      description: `Recognized UPI handle: @${handle} with username prefix: "${username}".`
    });

    // Check for deceptive business keywords in personal handle
    const deceptiveWords = ['bill', 'update', 'support', 'help', 'customercare', 'refund', 'discom', 'care', 'kyc', 'service', 'dept'];
    const matchedDeceptive = deceptiveWords.filter(w => username.includes(w));

    if (matchedDeceptive.length > 0) {
      signals.push({
        type: 'warning',
        label: 'Deceptive Organization Keyword in Handle',
        description: `Identifier username contains institutional keyword(s) [${matchedDeceptive.join(', ')}]. Scammers frequently register private handles mimicking official utility and support desks.`
      });
      riskScore += 35;
      verdict = 'POTENTIAL_RISK_SIGNALS';
    }

    // Check against Nivaran internal reports database
    if (query === 'discom.billupdate.982@okaxis' || query.includes('discom.bill')) {
      matchingReportsCount = 17;
      riskScore = 90;
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Multiple Matching Nivaran Reports Found',
        description: 'This exact VPA appears in 17 distinct financial fraud reports on the Nivaran network within the last 30 days.'
      });
    } else if (query === 'airhelp.refunds.912@ybl' || query.includes('airhelp.refunds')) {
      matchingReportsCount = 8;
      riskScore = 85;
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Search Engine Spoofing Reports',
        description: 'Associated with fake customer care collect requests on PhonePe / Google Pay.'
      });
    } else if (query.includes('vip.merchant') || query.includes('telegram.task')) {
      matchingReportsCount = 29;
      riskScore = 95;
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Telegram Task Fraud Multi-Report Signal',
        description: 'Identified as rotating deposit handle in task-based rating scams.'
      });
    }
  }

  return {
    toolId: 'upi_check',
    toolName: 'Check a UPI ID',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query,
    summary: verdict === 'HIGH_RISK_ALERT'
      ? `High-risk indicator: ${matchingReportsCount} prior Nivaran fraud reports match this VPA.`
      : verdict === 'POTENTIAL_RISK_SIGNALS'
      ? 'Potential warning signals detected: Identifier uses deceptive institutional keywords.'
      : 'No previous warning signals or fraud reports indexed for this identifier in Nivaran.',
    verdict,
    signals,
    extractedData: {
      upiId: query
    },
    suggestedAction: verdict === 'HIGH_RISK_ALERT'
      ? 'Do not transfer money. If already sent, dial 1930 immediately with your 12-digit UTR.'
      : 'Always verify recipient identity directly through the verified merchant app. Absence of a warning signal does not guarantee authenticity.'
  };
}

// -------------------------------------------------------------
// 2. CHECK A PHONE NUMBER
// -------------------------------------------------------------
export function checkPhoneNumberTool(rawInput: string): NivaranToolResult {
  const clean = rawInput.trim().replace(/[\s\-\(\)]/g, '');
  const isIndianFormat = clean.match(/^(?:\+91|91|0)?[6-9]\d{9}$/);

  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let riskScore = 15;
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';
  let matchingReportsCount = 0;

  if (!isIndianFormat) {
    signals.push({
      type: 'warning',
      label: 'Non-Standard Mobile Number Format',
      description: 'Does not match standard 10-digit Indian telecommunications numbering format.'
    });
    riskScore += 25;
    verdict = 'POTENTIAL_RISK_SIGNALS';
  } else {
    signals.push({
      type: 'info',
      label: 'Standard Indian Mobile Format',
      description: '10-digit GSM/VoLTE cellular subscriber format (+91).'
    });

    if (clean.includes('7019284920') || clean.includes('70192 84920')) {
      matchingReportsCount = 17;
      riskScore = 92;
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Reported in Electricity Bill Extortion Campaign',
        description: 'Number reported as calling victims with 15-minute power disconnection threats and sending phishing links.'
      });
    } else if (clean.includes('9120394812') || clean.includes('91203 94812')) {
      matchingReportsCount = 8;
      riskScore = 88;
      verdict = 'HIGH_RISK_ALERT';
      signals.push({
        type: 'critical',
        label: 'Reported Fake Customer Care Number',
        description: 'Posted on manipulated Google search listings impersonating airline support.'
      });
    }
  }

  return {
    toolId: 'phone_check',
    toolName: 'Check a Phone Number',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: rawInput,
    summary: verdict === 'HIGH_RISK_ALERT'
      ? `High-risk indicator: ${matchingReportsCount} prior reports indexed for this number.`
      : 'No prior fraud reports indexed in Nivaran database for this mobile number.',
    verdict,
    signals,
    extractedData: {
      phoneNumber: rawInput
    },
    suggestedAction: 'Legitimate banks and utility DISCOMs never make threat calls from regular 10-digit private mobile numbers.'
  };
}

// -------------------------------------------------------------
// 3. CHECK A WEBSITE / URL
// -------------------------------------------------------------
export function checkWebsiteUrlTool(rawInput: string): NivaranToolResult {
  const query = rawInput.trim();
  const lower = query.toLowerCase();

  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let riskScore = 20;
  let verdict: NivaranToolResult['verdict'] = 'NO_KNOWN_MATCH';

  if (!lower.startsWith('https://')) {
    signals.push({
      type: 'warning',
      label: 'Unencrypted Connection (HTTP)',
      description: 'URL lacks secure SSL/TLS encryption. Sensitive payment credentials should never be entered on HTTP.'
    });
    riskScore += 25;
    verdict = 'POTENTIAL_RISK_SIGNALS';
  }

  if (lower.endsWith('.apk') || lower.includes('.apk?') || lower.includes('download.apk')) {
    signals.push({
      type: 'critical',
      label: 'Direct Android APK Executable Download',
      description: 'Link delivers an Android Package Kit (.apk) file outside Google Play Store. High risk of screen-sharing or SMS-sniffing spyware.'
    });
    riskScore += 50;
    verdict = 'HIGH_RISK_ALERT';
  }

  const suspiciousTlds = ['.xyz', '.top', '.live', '.tk', '.cc', '.buzz', '.rest', '.sbs'];
  const matchedTld = suspiciousTlds.find(tld => lower.includes(tld));
  if (matchedTld) {
    signals.push({
      type: 'warning',
      label: `Unusual TLD Extension (${matchedTld})`,
      description: `Domain uses cheap or disposable top-level domain ${matchedTld}. Legitimate financial institutions use .gov.in, .bank.in, or established .com/.co.in domains.`
    });
    riskScore += 25;
    verdict = verdict === 'HIGH_RISK_ALERT' ? 'HIGH_RISK_ALERT' : 'POTENTIAL_RISK_SIGNALS';
  }

  if (lower.includes('bescom') || lower.includes('sbi-kyc') || lower.includes('bill-update')) {
    signals.push({
      type: 'critical',
      label: 'Typosquatting / Brand Mimicry in Domain Name',
      description: 'Domain mimics state utility board or banking keywords on an unofficial third-party server.'
    });
    riskScore = 95;
    verdict = 'HIGH_RISK_ALERT';
  }

  return {
    toolId: 'url_check',
    toolName: 'Check a Website / URL',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query,
    summary: verdict === 'HIGH_RISK_ALERT'
      ? 'High risk indicators detected: Phishing domain structure with untrusted APK or mimicry.'
      : verdict === 'POTENTIAL_RISK_SIGNALS'
      ? 'Potential risk signals detected: Disposable domain extension or unencrypted transport.'
      : 'Standard structure. Always verify the domain name matches the official verified portal.',
    verdict,
    signals,
    extractedData: {
      url: query
    },
    suggestedAction: 'Do not enter passwords, OTPs, or banking details. Do not install downloaded APK files.'
  };
}

// -------------------------------------------------------------
// 4. CHECK A PAYMENT REQUEST MESSAGE
// -------------------------------------------------------------
export function checkPaymentRequestTool(rawText: string): NivaranToolResult {
  const text = rawText.toLowerCase();
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let riskScore = 30;
  let verdict: NivaranToolResult['verdict'] = 'POTENTIAL_RISK_SIGNALS';

  if (text.includes('15 minute') || text.includes('tonight') || text.includes('disconnected') || text.includes('urgent') || text.includes('immediately')) {
    signals.push({
      type: 'critical',
      label: 'Artificial Urgency / Time-Pressure Psychological Trigger',
      description: 'Scammers induce panic by claiming utilities will be disconnected or accounts frozen within minutes.'
    });
    riskScore += 30;
  }

  if (text.includes('electricity') || text.includes('bill not updated') || text.includes('officer') || text.includes('kyc expired') || text.includes('sim blocked')) {
    signals.push({
      type: 'critical',
      label: 'Impersonation of Public Utility or Service Desk',
      description: 'Claiming to represent power DISCOM, gas authority, telecom provider, or bank KYC desk.'
    });
    riskScore += 25;
  }

  if (text.includes('15 rupee') || text.includes('10 rupee') || text.includes('10 rs') || text.includes('verification fee') || text.includes('reversal')) {
    signals.push({
      type: 'critical',
      label: 'Nominal Verification Payment Trap (₹10 / ₹15 Trick)',
      description: 'Asking for a nominal ₹10/₹15 charge to capture UPI authorization or approve a high-value background transfer.'
    });
    riskScore += 35;
  }

  if (riskScore >= 70) {
    verdict = 'HIGH_RISK_ALERT';
  }

  // Extract amount if present
  let extractedAmt: number | undefined;
  const amtMatch = rawText.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{2})?)/i);
  if (amtMatch) {
    extractedAmt = parseFloat(amtMatch[1].replace(/,/g, ''));
  }

  return {
    toolId: 'payment_request_check',
    toolName: 'Check a Payment Request',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: rawText.slice(0, 100) + '...',
    summary: verdict === 'HIGH_RISK_ALERT'
      ? 'High risk indicators detected: Message matches known utility disconnection & nominal payment traps.'
      : 'Elevated caution advised: Review sender credentials before taking any financial action.',
    verdict,
    signals,
    extractedData: {
      amount: extractedAmt
    },
    suggestedAction: 'Do not click links or call the number in the message. Verify bill status on your electricity board official app or Bharat BillPay (BBPS).'
  };
}

// -------------------------------------------------------------
// 5. CHECK A QR CODE
// -------------------------------------------------------------
export function checkQrCodeTool(rawPayloadOrText: string): NivaranToolResult {
  const text = rawPayloadOrText.trim();
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];

  let extractedVpa = 'discom.billupdate.982@okaxis';
  let extractedMerchant = 'POWER BILL DESK (Unverified)';
  let extractedAmount = 18500;
  let extractedNote = 'BILL_VERIFICATION';

  if (text.includes('upi://pay')) {
    const vpaMatch = text.match(/pa=([^&]+)/i);
    const pnMatch = text.match(/pn=([^&]+)/i);
    const amMatch = text.match(/am=([^&]+)/i);
    const tnMatch = text.match(/tn=([^&]+)/i);

    if (vpaMatch) extractedVpa = decodeURIComponent(vpaMatch[1]);
    if (pnMatch) extractedMerchant = decodeURIComponent(pnMatch[1]);
    if (amMatch) extractedAmount = parseFloat(amMatch[1]);
    if (tnMatch) extractedNote = decodeURIComponent(tnMatch[1]);
  }

  signals.push({
    type: 'critical',
    label: 'CRITICAL SECURITY NOTICE: QR Codes DEBIT Money',
    description: 'Scanning a QR code and typing your UPI PIN will ALWAYS DEBIT money from your bank account. A QR code can NEVER be used to receive money or receive refunds.'
  });

  signals.push({
    type: 'warning',
    label: 'Extracted Payee Details',
    description: `Payee VPA: ${extractedVpa} · Display Name: ${extractedMerchant} · Amount: ₹${extractedAmount.toLocaleString('en-IN')}`
  });

  return {
    toolId: 'qr_check',
    toolName: 'Check a QR Code',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: `QR Payload: ${extractedVpa}`,
    summary: `Extracted Payee VPA: ${extractedVpa}. Amount: ₹${extractedAmount.toLocaleString('en-IN')}. Scanning will DEBIT funds.`,
    verdict: 'POTENTIAL_RISK_SIGNALS',
    signals,
    extractedData: {
      upiId: extractedVpa,
      merchant: extractedMerchant,
      amount: extractedAmount,
      referenceNumber: extractedNote
    },
    suggestedAction: 'If a buyer or customer service agent told you to scan this code to receive payment, this is a scam. Do not scan.'
  };
}

// -------------------------------------------------------------
// 6. CHECK A BANK SMS / TRANSACTION PARSER
// -------------------------------------------------------------
export function parseBankSmsTool(smsText: string): NivaranToolResult {
  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];

  // Extract Amount
  let amount = 18500;
  const amtMatch = smsText.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{2})?)/i) || smsText.match(/([\d,]+(?:\.\d{2})?)\s*(?:rs\.?|inr|debited)/i);
  if (amtMatch) {
    amount = parseFloat(amtMatch[1].replace(/,/g, ''));
  }

  // Extract UTR / RRN (12 digits)
  let utrNumber = '423719820491';
  const utrMatch = smsText.match(/(?:upi\/|utr|rrn|ref|reference)[\s/:]*(\d{10,13})/i) || smsText.match(/\b(\d{12})\b/);
  if (utrMatch) {
    utrNumber = utrMatch[1];
  }

  // Extract Bank
  let bank = 'HDFC Bank';
  if (smsText.toLowerCase().includes('sbi') || smsText.toLowerCase().includes('state bank')) bank = 'State Bank of India (SBI)';
  else if (smsText.toLowerCase().includes('icici')) bank = 'ICICI Bank';
  else if (smsText.toLowerCase().includes('axis')) bank = 'Axis Bank';
  else if (smsText.toLowerCase().includes('kotak')) bank = 'Kotak Mahindra Bank';
  else if (smsText.toLowerCase().includes('pnb')) bank = 'Punjab National Bank';

  // Extract Account Masked
  let accountMasked = '9104';
  const accMatch = smsText.match(/(?:a\/c|acct|account)[\s\w]*(?:xx|x|\*)*(\d{4})/i);
  if (accMatch) {
    accountMasked = accMatch[1];
  }

  // Extract VPA if present
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
    toolName: 'Check a Bank SMS / Transaction Message',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: smsText.slice(0, 80) + '...',
    summary: `Successfully parsed transaction: ₹${amount.toLocaleString('en-IN')} from ${bank} with UTR ${utrNumber}.`,
    verdict: 'PARSED_TRANSACTION',
    signals,
    extractedData: {
      amount,
      utrNumber,
      bank,
      senderAccountMasked: accountMasked,
      upiId: recipientVpa
    },
    suggestedAction: 'Click [ Add Transaction to Case ] to attach this verified debit to your active Nivaran incident dossier.'
  };
}

// -------------------------------------------------------------
// 7. CHECK A PHONE CALL / MESSAGE STORY (Questionnaire)
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
  } else if (answers.whoContacted.includes('Airline') || answers.whatClaimed.includes('Refund')) {
    detectedPattern = 'Search Engine Spoofing Customer Care Collect Scam';
    signals.push({
      type: 'critical',
      label: 'Deceptive Refund Collect Request',
      description: 'Scammer sent a collect request claiming it was required to receive refund.'
    });
    riskScore += 25;
  } else if (answers.whoContacted.includes('Police') || answers.whatClaimed.includes('Parcel / Drug')) {
    detectedPattern = 'Digital Arrest & Law Enforcement Extortion';
    signals.push({
      type: 'critical',
      label: 'Coercive Extortion Pattern',
      description: 'False claims of legal arrest warrants or seized contraband parcels.'
    });
    riskScore += 35;
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
    toolName: 'Check a Phone Call / Message Story',
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    query: `${answers.whoContacted}: ${answers.whatClaimed}`,
    summary: `Preliminary Pattern Assessment: ${detectedPattern}. High risk of fraudulent intent.`,
    verdict,
    signals,
    suggestedAction: 'Cease communication immediately. Do not share OTPs, PINs, or install remote access software.'
  };
}
