# NIRNAY — Privacy-Preserving Fraud Case Intelligence

> **Core Purpose:**  
> “Nirnay turns scattered evidence, transactions, identifiers, complaint references, and authority responses into one continuously organized, evolving fraud case record.”

Nirnay is a civic fraud case intelligence and evidence organization platform designed to support financial scam victims throughout the entire lifecycle of an incident. It manages everything surrounding a fraud report, sitting before, alongside, and after statutory reporting infrastructure.

---

## 1. The Problem Nirnay Solves

Financial fraud in India (UPI scams, impersonation calls, fake customer care, task fraud, digital arrest coercion) leaves victims dealing with a chaotic, fragmented reporting landscape.

```
       ┌─────────────────────────────────────────────────────────────┐
       │               THE FRAGMENTATION BOTTLENECK                  │
       └─────────────────────────────────────────────────────────────┘
                                      │
              ┌───────────────────────┼──────────────────────┐
              ▼                       ▼                      ▼
      1930 / I4C Helpline     cybercrime.gov.in (NCRP)   Bank Branch
    (Needs exact 12-digit UTR   (Requires structured    (Rejects disputes as
     & recipient VPA within       police narrative &    "customer-authorised"
       the Golden Hour)            formal evidence)      due to OTP/PIN entry)
              ▲                       ▲                      ▲
              │                       │                      │
       ┌──────┴───────────────────────┴──────────────────────┴───────┐
       │                SCATTERED & UNORGANIZED EVIDENCE             │
       │   Screenshots · SMS Alerts · WhatsApp Chats · Phishing APKs │
       └─────────────────────────────────────────────────────────────┘
```

### Key Challenges in the Current Ecosystem:
1. **Scattered Information:** Evidence is dispersed across payment app receipts, SMS debit alerts, chat screenshots, call logs, and bank statements.
2. **Missing Golden Hour Parameters:** Victims calling `1930` often lack the exact 12-digit UTR/RRN, originating IFSC, or beneficiary VPA needed to trigger inter-bank lien freezes before funds are layered.
3. **Information Asymmetry & Premature Dispute Rejections:** Banks frequently close chargeback requests citing *"PIN/OTP was entered"*. Victims lack structured counter-evidence proving social engineering, impersonation, or deception to escalate to the Principal Nodal Officer or the RBI Ombudsman.
4. **Multi-Agency Disconnect:** A single fraud case involves multiple distinct reference numbers (1930 acknowledgement, Bank ticket, NCRP registration, Police station general diary). No single tool maintains continuous continuity across them.

---

## 2. Institutional Role & Ecosystem Boundaries

Nirnay does **not** replace statutory government and regulatory portals:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                  INSTITUTIONAL ECOSYSTEM                                 │
├───────────────────────────────┬──────────────────────────────────────────────────────────┤
│ Official Channel              │ Statutory Authority & Mandate                            │
├───────────────────────────────┼──────────────────────────────────────────────────────────┤
│ 1930 Helpline / I4C           │ Real-time inter-bank lien triggers & account freezes     │
│ cybercrime.gov.in (NCRP)      │ Official statutory complaint filing & Police FIR routing │
│ Home Bank Fraud Cell          │ Transaction recall memo (RRN Recall) & internal dispute  │
│ Police Cyber Cell / Stations  │ Criminal investigation, chargesheet, asset attachment    │
│ RBI CMS Portal                │ Statutory Ombudsman adjudication under 2021 scheme       │
├───────────────────────────────┴──────────────────────────────────────────────────────────┤
│ NIRNAY MANDATE: Continuous case memory, cross-evidence reconciliation, readiness audit,  │
│ response interpretation, and preparation of complete legal-grade case dossiers.          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Platform Capabilities & Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                NIRNAY SYSTEM ARCHITECTURE                                │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  [1. INTAKE & EXTRACTION]    [2. RECONCILIATION]          [3. READINESS & SCORING]       │
│  • Natural Language Heuristics• Cross-Document Diffing    • 10-Point Readiness Engine    │
│  • Multi-Evidence Ingestion  • Conflict Identification    • Golden Hour Loss Timer       │
│  • PII Masking & Isolation   • User Resolution Ledger     • Parameter Validation         │
│                                                                                          │
│  [4. RESPONSE INTERPRETER]   [5. ESCALATION LADDER]       [6. FACTUAL TIMELINE]          │
│  • 4-Part Response Breakdown • Tier 1: Branch Dispute     • Provenance Source Labels:    │
│  • Claim vs Case Comparison  • Tier 2: Grievance Officer    - USER REPORTED              │
│  • Counter-Evidence Mapping  • Tier 3: Principal Nodal      - DOCUMENT EXTRACTED         │
│                              • Tier 4: RBI Ombudsman CMS    - USER CONFIRMED             │
│                                                             - EXTERNAL RESPONSE          │
│                                                                                          │
│  [7. CAMPAIGN CORRELATION]   [8. MINI-TOOLKIT]            [9. CASE DOSSIER EXPORT]       │
│  • Syndicated Pattern Match  • UPI / Phone / QR Checkers  • Court/Bank-Ready PDF Export  │
│  • Shared Mule Node Linking  • URL / SMS / Threat Parser  • Word-for-Word 1930 Scripts   │
│  • Anonymized Threat Graph   • Add Findings to Active Case• RBI Circular Reference Memo  │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Feature Breakdown

### I. Evidence-First Guided Intake
- **Pattern Classification:** Automatically categorizes modus operandi across UPI manipulation, customer care spoofing, task/job fraud, remote screen sharing, QR deceit, and digital arrest threats.
- **Narrative Extraction Engine:** Extracts entities, claimed organizations (DISCOMs, airlines, customs, couriers), monetary demands, and urgency triggers directly from plain-language user descriptions.
- **Structured Banking Parameters:** Validates 12-digit UTR/RRN numbers, bank identifiers, sender account masking, and beneficiary handles.
- **Jurisdictional Mapping:** Standardized Indian State and City dropdown selectors ensure geographical accuracy for police routing.

### II. Cross-Document Evidence Reconciliation
- **Automated Parameter Diffing:** Reconciles data extracted from payment app screenshots, bank debit SMS notifications, and formal account statements.
- **Conflict Identification:** Flags discrepancies (e.g. amount mismatch between payment screenshot and bank debit alert).
- **Resolution Ledger:** Allows the citizen to confirm the authoritative value with audit notes, updating the case timeline.

### III. 10-Point Case Readiness Engine
Calculates dynamic percentage readiness before external filing:
1. Documented Disputed Monetary Loss (INR)
2. Validated 12-Digit Banking UTR / RRN
3. Originating / Debiting Bank Identifier
4. Beneficiary UPI ID or Destination Account
5. Primary Visual Receipt Proof (Screenshot / PDF)
6. Communication Record (WhatsApp / SMS / Call Transcript)
7. Suspect Contact or Phishing URL Artifact
8. Structured Narrative Statement
9. Home Bank Formal Complaint Reference
10. Official Statutory Reference (1930 Helpline / NCRP Acknowledgement)

### IV. Institutional Response Interpreter & Grievance Ladder
When a bank or authority responds (e.g. rejecting a dispute citing PIN entry), Nirnay generates an automated 4-part breakdown:
1. **What They Said:** Plain-language extraction of the institution's formal decision and stated reason.
2. **What This Relates To:** Verification of the exact amount, UTR, and beneficiary cited in the response against case records.
3. **What Case Record Contains:** Highlights counter-evidence already present in the dossier (e.g. proof of social engineering, fake APK download logs, impersonation chat transcripts).
4. **Recommended Next Action:** Contextual guidance on moving to the next statutory escalation tier under RBI regulations.

#### 4-Tier Banking Grievance Escalation Ladder:
- **Tier 1 — Bank Branch & Fraud Cell:** Initial dispute filing demanding an RRN recall memo to the beneficiary bank node.
- **Tier 2 — Bank Internal Grievance Desk:** Formal complaint quoting RBI Zero-Liability Circular (*DBR.No.Leg.BC.78/09.07.005/2017-18*).
- **Tier 3 — Principal Nodal Officer (PNO):** State/zonal level appellate review for unaddressed or rejected disputes.
- **Tier 4 — RBI Banking Ombudsman (CMS Portal):** Statutory independent adjudication on `cms.rbi.org.in` upon completion of the 30-day window or receipt of a formal rejection notice.

### V. Factual Timeline with Provenance Tracking
Maintains a verifiable chronological sequence of events where every item is tagged with strict source provenance:
- `[USER REPORTED]` — Statements provided directly by the complainant.
- `[DOCUMENT EXTRACTED]` — OCR and metadata parsed from screenshots, statements, or chats.
- `[USER CONFIRMED]` — Discrepancies reconciled and confirmed by the victim.
- `[EXTERNAL RESPONSE]` — Formal acknowledgements, tickets, or decisions from banks or 1930.

### VI. Syndicated Fraud Network & Campaign Intelligence
- Matches suspect identifiers (UPI handles, caller numbers, phishing URLs) against known patterns in the Nirnay intelligence database.
- Identifies organized fraud campaigns (e.g. utility bill disconnection rings, Google SEO support spoofing, Telegram task networks) to provide victims with collective context.

### VII. Nirnay Mini-Intelligence Toolkit
Pre-incident and post-incident verification utilities:
- **UPI VPA Check:** Evaluates risk signals in beneficiary virtual payment addresses.
- **Phone Caller Check:** Evaluates VOIP patterns, telemarketing prefixes, and reported impersonation signals.
- **Phishing URL Inspector:** Deconstructs deceptive top-level domains, APK download links, and spoofed bank logins.
- **UPI Collect Request Analyzer:** Explains the mechanics of debit collect requests disguised as refunds.
- **Before You Pay Evaluator:** Pre-transaction safety check assessing urgency triggers and unverified handles.
- **QR Code Decompiler:** Validates embedded UPI strings inside QR images.
- **Bank SMS Parser:** Extracts amount, account ending, and UTR from raw SMS alerts.
- **Direct Case Attachment:** Any tool finding can be attached with 1-click into the active case evidence ledger.

### VIII. Public Case Tracking & Multi-Reference Manager
- Allows victims to track resolution progress using their unique Nirnay Case ID (`NRN-2026-XXXXX`) and verified contact details.
- Maintains a unified record of all external reference numbers (1930 / I4C, Bank ticket, NCRP registration, Police station reference) in one centralized view.

### IX. Privacy, Security & Client-Side Isolation
- **Client-Side Data Boundary:** All case details, uploaded evidence files, extracted parameters, and notes are processed locally in the user's browser session.
- **Sensitive Data Masking:** Dynamic PII masking toggles for bank account numbers, UPI handles, and mobile numbers (`SensitiveDataMask`).
- **Zero Third-Party Advertising / Tracking:** High-trust civic architecture designed strictly for citizen data privacy.

---

## 5. Technology Stack

- **Frontend Core:** React 19, TypeScript, Vite 8
- **Styling Architecture:** Tailwind CSS v4, Custom Design Tokens, Responsive Layouts
- **Icons & Visual Language:** Lucide React
- **Document & Export Generation:** jsPDF, HTML2Canvas, DOMPurify
- **State Management & Persistence:** React Context API + Local Storage Isolation
- **Build & CI/CD Pipeline:** TypeScript Compilation (`tsc -b`), GitHub Actions Workflow (`.github/workflows/deploy.yml`)

---

## 6. Local Development & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/harshhjangir/nirnay.git

# 2. Navigate to project root
cd nirnay

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Production Build & Validation
```bash
# Type check and build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The output bundle is generated in the `./dist` directory.

---

## 7. Deployment Configuration

### Automated GitHub Pages CI/CD
This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. Every push to `main` automatically:
1. Checks out the repository.
2. Installs dependencies via `npm ci`.
3. Runs the production build (`npm run build`).
4. Deploys the `./dist` artifact to GitHub Pages.

To enable GitHub Pages in your fork:
1. Go to **Repository Settings** &rarr; **Pages**.
2. Under **Build and deployment &rarr; Source**, select **GitHub Actions**.

---

## 8. Summary of Product Impact

Nirnay bridges the gap between distressed citizens and the formal cybercrime reporting infrastructure:

| Feature | Without Nirnay | With Nirnay |
| :--- | :--- | :--- |
| **Golden Hour Response** | Panic, forgotten UTRs, delayed 1930 calls | Structured 1930 scripts, instant UTR validation |
| **Evidence Organization** | Scattered screenshots, chats, and SMS | Chronological timeline with verified provenance tags |
| **Bank Dispute Handling** | Disorganized complaints rejected on PIN entry | Structured dispute dossier quoting RBI Zero-Liability circulars |
| **Authority Response Handling** | Confusion when bank rejects initial claim | 4-part response breakdown with next-tier escalation guidance |
| **Multi-Agency Tracking** | Disconnected ticket numbers across 4 portals | Unified status record linking 1930, Bank, and NCRP references |

---

## 9. License & Institutional Attribution

Distributed for civic and educational utility in financial cybercrime response and consumer protection intelligence.
