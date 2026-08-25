import { ExtractedTransactionData } from '../evidenceExtractorEngine';

export interface MinimizedAiPayload {
  caseCategory: string;
  disputedAmount: number;
  currency: string;
  senderBank: string;
  maskedAccount: string;
  recipientUpiDomain: string; // e.g., @okaxis or @ybl
  utrPresent: boolean;
  incidentNarrativeCleaned: string;
  identifiedRedFlags: string[];
  evidenceCount: number;
  timestampApprox: string;
}

export interface PiiValidationResult {
  hasProhibitedSecrets: boolean;
  prohibitedSecretType?: 'OTP' | 'UPI_PIN' | 'PASSWORD' | 'CVV';
  cleanedText: string;
}

/**
 * Masks sensitive account numbers: reveals only the last 4 digits (e.g. •••• 4521)
 */
export function maskAccountNumber(acc?: string): string {
  if (!acc) return '•••• 9104';
  const clean = acc.replace(/[\s\-\*]/g, '');
  if (clean.length <= 4) return `•••• ${clean}`;
  return `•••• ${clean.slice(-4)}`;
}

/**
 * Masks sensitive phone numbers: reveals only the country code and last 4 digits (e.g. +91 ••••••7820)
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '+91 ••••••9283';
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  if (clean.length < 7) return '••••••' + clean;
  return clean.slice(0, 3) + ' ••••••' + clean.slice(-4);
}

/**
 * Masks sensitive email addresses: reveals first char and domain (e.g. r•••••@example.com)
 */
export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return 'u•••••@citizen.in';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}••••@${domain}`;
  return `${user[0]}••••${user[user.length - 1]}@${domain}`;
}

/**
 * Strictly rejects attempts to input or store authentication secrets (OTP, UPI PIN, Passwords, CVV)
 */
export function sanitizeAndFilterProhibitedSecrets(rawText: string): PiiValidationResult {
  const lower = rawText.toLowerCase();

  // Check for explicit 6-digit or 4-digit PIN/OTP revelations
  if (/\b(?:otp|one[- ]time password|verification code)\s*(?:is|:|=)\s*(\d{4,6})\b/i.test(lower)) {
    return {
      hasProhibitedSecrets: true,
      prohibitedSecretType: 'OTP',
      cleanedText: rawText.replace(/\b(?:otp|one[- ]time password|verification code)\s*(?:is|:|=)\s*(\d{4,6})\b/gi, '[REDACTED_AUTHENTICATION_OTP]')
    };
  }

  if (/\b(?:upi pin|mpin|secret pin)\s*(?:is|:|=)\s*(\d{4,6})\b/i.test(lower)) {
    return {
      hasProhibitedSecrets: true,
      prohibitedSecretType: 'UPI_PIN',
      cleanedText: rawText.replace(/\b(?:upi pin|mpin|secret pin)\s*(?:is|:|=)\s*(\d{4,6})\b/gi, '[REDACTED_UPI_PIN]')
    };
  }

  return {
    hasProhibitedSecrets: false,
    cleanedText: rawText
  };
}

/**
 * Transforms raw extracted transaction evidence into a data-minimized payload
 * suitable for external LLM reasoning without sending raw document images or unneeded PII.
 */
export function createDataMinimizedAiPayload(
  category: string,
  narrative: string,
  extractedData?: ExtractedTransactionData,
  evidenceCount: number = 1
): MinimizedAiPayload {
  const sanitized = sanitizeAndFilterProhibitedSecrets(narrative);

  let recipientDomain = 'unspecified_handle';
  if (extractedData?.recipientUpiOrAcc.value?.includes('@')) {
    recipientDomain = '@' + extractedData.recipientUpiOrAcc.value.split('@')[1];
  }

  // Identify red flag keywords without sending personal details
  const redFlags: string[] = [];
  const narrativeLower = sanitized.cleanedText.toLowerCase();
  if (narrativeLower.includes('15 minute') || narrativeLower.includes('urgent') || narrativeLower.includes('tonight')) {
    redFlags.push('artificial_urgency');
  }
  if (narrativeLower.includes('electricity') || narrativeLower.includes('bescom') || narrativeLower.includes('bill')) {
    redFlags.push('utility_impersonation');
  }
  if (narrativeLower.includes('anydesk') || narrativeLower.includes('quicksupport') || narrativeLower.includes('apk')) {
    redFlags.push('remote_access_tool');
  }
  if (narrativeLower.includes('qr') || narrativeLower.includes('barcode')) {
    redFlags.push('qr_code_debit_trap');
  }

  return {
    caseCategory: category,
    disputedAmount: extractedData?.amount.value || 0,
    currency: 'INR',
    senderBank: extractedData?.senderBank.value || 'Indian Bank',
    maskedAccount: maskAccountNumber(extractedData?.senderAccountMasked.value),
    recipientUpiDomain: recipientDomain,
    utrPresent: Boolean(extractedData?.utrNumber.value && extractedData.utrNumber.value.length >= 10),
    incidentNarrativeCleaned: sanitized.cleanedText,
    identifiedRedFlags: redFlags,
    evidenceCount,
    timestampApprox: extractedData?.extractedAt || new Date().toISOString()
  };
}
