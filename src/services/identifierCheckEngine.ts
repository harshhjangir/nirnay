import { IdentifierCheckResult } from '../types';

export function checkSuspiciousIdentifier(query: string): IdentifierCheckResult {
  const cleanQuery = query.trim();
  const lower = cleanQuery.toLowerCase();

  // Identify type
  let type: 'upi_id' | 'phone_number' | 'bank_account' | 'url' | 'unknown' = 'unknown';

  if (lower.includes('@')) {
    type = 'upi_id';
  } else if (/^(\+91[\-\s]?)?[6789]\d{9}$/.test(cleanQuery.replace(/[\s\-]/g, ''))) {
    type = 'phone_number';
  } else if (/^(http:\/\/|https:\/\/|www\.)/i.test(cleanQuery) || lower.includes('.com') || lower.includes('.in') || lower.includes('.xyz') || lower.includes('.top') || lower.includes('.apk')) {
    type = 'url';
  } else if (/^\d{9,18}$/.test(cleanQuery.replace(/\s/g, ''))) {
    type = 'bank_account';
  }

  const signals: Array<{ type: 'warning' | 'info' | 'critical'; label: string; description: string }> = [];
  let riskScore = 20;
  let verdict: IdentifierCheckResult['verdict'] = 'NO_KNOWN_MATCH';
  let verdictTitle = 'No Known Risk Flags Found in Public Heuristics';
  let confidence: 'High' | 'Moderate' | 'Low' = 'Moderate';

  // Heuristic Checks
  if (type === 'upi_id') {
    const suspiciousKeywords = ['customercare', 'helpline', 'refund', 'support', 'kyc', 'discom', 'reward', 'cashback', 'telegram', 'task', 'airtel', 'jio', 'paytm-support', 'olx'];
    const matched = suspiciousKeywords.filter(k => lower.includes(k));
    
    if (matched.length > 0) {
      riskScore += 55;
      signals.push({
        type: 'critical',
        label: 'Impersonation Keywords in UPI Handle',
        description: `Handle contains keywords often used to impersonate official entities: [${matched.join(', ')}]. Legitimate banks and utilities never use personal VPA handles for customer support.`
      });
    }

    if (lower.endsWith('@ybl') || lower.endsWith('@okaxis') || lower.endsWith('@paytm') || lower.endsWith('@oksbi') || lower.endsWith('@icici')) {
      signals.push({
        type: 'info',
        label: 'Standard Individual VPA Provider',
        description: 'This is a personal retail UPI handle rather than an authorized corporate merchant VPA with an established trade registration.'
      });
    }

    if (/\d{4,}/.test(lower)) {
      signals.push({
        type: 'warning',
        label: 'Numeric Suffix Pattern',
        description: 'Contains auto-generated or randomized phone/digit clusters typical of disposable mule accounts.'
      });
      riskScore += 15;
    }
  } else if (type === 'url') {
    if (lower.includes('.apk') || lower.includes('.download') || lower.includes('bit.ly') || lower.includes('tinyurl') || lower.includes('t.me')) {
      riskScore += 65;
      signals.push({
        type: 'critical',
        label: 'High-Risk Distribution Pattern',
        description: 'Direct link to APK payload, URL shortener, or Telegram channel. These are common vectors for screen-mirroring malware and task scams.'
      });
    }

    if (lower.includes('kyc') || lower.includes('update') || lower.includes('reward') || lower.includes('claim') || lower.includes('lottery') || lower.includes('electricity')) {
      riskScore += 45;
      signals.push({
        type: 'warning',
        label: 'Urgency / Deceptive Domain Slug',
        description: 'Domain or path uses social engineering triggers (KYC, electricity update, reward claim).'
      });
    }

    if (lower.includes('.xyz') || lower.includes('.top') || lower.includes('.site') || lower.includes('.online') || lower.includes('.buzz')) {
      riskScore += 30;
      signals.push({
        type: 'warning',
        label: 'Disposable Top-Level Domain (TLD)',
        description: 'Uses inexpensive, high-churn domain extensions frequently utilized in short-lived phishing campaigns.'
      });
    }
  } else if (type === 'phone_number') {
    const rawDigits = cleanQuery.replace(/\D/g, '');
    if (rawDigits.startsWith('91140') || rawDigits.startsWith('140')) {
      signals.push({
        type: 'info',
        label: 'Telemarketing / Automated Gateway Prefix',
        description: 'Prefix corresponds to commercial transactional or promotional telemarketing channels.'
      });
    } else {
      signals.push({
        type: 'info',
        label: 'Standard Mobile Subscriber Range',
        description: 'Valid Indian cellular mobile numbering series. Verification of caller identity required via official registered app.'
      });
    }

    if (lower.includes('7019284920') || lower.includes('9845192837')) {
      riskScore += 60;
      signals.push({
        type: 'critical',
        label: 'Identified in Recent Incident Reports',
        description: 'Matches numbers reported in active electricity/utility disconnection scam cases.'
      });
    }
  } else if (type === 'bank_account') {
    signals.push({
      type: 'info',
      label: 'Standard Bank Account Format',
      description: 'Indian banking account structure. Verify IFSC code to ensure beneficiary branch matches the purported organization.'
    });
  }

  // Calculate final verdict
  if (riskScore >= 70) {
    verdict = 'HIGH_RISK_ALERT';
    verdictTitle = 'High Risk Indicators Detected — Do Not Proceed';
    confidence = 'High';
  } else if (riskScore >= 40) {
    verdict = 'POTENTIAL_RISK_SIGNALS';
    verdictTitle = 'Potential Risk Indicators Detected — Caution Advised';
    confidence = 'Moderate';
  } else if (cleanQuery.length < 4) {
    verdict = 'INSUFFICIENT_INFORMATION';
    verdictTitle = 'Insufficient Information to Assess';
    confidence = 'Low';
  } else {
    verdict = 'NO_KNOWN_MATCH';
    verdictTitle = 'No Known Direct Risk Patterns Detected';
    confidence = 'Moderate';
  }

  const guidance: string[] = [];
  if (verdict === 'HIGH_RISK_ALERT' || verdict === 'POTENTIAL_RISK_SIGNALS') {
    guidance.push('Do NOT send money, scan QR codes, or share OTPs with this identifier.');
    guidance.push('Verify the recipient through the official website or customer care number listed on your physical bill or card.');
    guidance.push('Remember: Legitimate utility boards (BESCOM, TNEB, Tata Power, etc.) never ask for payments to personal UPI IDs or over WhatsApp calls.');
  } else {
    guidance.push('Absence of negative indicators does not guarantee safety. Scammers frequently rotate new accounts.');
    guidance.push('Never enter your UPI PIN to "receive" money, cashback, or verification refunds.');
    guidance.push('Verify the exact name displayed in the UPI app before confirming any payment.');
  }

  return {
    query: cleanQuery,
    type,
    riskScore: Math.min(100, riskScore),
    verdict,
    verdictTitle,
    confidence,
    signals,
    guidance,
    disclaimer: 'This assessment is based on automated pattern heuristics and structural signals. NIVARAN does not maintain an exhaustive blacklist. Always exercise institutional caution before transferring funds.'
  };
}
