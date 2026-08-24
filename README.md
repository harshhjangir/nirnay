# NIVARAN — Financial Cybercrime First-Response & Case-Preparation Platform

> **Positioning Notice:** NIVARAN is **not** a replacement for official cybercrime reporting infrastructure (1930 Helpline or the National Cyber Crime Reporting Portal cybercrime.gov.in). NIVARAN sits **before and around** official channels to triage incidents during the critical golden hour, isolate compromised devices, standardize transaction evidence, and prepare complete legal case packages.

---

## Key Features

- **Light-First Civic/Fintech Interface:** Clean, high-trust visual language built for distressed citizens (Zero cyberpunk/terminal aesthetics).
- **5-Step Guided Intake Flow:**
  1. *Incident Category* — Plain-language fraud scenarios (UPI fraud, Fake customer care, Telegram tasks, Remote access APKs, QR scams, Digital arrest).
  2. *Describe What Happened* — 2000-character statement with real-time heuristic pattern classification preview.
  3. *Transaction Details* — Disputed amount in ₹, 12-digit UTR/RRN tracking, debited bank selection, beneficiary VPAs.
  4. *Evidence Preservation* — PNG, JPG, PDF receipt upload + quick SMS/WhatsApp chat transcript pasting.
  5. *Review & Declaration* — Verified case overview with direct section editing.
- **Official Generated Case Dossier:**
  - Standardized Case ID generation (`NVR-2026-XXXXX`).
  - 6-Stage Visual Resolution Timeline (*Reported* → *Verified* → *Forwarded* → *Under Investigation* → *Resolution* → *Closed*).
  - One-click Case Summary PDF generator (`jspdf`).
  - Formal RBI Zero-Liability Bank Dispute Notice generator.
  - Word-for-word call scripts for 1930 operators.
- **My NIVARAN Dashboard:** Manage registered cases, track escalation milestones, and view notifications.
- **Public Case Tracking:** Look up status by Case ID + registered mobile without logging in.
- **Emergency Directory & Tools:**
  - Verified 24x7 hotlines and SMS card/UPI blocking formats for major Indian banks.
  - Pre-payment Suspicious Identifier Risk Evaluator.
  - 8 In-depth Fraud Playbooks with 2D attack flow diagrams.
  - Client-side data masking and zero-remote-storage architecture.

---

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Icons:** Lucide React
- **Document Generation:** jsPDF + HTML2Canvas + DOMPurify

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/harshhjangir/nirnay.git

# Navigate to project directory
cd nirnay

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application runs at `http://localhost:5173/`.

---

## Building for Production

```bash
npm run build
```

The compiled static assets will be output to `./dist`.

---

## Deployment

### GitHub Pages (Automated)
This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages upon pushing to `main`.

Enable GitHub Pages in the repository:
1. Navigate to **Settings** → **Pages** on GitHub.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.

### Vercel / Netlify
Deploy directly with zero configuration:
```bash
npx vercel
```
or connect the GitHub repository on [Vercel](https://vercel.com) / [Netlify](https://netlify.com).

---

## Institutional Notice

NIVARAN provides emergency procedural guidance, timeline structuring, and case dossier compilation. It does not replace statutory complaints on [cybercrime.gov.in](https://cybercrime.gov.in) or formal dispute instructions from your bank. All data is processed strictly in your client browser session.
