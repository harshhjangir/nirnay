export type ScamCategoryFilter =
  | 'ALL'
  | 'PAYMENTS'
  | 'MESSAGES'
  | 'CALLS'
  | 'ACCOUNTS'
  | 'IDENTITY'
  | 'INVESTMENT'
  | 'SHOPPING';

export interface ScamProgressStep {
  label: string;
  subtext?: string;
}

export interface ScamReferenceItem {
  id: string;
  numberIndex: number;
  title: string;
  categoryTag: ScamCategoryFilter;
  categoryDisplay: string;
  whatItIs: string;
  howItStarts: string[];
  attackerMaySay: string[];
  redFlags: string[];
  whatTheyMayAskFor: string[];
  progressFlow: ScamProgressStep[];
  whatToDo: string[];
  relatedTool?: {
    tabId: 'upi' | 'phone' | 'url' | 'payment_msg' | 'qr' | 'sms' | 'call_story';
    label: string;
  };
}

export const SCAM_DATABASE: ScamReferenceItem[] = [
  {
    id: 'phishing',
    numberIndex: 1,
    title: 'Phishing',
    categoryTag: 'MESSAGES',
    categoryDisplay: 'Deceptive Messages & Links',
    whatItIs: 'A fraudulent attempt to trick you into revealing sensitive personal credentials, banking passwords, or OTPs by masquerading as a trustworthy entity through websites or emails.',
    howItStarts: [
      'Deceptive SMS with a link',
      'Phishing email disguised as your bank or tax authority',
      'Fake login portal mimicry',
      'Social media direct message',
      'Sponsored search engine advertisement'
    ],
    attackerMaySay: [
      '"Your netbanking access will be blocked within 24 hours. Update your PAN card immediately at this link."',
      '"Income Tax Refund of ₹14,280 approved. Verify your bank account credentials to claim deposit."'
    ],
    redFlags: [
      'Urgent or threatening language predicting imminent service termination',
      'Unofficial domain names (e.g. sbi-secure-update.xyz instead of onlinesbi.sbi)',
      'Unsolicited verification or password reset requests',
      'Links asking for debit card PIN or CVV number'
    ],
    whatTheyMayAskFor: [
      'Netbanking username and password',
      'One-Time Password (OTP)',
      'Debit / Credit card 16-digit number, expiry & CVV',
      'UPI MPIN'
    ],
    progressFlow: [
      { label: 'Unsolicited Contact', subtext: 'Email / SMS / Ad' },
      { label: 'Brand Impersonation', subtext: 'Bank / Tax Department' },
      { label: 'Fake Urgent Warning', subtext: 'Account block / Tax refund' },
      { label: 'Phishing Form Link', subtext: 'Victim enters passwords/OTP' },
      { label: 'Account Compromise', subtext: 'Funds transferred out' }
    ],
    whatToDo: [
      'Do not click the link or provide any credentials.',
      'Do not forward the message to others.',
      'Preserve the message and URL as evidence.',
      'Report the suspicious domain on cybercrime.gov.in / Chakshu portal.',
      'If credentials were typed, immediately change your netbanking password and block debit cards.'
    ],
    relatedTool: {
      tabId: 'url',
      label: 'Check Website / URL'
    }
  },
  {
    id: 'smishing',
    numberIndex: 2,
    title: 'Smishing (SMS Phishing)',
    categoryTag: 'MESSAGES',
    categoryDisplay: 'SMS Deceptions',
    whatItIs: 'Phishing attacks specifically conducted via Short Message Service (SMS) text messages containing deceptive links or phone numbers.',
    howItStarts: [
      'Bulk SMS sent with spoofed or obscure sender headers',
      'Delivery parcel exception alerts',
      'Utility disconnection threat texts',
      'Lottery / reward credit alerts'
    ],
    attackerMaySay: [
      '"Dear Consumer, your electricity power will be disconnected at 9:30 PM tonight because previous bill was not updated. Call 7019284920 immediately."',
      '"Your package delivery failed due to incorrect address. Pay ₹5 redelivery fee at indiapost-track.xyz."'
    ],
    redFlags: [
      'Sent from regular 10-digit private mobile numbers instead of registered 6-character institutional alphanumeric headers (e.g. AX-HDFCBK)',
      'Shortened URLs (bit.ly, tinyurl) masking malicious destinations',
      'Grammar mistakes and artificial urgency'
    ],
    whatTheyMayAskFor: [
      'Call to an unverified private number',
      'Clicking a web link to enter payment credentials',
      'Downloading an Android APK application'
    ],
    progressFlow: [
      { label: 'Urgent SMS Received', subtext: 'Power cut / Parcel alert' },
      { label: 'Victim Panic', subtext: 'Calls number or clicks link' },
      { label: 'Attacker Directions', subtext: 'Requests nominal fee' },
      { label: 'Malicious Gateway / App', subtext: 'Captures OTP/Credentials' },
      { label: 'Unauthorized Debit', subtext: 'Funds siphoned' }
    ],
    whatToDo: [
      'Inspect the sender header carefully (legitimate banks use official alphanumeric headers).',
      'Never dial phone numbers embedded in suspicious SMS texts.',
      'Verify utility bills directly on official state DISCOM or Bharat BillPay apps.',
      'Take a screenshot of the SMS showing the sender number/header.',
      'Block the sender on your mobile handset.'
    ],
    relatedTool: {
      tabId: 'payment_msg',
      label: 'Check Payment Request SMS'
    }
  },
  {
    id: 'vishing',
    numberIndex: 3,
    title: 'Vishing (Voice Call Phishing)',
    categoryTag: 'CALLS',
    categoryDisplay: 'Deceptive Phone Calls',
    whatItIs: 'Voice phishing where fraudsters call pretending to be bank officials, telecom providers, police officers, or customer care to manipulate victims over live phone conversations.',
    howItStarts: [
      'Incoming phone call from an unknown cellular number or spoofed caller ID',
      'Automated interactive voice response (IVR) call claiming your card was charged'
    ],
    attackerMaySay: [
      '"I am calling from SBI Fraud Prevention Unit. We noticed an unauthorized debit of ₹25,000 on your card. To block it, please tell me the 6-digit cancellation OTP sent to your phone."',
      '"Your SIM card is expiring in 2 hours due to 5G upgrade requirement. Press 1 to connect to customer support."'
    ],
    redFlags: [
      'Caller demanding OTPs, passwords, or full card numbers under the pretext of "helping you cancel a fraud"',
      'Aggressive or authoritative tone pressuring for instant decisions',
      'Refusal to allow you to disconnect and call back on the bank toll-free number'
    ],
    whatTheyMayAskFor: [
      'One-Time Passwords (OTPs)',
      'Debit card PIN or CVV',
      'Date of birth, Aadhaar number, or mother\'s maiden name',
      'Permission to screen-share'
    ],
    progressFlow: [
      { label: 'Unsolicited Call', subtext: 'Impersonates bank/telecom' },
      { label: 'Fabricated Emergency', subtext: 'Card hacked / SIM blocked' },
      { label: 'Psychological Pressure', subtext: 'Demands quick verification' },
      { label: 'OTP Extracted', subtext: 'Victim reads out OTP' },
      { label: 'Account Debited', subtext: 'Unauthorized transfer completed' }
    ],
    whatToDo: [
      'Disconnect the call immediately. No bank employee will ever ask for your OTP or PIN.',
      'Dial your bank official fraud helpline printed on the back of your debit card.',
      'Save the caller phone number, call duration, and exact timestamp.',
      'Report the number on the Chakshu portal (sancharsaathi.gov.in).'
    ],
    relatedTool: {
      tabId: 'call_story',
      label: 'Analyze Call Story'
    }
  },
  {
    id: 'upi-fraud',
    numberIndex: 4,
    title: 'UPI / Instant Payment Fraud',
    categoryTag: 'PAYMENTS',
    categoryDisplay: 'Instant Payment Tricks',
    whatItIs: 'Deceptions designed to manipulate victims into authorising UPI debits while misleading them into believing they are receiving money or verifying transactions.',
    howItStarts: [
      'Unsolicited payment collect request received on PhonePe / Google Pay / Paytm',
      'Marketplace buyer sending a collect request claiming it is an advance deposit',
      'Utility verification trick requiring ₹10/₹15 payment'
    ],
    attackerMaySay: [
      '"I have sent ₹10,000 for your sofa on OLX. Accept the payment on your Google Pay screen and enter your UPI PIN to claim credit."',
      '"Pay a ₹15 verification fee to update your electricity meter bill."'
    ],
    redFlags: [
      'Being asked to enter your UPI PIN to "receive" money (Entering PIN ALWAYS DEBITS money)',
      'Collect requests disguised with transaction notes like "REFUND_CREDIT" or "DEPOSIT"',
      'Unfamiliar Virtual Payment Addresses (VPAs)'
    ],
    whatTheyMayAskFor: [
      'Entering your 4 or 6-digit UPI PIN',
      'Approving a "Collect" or "Mandate" request',
      'Sharing transaction screenshot'
    ],
    progressFlow: [
      { label: 'Deceptive Offer / Request', subtext: 'OLX buyer / Utility update' },
      { label: 'Collect Request Sent', subtext: 'Labeled as refund/credit' },
      { label: 'PIN Request', subtext: 'Victim told PIN needed to receive' },
      { label: 'UPI PIN Entered', subtext: 'Immediate bank debit occurs' },
      { label: 'Scammer Disappears', subtext: 'Calls blocked by suspect' }
    ],
    whatToDo: [
      'Decline all unexpected UPI collect requests immediately.',
      'Remember: You NEVER enter your UPI PIN to receive money or refunds.',
      'If debited, note down the 12-digit UTR from your bank SMS and dial 1930 within the Golden Hour.',
      'Create your structured NIRNAY incident dossier.'
    ],
    relatedTool: {
      tabId: 'upi',
      label: 'Check a UPI ID'
    }
  },
  {
    id: 'qr-scams',
    numberIndex: 5,
    title: 'QR Code / Payment Request Scams',
    categoryTag: 'PAYMENTS',
    categoryDisplay: 'Barcode & QR Deceptions',
    whatItIs: 'Scams where victims are sent a QR code image and instructed to scan it to receive payments, cashbacks, or refunds, which actually initiates a transfer out of their account.',
    howItStarts: [
      'Buyer on classified platforms (OLX, Facebook Marketplace) sends a QR code image over WhatsApp',
      'Prize or cashback scratch card sent with a QR barcode'
    ],
    attackerMaySay: [
      '"My payment is not going through directly to your mobile number. Scan this merchant QR code and enter your PIN, the money will be credited into your account instantly."'
    ],
    redFlags: [
      'Any claim that scanning a QR code is required to receive money',
      'QR code text displaying a debit amount on the UPI app confirmation screen',
      'Refusal to do a standard IMPS or NEFT bank transfer'
    ],
    whatTheyMayAskFor: [
      'Scanning the QR code using Google Pay / PhonePe / Paytm camera',
      'Entering UPI PIN on the resulting payment screen'
    ],
    progressFlow: [
      { label: 'Deceptive Buyer Contact', subtext: 'Agrees to buy item instantly' },
      { label: 'QR Image Sent', subtext: 'Sent via WhatsApp / Email' },
      { label: 'Scan Instruction', subtext: 'Victim told scanning receives cash' },
      { label: 'UPI PIN Entered', subtext: 'Victim bank account debited' },
      { label: 'Second Attempt', subtext: 'Scammer claims "glitch, scan again"' }
    ],
    whatToDo: [
      'Do not scan any QR codes sent by buyers or unverified callers.',
      'Remember: Scanning a QR code only ever DEBITS funds from your bank.',
      'Preserve the QR code image and chat transcript for your complaint dossier.'
    ],
    relatedTool: {
      tabId: 'qr',
      label: 'Check a QR Code'
    }
  },
  {
    id: 'fake-customer-care',
    numberIndex: 6,
    title: 'Fake Customer Care & SEO Poisoning',
    categoryTag: 'CALLS',
    categoryDisplay: 'Search Engine Spoofing',
    whatItIs: 'Fraudsters manipulate search engine results (Google, Bing) and Google Maps listings with their own fraudulent phone numbers, trapping victims seeking genuine customer support.',
    howItStarts: [
      'Victim searches Google for customer service numbers for airlines, courier delivery (BlueDart/DTDC), or payment apps',
      'Victim dials the top phone number displayed in search snippets'
    ],
    attackerMaySay: [
      '"Thank you for calling airline support. Your refund of ₹4,200 is approved. To transfer it back to your bank, please accept the collect request sent on your PhonePe."'
    ],
    redFlags: [
      'Top search result showing a personal 10-digit mobile number (+91 7xxx / 8xxx / 9xxx) instead of institutional 1800 toll-free numbers',
      'Representative asking you to install AnyDesk/QuickSupport or accept a UPI collect request',
      'Agent demanding a registration or processing fee to release a refund'
    ],
    whatTheyMayAskFor: [
      'Installing remote screen sharing applications',
      'Approving collect requests',
      'Sharing banking passwords or OTPs'
    ],
    progressFlow: [
      { label: 'Search Query Made', subtext: 'Victim searches helpline' },
      { label: 'Manipulated Number', subtext: 'Victim dials fake listing' },
      { label: 'Impersonated Helpdesk', subtext: 'Agent promises instant resolution' },
      { label: 'Deceptive Step', subtext: 'Collect request or remote app' },
      { label: 'Financial Loss', subtext: 'Unauthorized account withdrawal' }
    ],
    whatToDo: [
      'Obtain contact information only from within the official verified mobile app or physical invoice.',
      'Never dial unverified numbers found on search engine snippets.',
      'Report the fraudulent listing to Google Search / Google Maps.'
    ],
    relatedTool: {
      tabId: 'phone',
      label: 'Check a Phone Number'
    }
  },
  {
    id: 'kyc-blocking',
    numberIndex: 7,
    title: 'KYC & Account Blocking Scams',
    categoryTag: 'ACCOUNTS',
    categoryDisplay: 'Account Suspension Threats',
    whatItIs: 'Coercive social engineering where scammers threaten that your bank account, credit card, or SIM card will be deactivated unless you immediately complete unverified KYC verification.',
    howItStarts: [
      'SMS claiming: "Dear customer your SBI account KYC has expired. Your account will be blocked in 24 hours."',
      'Automated IVR call stating your SIM card KYC is incomplete'
    ],
    attackerMaySay: [
      '"Sir, this is Bank KYC Verification Desk. Under RBI guidelines, your account is suspended. To reactivate online, download the verification APK and submit your Aadhaar and OTP."'
    ],
    redFlags: [
      'Demanding KYC updates through unofficial third-party links or WhatsApp',
      'Asking you to download an APK file outside the official Google Play Store / Apple App Store',
      'Threatening immediate 24-hour account suspension'
    ],
    whatTheyMayAskFor: [
      'Aadhaar number and Aadhaar OTP',
      'Netbanking login credentials and debit card details',
      'Installing screen-sharing software'
    ],
    progressFlow: [
      { label: 'Suspension Threat', subtext: 'SMS claiming 24hr block' },
      { label: 'Victim Anxiety', subtext: 'Victim clicks link to prevent block' },
      { label: 'Fake KYC Form', subtext: 'Asks for card details and OTP' },
      { label: 'Credential Theft', subtext: 'Attacker logs into netbanking' },
      { label: 'Fund Exfiltration', subtext: 'Beneficiary transfer completed' }
    ],
    whatToDo: [
      'Never submit KYC details via links received on SMS or WhatsApp.',
      'KYC re-verification is done exclusively through your official bank branch or official netbanking portal.',
      'If you submitted card details, immediately block your debit card via your bank hotline.'
    ],
    relatedTool: {
      tabId: 'url',
      label: 'Check Website / URL'
    }
  },
  {
    id: 'investment-trading',
    numberIndex: 8,
    title: 'Investment & Stock Trading Scams',
    categoryTag: 'INVESTMENT',
    categoryDisplay: 'High-Return Investment Fraud',
    whatItIs: 'Fraudulent investment schemes promising guaranteed high returns, institutional IPO allocations, or AI-powered algorithmic crypto trading through unverified apps and VIP groups.',
    howItStarts: [
      'Invited to WhatsApp or Telegram "VIP Stock Market Advisory" groups',
      'Social media ads featuring fake celebrity endorsements (deepfakes or manipulated videos)',
      'Direct message from an "Institutional Trading Analyst"'
    ],
    attackerMaySay: [
      '"Our proprietary institutional algorithm guarantees 25% weekly profits on pre-IPO allotments. Deposit ₹50,000 to our institutional custody account to start."'
    ],
    redFlags: [
      'Guarantees of zero-risk, high-return profits',
      'Instructing transfers into random individual savings or current accounts rather than SEBI-registered broker accounts',
      'Fake trading dashboards showing massive fake profits that cannot be withdrawn without paying "processing fees" or "capital gains tax"'
    ],
    whatTheyMayAskFor: [
      'Bank transfers to rotating individual accounts',
      'Installing unofficial trading APKs or web apps',
      'Additional "tax" or "clearance fees" when attempting withdrawal'
    ],
    progressFlow: [
      { label: 'VIP Group Invite', subtext: 'WhatsApp / Telegram channel' },
      { label: 'Small Initial Profit', subtext: 'Fake balance shown on portal' },
      { label: 'Major Deposit', subtext: 'Victim invests life savings' },
      { label: 'Withdrawal Blocked', subtext: 'Attacker demands 30% tax fee' },
      { label: 'Group Deleted', subtext: 'Scammers vanish with funds' }
    ],
    whatToDo: [
      'Verify that the investment entity is registered with SEBI (sebi.gov.in) before sending funds.',
      'Never transfer investment capital into personal individual bank accounts.',
      'Do not pay additional fees to withdraw your money — this is a secondary extortion layer.'
    ],
    relatedTool: {
      tabId: 'upi',
      label: 'Check a UPI ID'
    }
  },
  {
    id: 'job-task',
    numberIndex: 9,
    title: 'Job & Part-Time Task Scams',
    categoryTag: 'INVESTMENT',
    categoryDisplay: 'Task-Based Schemes',
    whatItIs: 'Victims are lured with easy part-time work (e.g. liking YouTube videos, rating hotels on Google, writing movie reviews) and tricked into paying prepaid "VIP deposits" to unlock earnings.',
    howItStarts: [
      'Unsolicited WhatsApp or SMS from international numbers (+62, +84, +234, etc.) offering ₹2,000–₹5,000 daily for remote work',
      'Recruitment invitations on LinkedIn or Instagram'
    ],
    attackerMaySay: [
      '"Congratulations! You earned ₹450 for liking 3 YouTube videos. To unlock Task #4 and earn ₹12,000, please deposit a refundable ₹3,000 to the merchant wallet."'
    ],
    redFlags: [
      'Legitimate employers never ask employees to pay money to receive tasks or salary',
      'Small payouts (₹150 - ₹500) provided early to establish false trust',
      'Being moved into structured Telegram groups with fake "colleagues" posting fake withdrawal receipts'
    ],
    whatTheyMayAskFor: [
      'UPI / IMPS deposits to various individual accounts',
      'Personal identity proofs',
      'Prepaid recharge vouchers'
    ],
    progressFlow: [
      { label: 'Job Offer SMS', subtext: 'Offers easy daily payouts' },
      { label: 'Trial Tasks', subtext: 'Small ₹300 reward credited' },
      { label: 'Prepaid VIP Task', subtext: 'Victim asked to deposit ₹5,000' },
      { label: 'Escalating Demands', subtext: 'Demands ₹50k to release funds' },
      { label: 'Total Loss', subtext: 'Communication severed' }
    ],
    whatToDo: [
      'Cease all payments immediately. The money in the dashboard is fictitious.',
      'Export the complete Telegram/WhatsApp chat history without media.',
      'Report all beneficiary UPI handles and account numbers on 1930 and NCRP.'
    ],
    relatedTool: {
      tabId: 'call_story',
      label: 'Analyze Call Story'
    }
  },
  {
    id: 'card-fraud',
    numberIndex: 10,
    title: 'Debit / Credit Card Fraud',
    categoryTag: 'PAYMENTS',
    categoryDisplay: 'Card & ATM Exploits',
    whatItIs: 'Unauthorized transactions executed using compromised debit or credit card details (card number, expiration date, CVV, and intercepted OTPs).',
    howItStarts: [
      'Card skimming at compromised ATMs or point-of-sale (POS) terminals',
      'Card details entered on unencrypted or spoofed shopping websites',
      'Data breaches from online merchants'
    ],
    attackerMaySay: [
      '"Your credit card reward points worth ₹8,500 will expire tonight. Redeem them to cash instantly by entering your 16-digit card number and CVV."'
    ],
    redFlags: [
      'SMS alerts for transactions you did not initiate (especially international currency debits)',
      'Websites asking for ATM PIN or card CVV during reward point redemption',
      'Loose or suspicious hardware attachments on ATM card insertion slots'
    ],
    whatTheyMayAskFor: [
      '16-digit Card Number, Expiry Date, CVV',
      'ATM PIN',
      'Transaction OTP'
    ],
    progressFlow: [
      { label: 'Card Compromised', subtext: 'Skimming / Phishing leak' },
      { label: 'Test Transaction', subtext: 'Small international charge' },
      { label: 'Major Unauthorized Debit', subtext: 'Card charged for high amount' },
      { label: 'Bank Alert SMS', subtext: 'Victim notified of debit' }
    ],
    whatToDo: [
      'Instantly block your debit/credit card using your banking mobile app (Card Controls → Switch OFF International / Online transactions).',
      'Notify your bank fraud desk within the 3-day RBI zero-liability notification window.',
      'File a formal chargeback dispute letter with your bank branch manager.'
    ],
    relatedTool: {
      tabId: 'sms',
      label: 'Parse Bank SMS'
    }
  },
  {
    id: 'sim-swap',
    numberIndex: 11,
    title: 'SIM Swap Scam',
    categoryTag: 'ACCOUNTS',
    categoryDisplay: 'Cellular Hijacking',
    whatItIs: 'Fraudsters fraudulently obtain a duplicate SIM card for your mobile phone number from telecom providers, cutting off your cellular network and intercepting your banking OTPs.',
    howItStarts: [
      'Attacker gathers your personal identity details (Aadhaar, DOB, address) through previous data breaches or phishing',
      'Attacker approaches telecom service store with forged documents claiming lost SIM'
    ],
    attackerMaySay: [
      '"This is Telecom Support. Your SIM card is being upgraded to 5G. You will receive an SMS containing a 20-digit number. Please reply with 1 to confirm."'
    ],
    redFlags: [
      'Sudden and prolonged loss of cellular network reception ("No Service" / "SOS Only") in areas with known good coverage',
      'Unsolicited SMS alerts from telecom provider acknowledging a SIM upgrade or duplicate SIM request',
      'Calls from people claiming to be telecom officers urging you to share SMS confirmation codes'
    ],
    whatTheyMayAskFor: [
      'Forwarding an SMS to telecom shortcodes (e.g. SIM <20-digit number> to 121)',
      'Sharing an identity verification code'
    ],
    progressFlow: [
      { label: 'Target Selected', subtext: 'Attacker obtains victim details' },
      { label: 'Duplicate SIM Issued', subtext: 'Telecom activates new SIM' },
      { label: 'Victim Network Drops', subtext: 'Original SIM deactivated' },
      { label: 'Banking OTP Intercepted', subtext: 'Attacker resets passwords' },
      { label: 'Funds Drained', subtext: 'Netbanking accounts cleared' }
    ],
    whatToDo: [
      'If your mobile phone loses cellular signal unexpectedly, contact your telecom operator immediately from another phone.',
      'Inquire whether a duplicate SIM has been issued.',
      'If confirmed, immediately contact all your banks to freeze netbanking access and card channels.'
    ],
    relatedTool: {
      tabId: 'phone',
      label: 'Check a Phone Number'
    }
  },
  {
    id: 'impersonation-identity',
    numberIndex: 12,
    title: 'Impersonation & Digital Arrest',
    categoryTag: 'IDENTITY',
    categoryDisplay: 'Law Enforcement Coercion',
    whatItIs: 'Severe psychological coercion where fraudsters pose as police officers, CBI agents, ED, or customs officials via Skype/WhatsApp video calls, falsely claiming illegal parcels or warrants to extort money into "government safety accounts".',
    howItStarts: [
      'Automated call claiming: "FedEx parcel containing 5 passports and synthetic drugs addressed in your name has been seized by customs."',
      'Transferred to a fake police officer on WhatsApp/Skype in uniform against a fake police backdrop'
    ],
    attackerMaySay: [
      '"You are under digital arrest by Mumbai Police and CBI. Do not disconnect this video call. To prove your innocence, transfer all your liquid savings to the Supreme Court verification escrow account."'
    ],
    redFlags: [
      'There is NO legal concept of "Digital Arrest" under Indian law (confirmed by Ministry of Home Affairs / MHA)',
      'Police or judiciary will NEVER demand money transfers via Skype/WhatsApp to clear your name',
      'Pressuring you to stay on continuous video call in isolation and not inform family'
    ],
    whatTheyMayAskFor: [
      'RTGS / IMPS fund transfers to private individual or current accounts',
      'Sharing bank account statements and financial asset lists',
      'Signing fake bail bond affidavits'
    ],
    progressFlow: [
      { label: 'Parcel / Warrant Threat', subtext: 'Fake FedEx / Customs call' },
      { label: 'Video Call Coercion', subtext: 'Fake police station background' },
      { label: 'Isolation & Intimidation', subtext: 'Threat of immediate jail' },
      { label: 'Asset Disclosure', subtext: 'Victim lists all bank funds' },
      { label: 'Escrow Transfer', subtext: 'Victim transfers life savings' }
    ],
    whatToDo: [
      'Disconnect the video call immediately. Indian law enforcement never investigates via WhatsApp video calls.',
      'Do not transfer any money under any circumstance.',
      'Dial 1930 immediately or visit your local police cyber cell in person.'
    ],
    relatedTool: {
      tabId: 'call_story',
      label: 'Analyze Call Story'
    }
  },
  {
    id: 'remote-access',
    numberIndex: 13,
    title: 'Remote Access & Screen Sharing Scams',
    categoryTag: 'ACCOUNTS',
    categoryDisplay: 'Device Takeover',
    whatItIs: 'Scammers instruct victims to install remote desktop software (e.g. AnyDesk, TeamViewer, RustDesk, QuickSupport) to view their screen, steal OTPs, and control their mobile phone.',
    howItStarts: [
      'Fake customer care or banking support representative claims they need to "diagnose a technical error" or "approve refund"',
      'Electricity bill updater instructs you to install an application'
    ],
    attackerMaySay: [
      '"Sir, please download QuickSupport from Play Store and give me the 9-digit address code so our technical server can remotely update your banking certificate."'
    ],
    redFlags: [
      'Anyone asking you to install AnyDesk, TeamViewer, or QuickSupport to fix a banking or payment issue',
      'Asking you to read out a 9 or 10-digit remote connection code',
      'Instructing you to open your mobile banking app while the screen-sharing session is active'
    ],
    whatTheyMayAskFor: [
      'Installing remote screen sharing tools',
      'Granting accessibility and screen-recording permissions',
      'Logging into netbanking while screen is visible'
    ],
    progressFlow: [
      { label: 'Tech Support Caller', subtext: 'Claims technical glitch' },
      { label: 'App Install Instruction', subtext: 'AnyDesk / QuickSupport' },
      { label: 'Access Code Shared', subtext: 'Attacker views live screen' },
      { label: 'Victim Opens Bank App', subtext: 'Attacker records PIN / OTP' },
      { label: 'Device Controlled', subtext: 'Unauthorized transfers executed' }
    ],
    whatToDo: [
      'Uninstall AnyDesk, TeamViewer, or any unverified APK from your phone immediately.',
      'Turn on Airplane mode or turn off Wi-Fi and mobile data.',
      'Using another phone, call your bank to block your netbanking and debit cards.',
      'Perform a factory reset if malicious APKs were installed.'
    ],
    relatedTool: {
      tabId: 'url',
      label: 'Check Website / URL'
    }
  },
  {
    id: 'fake-refunds',
    numberIndex: 14,
    title: 'Fake Refund & Overpayment Scams',
    categoryTag: 'PAYMENTS',
    categoryDisplay: 'Reversal & Cashback Tricks',
    whatItIs: 'Scammers claim you are owed a refund, overpaid for a product, or won a cashback reward, and manipulate payment mechanics to debit your account instead.',
    howItStarts: [
      'Notification on WhatsApp or SMS claiming flight cancellation refund, IRCTC ticket refund, or merchant overcharge refund',
      'Marketplace buyer claims they accidentally sent ₹50,000 instead of ₹5,000'
    ],
    attackerMaySay: [
      '"Sir, I accidentally sent ₹50,000 to your Google Pay instead of ₹5,000. Please check your SMS. Kindly refund the remaining ₹45,000 immediately, my mother is in hospital."'
    ],
    redFlags: [
      'Showing a fake or manipulated SMS that looks like a bank credit alert (check your actual bank balance in app, not just incoming SMS)',
      'Claiming that entering your PIN is required to reverse an overcharge',
      'Emotional manipulation and artificial panic'
    ],
    whatTheyMayAskFor: [
      'Sending money back before confirming actual cleared balance',
      'Approving collect requests labeled as refund credits'
    ],
    progressFlow: [
      { label: 'Refund / Overpay Claim', subtext: 'Claims accidental deposit' },
      { label: 'Fake Proof Provided', subtext: 'Manipulated screenshot/SMS' },
      { label: 'Emotional Appeal', subtext: 'Urges instant return of money' },
      { label: 'Victim Sends Money', subtext: 'Transfers real funds from balance' },
      { label: 'Reality Realized', subtext: 'Original payment never existed' }
    ],
    whatToDo: [
      'Always log into your official mobile banking app to verify cleared balance — never trust SMS alerts alone.',
      'Remember: You NEVER need to enter your PIN or send a payment to receive a refund.',
      'Report the transaction details immediately if money was transferred.'
    ],
    relatedTool: {
      tabId: 'payment_msg',
      label: 'Check Payment Request'
    }
  },
  {
    id: 'courier-parcel',
    numberIndex: 15,
    title: 'Courier & Delivery Parcel Scams',
    categoryTag: 'SHOPPING',
    categoryDisplay: 'Logistics Phishing',
    whatItIs: 'Phishing texts and calls claiming an India Post, BlueDart, or DHL parcel cannot be delivered without updating an address or paying a nominal ₹5 redelivery fee.',
    howItStarts: [
      'SMS text: "India Post: Your package has arrived at the facility but cannot be delivered due to missing house number. Update address at link."'
    ],
    attackerMaySay: [
      '"Your shipment is held at the local hub. Pay ₹10 verification charge at this link to reschedule delivery for today."'
    ],
    redFlags: [
      'Unofficial URLs (e.g. indiapost-track-address.top instead of indiapost.gov.in)',
      'Requiring full debit card details (number, expiry, CVV) for a ₹5 charge',
      'OTP sent to phone specifies a high amount (e.g. ₹25,000) rather than ₹5'
    ],
    whatTheyMayAskFor: [
      'Debit / credit card credentials',
      'Approval of OTP transactions'
    ],
    progressFlow: [
      { label: 'Delivery SMS Received', subtext: 'Address error alert' },
      { label: 'Phishing Link Clicked', subtext: 'Mimics courier tracking page' },
      { label: 'Nominal Fee Prompt', subtext: 'Asks for ₹5 payment' },
      { label: 'Card Data Captured', subtext: 'Attacker initiates high debit' },
      { label: 'High OTP Received', subtext: 'Victim enters OTP without reading' }
    ],
    whatToDo: [
      'Track parcels only by manually entering the tracking number on the official courier portal.',
      'Always read the transaction amount in the bank OTP SMS before typing it.',
      'Block your debit/credit card immediately if credentials were entered on a fake site.'
    ],
    relatedTool: {
      tabId: 'url',
      label: 'Check Website / URL'
    }
  },
  {
    id: 'matrimonial-romance',
    numberIndex: 16,
    title: 'Matrimonial & Romance Scams',
    categoryTag: 'IDENTITY',
    categoryDisplay: 'Relationship Manipulation',
    whatItIs: 'Scammers create attractive profiles on matrimonial sites or social media, build emotional trust over weeks, and then invent emergencies or claim expensive customs gift parcels to extort money.',
    howItStarts: [
      'Attractive match on Jeevansathi, Shaadi.com, BharatMatrimony, or Instagram claiming to be an NRI doctor, pilot, or engineer living abroad'
    ],
    attackerMaySay: [
      '"I sent you gold jewelry and ₹50,000 USD as an engagement gift. The Delhi customs officer is holding the parcel and demands ₹35,000 customs clearance tax. Please pay, I will reimburse you when I arrive tomorrow."'
    ],
    redFlags: [
      'Refusal to meet in person or do live video calls without filters',
      'Claims of lavish overseas gifts held by customs requiring tax deposits into private Indian savings accounts',
      'Sudden financial or medical crisis requiring immediate emergency loans'
    ],
    whatTheyMayAskFor: [
      'Wire transfers and UPI deposits to various accounts',
      'Purchasing gift cards or cryptocurrency'
    ],
    progressFlow: [
      { label: 'Profile Contact', subtext: 'Matrimonial / Instagram' },
      { label: 'Trust Building', subtext: 'Daily emotional communication' },
      { label: 'Overseas Gift Claim', subtext: 'Valuable parcel sent' },
      { label: 'Fake Customs Call', subtext: 'Demands clearance deposit' },
      { label: 'Endless Demands', subtext: 'Demands more fees until cut off' }
    ],
    whatToDo: [
      'Never transfer money to anyone met online whom you have not met in person.',
      'Customs authorities never demand import duty payments into private individual bank accounts.',
      'Preserve all chat transcripts, profile photos, and bank account numbers.'
    ],
    relatedTool: {
      tabId: 'call_story',
      label: 'Analyze Call Story'
    }
  },
  {
    id: 'instant-loan',
    numberIndex: 17,
    title: 'Loan & Instant Credit App Scams',
    categoryTag: 'PAYMENTS',
    categoryDisplay: 'Predatory Lending & Blackmail',
    whatItIs: 'Illegal loan APK apps that offer instant hassle-free credit, siphon the victim\'s contact list and private photos, and then blackmail the victim with morphed photos demanding exorbitant extortion payments.',
    howItStarts: [
      'Ads on social media promoting "Instant ₹50,000 loan without CIBIL or income proof"',
      'Downloading unverified APK files from outside the official Google Play Store'
    ],
    attackerMaySay: [
      '"Your loan of ₹5,000 is approved. Repay ₹9,000 in 7 days or we will send morphed obscene pictures to all your phone contacts and family members."'
    ],
    redFlags: [
      'App demands invasive permissions: Full Contact List, Photo Gallery, Call Logs, Camera',
      'Short 7-day repayment tenures with 100%+ interest rates and deductions',
      'Abusive extortion calls from recovery agents threatening public defamation'
    ],
    whatTheyMayAskFor: [
      'Excessive mobile permissions during APK installation',
      'Repeated extortion payments to unlinked UPI accounts'
    ],
    progressFlow: [
      { label: 'Instant Loan Ad', subtext: 'Promised fast cash approval' },
      { label: 'APK Downloaded', subtext: 'Steals contacts & private gallery' },
      { label: 'Partial Disbursal', subtext: '₹3,000 sent, ₹6,000 demanded' },
      { label: 'Blackmail Threats', subtext: 'Threatens to message contacts' },
      { label: 'Extortion Loop', subtext: 'Demands continue after payment' }
    ],
    whatToDo: [
      'Do not pay additional extortion demands — paying does not stop harassment.',
      'Notify your close contacts that your phone contacts were compromised by a malicious app.',
      'Uninstall the predatory APK application immediately.',
      'File a formal complaint on cybercrime.gov.in and report the lending entity to RBI Sachet portal (sachet.rbi.org.in).'
    ],
    relatedTool: {
      tabId: 'url',
      label: 'Check Website / URL'
    }
  },
  {
    id: 'tech-support',
    numberIndex: 18,
    title: 'Tech Support & Malware Pop-Up Scams',
    categoryTag: 'MESSAGES',
    categoryDisplay: 'Browser Hijacking',
    whatItIs: 'Browser pop-ups that lock your computer screen with loud alarm sounds claiming "Windows/Apple Defender infected by Zeus Virus", instructing you to call a toll-free number.',
    howItStarts: [
      'Accidentally visiting a malicious website or clicking an ad that triggers a full-screen browser lockdown with flashing warnings and audio alerts'
    ],
    attackerMaySay: [
      '"Your computer has been compromised by Trojan spyware. Banking credentials are leaking. Call Microsoft Support at 1800-XXX-XXXX immediately to avoid system format."'
    ],
    redFlags: [
      'Legitimate operating systems (Microsoft Windows, Apple macOS) never display phone numbers on error screens asking you to call support',
      'Demanding hundreds of dollars in gift cards or bank transfers for fake anti-virus cleaning',
      'Demanding remote access to your computer'
    ],
    whatTheyMayAskFor: [
      'Allowing remote access via UltraViewer or AnyDesk',
      'Paying for fake technical support contracts via debit card or gift cards'
    ],
    progressFlow: [
      { label: 'Browser Pop-up', subtext: 'Fake virus alert lock' },
      { label: 'Panicked Call', subtext: 'Victim calls displayed number' },
      { label: 'Remote Access', subtext: 'Scammer shows fake event errors' },
      { label: 'Payment Demanded', subtext: 'Demands ₹15,000 for cleanup' },
      { label: 'Card Debited', subtext: 'Recurring unauthorized billing' }
    ],
    whatToDo: [
      'Simply close the browser tab or press Ctrl + Shift + Esc (Windows) to End Task in Task Manager.',
      'Never call phone numbers displayed on browser error screens.',
      'Run a standard scan using your built-in Windows Security or trusted anti-virus.'
    ],
    relatedTool: {
      tabId: 'url',
      label: 'Check Website / URL'
    }
  },
  {
    id: 'marketplace-olx',
    numberIndex: 19,
    title: 'Marketplace & Classifieds Fraud (OLX)',
    categoryTag: 'SHOPPING',
    categoryDisplay: 'Buyer/Seller Impersonation',
    whatItIs: 'Fraud on classified platforms (OLX, Quikr, Facebook Marketplace) where fake buyers or sellers impersonate army/defense personnel to trick users into sending money.',
    howItStarts: [
      'You list an item for sale (e.g. furniture, bike) and a "buyer" contacts you within minutes agreeing to buy without bargaining',
      'Buyer claims to be an Indian Army / CISF officer posted at an airport base'
    ],
    attackerMaySay: [
      '"I am Subedar Rajesh from Army Cantonment. I have transferred the amount via Army CSD portal. Scan this merchant barcode or approve the ₹1 test collect request on PhonePe to receive it."'
    ],
    redFlags: [
      'Buyer sending forged Army ID cards or uniform photos to establish trust',
      'Buyer claiming army transport will pick up the item after you verify via UPI',
      'Sending a UPI collect request or QR code claiming it is required to receive funds'
    ],
    whatTheyMayAskFor: [
      'Scanning QR codes',
      'Approving collect requests',
      'Paying advance gate pass or shipping deposit fees'
    ],
    progressFlow: [
      { label: 'Item Listed for Sale', subtext: 'Victim posts classified ad' },
      { label: 'Instant Buyer Call', subtext: 'Impersonates Army officer' },
      { label: 'Fake Payment Script', subtext: 'Sends QR code to "receive"' },
      { label: 'UPI PIN Entered', subtext: 'Victim bank balance debited' },
      { label: 'Secondary Scam', subtext: 'Claims transaction error' }
    ],
    whatToDo: [
      'Insist on in-person physical inspection and cash on delivery for classified sales.',
      'Remember: You NEVER scan a QR code or enter your PIN to receive money from a buyer.',
      'Report and block the buyer profile on the marketplace portal.'
    ],
    relatedTool: {
      tabId: 'qr',
      label: 'Check a QR Code'
    }
  },
  {
    id: 'account-takeover',
    numberIndex: 20,
    title: 'Account Takeover (ATO)',
    categoryTag: 'ACCOUNTS',
    categoryDisplay: 'Credentials & Session Hijack',
    whatItIs: 'Unauthorized hijacking of your email, WhatsApp, social media, or banking accounts through stolen session cookies, password credential stuffing, or 2FA bypass.',
    howItStarts: [
      'Reusing the same password across multiple online accounts that was leaked in a public data breach',
      'Friend\'s hacked WhatsApp sends an urgent message: "I sent you a 6-digit code by mistake, send it back quickly"'
    ],
    attackerMaySay: [
      '"Hey bro, I am locked out of my account. I sent my WhatsApp verification code to your number by mistake. Please forward it to me."'
    ],
    redFlags: [
      'Receiving password reset alerts or OTP notifications you did not request',
      'Unexpected logout from your WhatsApp or email sessions',
      'Friends notifying you that your account is sending them investment or loan requests'
    ],
    whatTheyMayAskFor: [
      'Forwarding 6-digit WhatsApp registration codes',
      'Clicking malicious authorization tokens or session cookies'
    ],
    progressFlow: [
      { label: 'Credential / OTP Stolen', subtext: 'Forwarded code or leak' },
      { label: 'Session Hijacked', subtext: 'Attacker logs in from new device' },
      { label: '2FA Changed', subtext: 'Attacker locks original owner out' },
      { label: 'Contacts Targeted', subtext: 'Scammer solicits money from friends' }
    ],
    whatToDo: [
      'Never forward verification SMS codes or WhatsApp registration numbers to anyone.',
      'Enable Two-Step Verification (with a dedicated PIN) on WhatsApp and Google accounts.',
      'If your account is hijacked, notify your friends and follow official account recovery procedures immediately.'
    ],
    relatedTool: {
      tabId: 'phone',
      label: 'Check a Phone Number'
    }
  }
];
