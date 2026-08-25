import { jsPDF } from 'jspdf';
import { IncidentCase } from '../types';

/**
 * Text sanitization for jsPDF
 * Standard jsPDF fonts (Helvetica) only support WinAnsiEncoding.
 * Replaces Unicode Rupee symbols (₹), non-breaking spaces, smart quotes,
 * and dashes to prevent glyph corruption, corrupted widths, and kerning overlap.
 */
function sanitizeText(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/₹/g, 'INR ')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[•]/g, '-')
    .replace(/\r\n/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

/**
 * Enhanced PDF Case Dossier Generator for NIRNAY
 * Structured, multi-page, non-overlapping institutional document formatted for:
 * - 1930 Helpline / I4C CFCFRMS Nodal Officers
 * - Bank Fraud Cells & Principal Nodal Grievance Desks
 * - Cyber Crime Police Stations (NCRP FIR filing)
 * - RBI Banking Ombudsman (CMS Portal Escalation)
 */
export function generateCasePdf(incident: IncidentCase) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  const bottomMargin = 18;

  let currentPage = 1;
  let y = margin;

  // Draw running header
  const drawRunningHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      // Top Dark Banner (Height: 30mm)
      doc.setFillColor(15, 23, 42); // Slate 900
      doc.rect(0, 0, pageWidth, 30, 'F');

      // Left: Platform Branding
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('NIRNAY', margin, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text('|  PRIVACY-PRESERVING FRAUD CASE INTELLIGENCE', margin + 26, 11);

      doc.setFontSize(7.2);
      doc.setTextColor(203, 213, 225); // Slate 300
      doc.text('STANDARDIZED EVIDENCE DOSSIER (FOR 1930 / NCRP / BANK NODAL ESCALATION)', margin, 19);

      // Right: Case ID and Timestamp (Placed safely on the right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(56, 189, 248); // Sky 400
      doc.text(`CASE ID: ${sanitizeText(incident.caseId)}`, pageWidth - margin, 11, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      const genTime = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      doc.text(`Generated: ${genTime}`, pageWidth - margin, 19, { align: 'right' });

      // Teal Accent Line
      doc.setFillColor(14, 165, 233); // Sky 500
      doc.rect(0, 29, pageWidth, 1.2, 'F');

      y = 35;
    } else {
      // Minimal Header for subsequent pages (Height: 14mm)
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(0, 12, pageWidth, 12);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('NIRNAY FRAUD CASE DOSSIER', margin, 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Case ID: ${sanitizeText(incident.caseId)}`, pageWidth / 2, 8, { align: 'center' });
      doc.text('CONFIDENTIAL & PRIVILEGED', pageWidth - margin, 8, { align: 'right' });

      y = 18;
    }
  };

  // Draw running footer
  const drawRunningFooter = (pageNum: number) => {
    const footerY = pageHeight - 8;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text('NIRNAY Civic Fraud Intelligence Platform. Prepared for statutory submission to 1930 / cybercrime.gov.in / Bank.', margin, footerY);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum}`, pageWidth - margin, footerY, { align: 'right' });
  };

  // Pagination check
  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      drawRunningFooter(currentPage);
      doc.addPage();
      currentPage++;
      drawRunningHeader(false);
    }
  };

  // Section Header Banner
  const drawSectionHeader = (title: string, subtitle?: string) => {
    ensureSpace(12);
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, 6.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizeText(title).toUpperCase(), margin + 3, y + 4.5);

    if (subtitle) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(14, 165, 233);
      doc.text(sanitizeText(subtitle).toUpperCase(), pageWidth - margin - 3, y + 4.5, { align: 'right' });
    }

    y += 9.5;
  };

  // -------------------------------------------------------------
  // RENDER PAGE 1
  // -------------------------------------------------------------
  drawRunningHeader(true);

  // 1. EXECUTIVE SUMMARY - 2x2 DISCRETE BOXED CARDS (ZERO OVERLAP)
  ensureSpace(42);
  const cardW = (contentWidth - 4) / 2; // 89mm
  const cardH = 17;
  const totalAmount = incident.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  // Box 1: Disputed Amount (Top Left)
  const b1X = margin;
  const b1Y = y;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(b1X, b1Y, cardW, cardH, 1, 1, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(b1X, b1Y, cardW, cardH, 1, 1, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL DISPUTED FINANCIAL LOSS', b1X + 3.5, b1Y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(225, 29, 72); // Rose 600
  doc.text(`INR ${totalAmount.toLocaleString('en-IN')}`, b1X + 3.5, b1Y + 12);

  // Box 2: Complainant Details (Top Right)
  const b2X = margin + cardW + 4;
  const b2Y = y;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(b2X, b2Y, cardW, cardH, 1, 1, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(b2X, b2Y, cardW, cardH, 1, 1, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('COMPLAINANT IDENTIFIER & CONTACT', b2X + 3.5, b2Y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const compName = sanitizeText(incident.complainant?.name || 'Citizen Complainant');
  doc.text(compName.length > 25 ? compName.slice(0, 23) + '..' : compName, b2X + 3.5, b2Y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Phone: ${sanitizeText(incident.complainant?.phone || 'N/A')}`, b2X + 3.5, b2Y + 14.5);

  // Box 3: Classification & Risk (Bottom Left)
  const b3X = margin;
  const b3Y = y + cardH + 3;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(b3X, b3Y, cardW, cardH, 1, 1, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(b3X, b3Y, cardW, cardH, 1, 1, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('FRAUD PATTERN & RISK CLASSIFICATION', b3X + 3.5, b3Y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const classStr = sanitizeText(incident.analysis?.likelyType || (incident.category === 'upi_fraud' ? 'UPI Social Engineering' : incident.category.replace('_', ' ').toUpperCase()));
  doc.text(classStr.length > 34 ? classStr.slice(0, 32) + '..' : classStr, b3X + 3.5, b3Y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text(`Risk: ${sanitizeText(incident.analysis?.riskLevel || 'HIGH').toUpperCase()} (Score: ${incident.analysis?.riskScore || 80}/100)`, b3X + 3.5, b3Y + 14.5);

  // Box 4: Jurisdiction & Occurrence Date (Bottom Right)
  const b4X = margin + cardW + 4;
  const b4Y = y + cardH + 3;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(b4X, b4Y, cardW, cardH, 1, 1, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(b4X, b4Y, cardW, cardH, 1, 1, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('JURISDICTION & INCIDENT OCCURRENCE', b4X + 3.5, b4Y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const locStr = `${sanitizeText(incident.complainant?.city || 'Bengaluru')}, ${sanitizeText(incident.complainant?.state || 'Karnataka')}`;
  doc.text(locStr.length > 34 ? locStr.slice(0, 32) + '..' : locStr, b4X + 3.5, b4Y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text(`Occurred: ${sanitizeText(incident.incidentDate || '2026-08-24')} at ${sanitizeText(incident.incidentTime || '10:28 AM')}`, b4X + 3.5, b4Y + 14.5);

  y += cardH * 2 + 7;

  // -------------------------------------------------------------
  // 2. DISPUTED FINANCIAL TRANSACTIONS LEDGER (EXPLICIT TABLE COLUMNS)
  // -------------------------------------------------------------
  drawSectionHeader('1. Disputed Financial Transactions Ledger', 'For 1930 / I4C Lien Triage');

  // Column definitions with absolute X positions and safe widths (Total = 182mm)
  const cols = {
    time: { x: margin + 2, w: 18 },
    bank: { x: margin + 21, w: 38 },
    method: { x: margin + 60, w: 24 },
    amount: { x: margin + 85, w: 26 },
    recipient: { x: margin + 112, w: 38 },
    utr: { x: margin + 151, w: 29 }
  };

  // Table Header
  ensureSpace(12);
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(margin, y, contentWidth, 5.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(255, 255, 255);
  doc.text('TIME', cols.time.x, y + 3.8);
  doc.text('DEBIT BANK & A/C', cols.bank.x, y + 3.8);
  doc.text('METHOD / APP', cols.method.x, y + 3.8);
  doc.text('AMOUNT (INR)', cols.amount.x, y + 3.8);
  doc.text('BENEFICIARY VPA / A/C', cols.recipient.x, y + 3.8);
  doc.text('12-DIGIT UTR / RRN', cols.utr.x, y + 3.8);
  y += 5.5;

  // Table Rows
  incident.transactions.forEach((tx, idx) => {
    ensureSpace(8);
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6.5, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);

    const timeRaw = sanitizeText(tx.timestamp || '10:28 AM');
    const timeDisplay = timeRaw.includes(' ') ? timeRaw.split(' ')[1] : timeRaw;
    doc.text(timeDisplay.slice(0, 10), cols.time.x, y + 4.2);

    const bankDisplay = `${sanitizeText(tx.senderBank || 'HDFC Bank')} (*${sanitizeText(tx.senderAccountMasked || '9104').slice(-4)})`;
    doc.text(bankDisplay.length > 22 ? bankDisplay.slice(0, 20) + '..' : bankDisplay, cols.bank.x, y + 4.2);

    const methodDisplay = `${sanitizeText(tx.paymentMethod || 'UPI')} (${sanitizeText(tx.paymentApp || 'GPay')})`;
    doc.text(methodDisplay.length > 15 ? methodDisplay.slice(0, 13) + '..' : methodDisplay, cols.method.x, y + 4.2);

    // Disputed Amount Highlighted in Red Bold
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72);
    doc.text(`INR ${(tx.amount || 0).toLocaleString('en-IN')}`, cols.amount.x, y + 4.2);

    // Beneficiary VPA
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const recipRaw = sanitizeText(tx.recipientUpiOrAcc || 'N/A');
    doc.text(recipRaw.length > 22 ? recipRaw.slice(0, 20) + '..' : recipRaw, cols.recipient.x, y + 4.2);

    // 12-Digit UTR Highlighted in Cyan Bold
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 165, 233);
    const utrDisplay = sanitizeText(tx.utrNumber || 'Pending');
    doc.text(utrDisplay, cols.utr.x, y + 4.2);

    y += 6.5;
  });

  y += 4;

  // --------------------------------------------  // 3. INCIDENT MODUS OPERANDI & NARRATIVE STATEMENT
  // -------------------------------------------------------------
  drawSectionHeader('2. Incident Modus Operandi & Narrative Statement', 'Verified Narrative');

  ensureSpace(18);
  const narrativeText = sanitizeText(incident.whatHappenedSummary || 'Incident submitted through the Nirnay structured evidence intake workflow.');
  const narrativeLines = doc.splitTextToSize(narrativeText, contentWidth - 6);

  // Background Box for Narrative
  const narrBoxH = narrativeLines.length * 3.8 + 4;
  ensureSpace(narrBoxH);

  doc.setFillColor(250, 250, 250);
  doc.rect(margin, y, contentWidth, narrBoxH, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.rect(margin, y, contentWidth, narrBoxH, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text(narrativeLines, margin + 3, y + 3.8);
  y += narrBoxH + 3.5;

  // Key Extracted Scam Factors Bullet Points
  if (incident.analysis?.reasonFactors && incident.analysis.reasonFactors.length > 0) {
    ensureSpace(incident.analysis.reasonFactors.length * 3.8 + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    doc.text('EXTRACTED SOCIAL ENGINEERING & RISK FACTORS:', margin + 1, y);
    y += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    incident.analysis.reasonFactors.forEach((factor) => {
      ensureSpace(4);
      doc.text(`-  ${sanitizeText(factor)}`, margin + 4, y);
      y += 3.5;
    });
    y += 2.5;
  }

  // -------------------------------------------------------------
  // 4. SUSPECT IDENTIFIERS & FRAUD NODES
  // -------------------------------------------------------------
  if (incident.suspects && incident.suspects.length > 0) {
    drawSectionHeader('3. Suspect Identifiers & Communication Nodes', 'Syndicate Signals');

    incident.suspects.forEach((s) => {
      ensureSpace(8);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(14, 165, 233);
      doc.text(`[${sanitizeText(s.type).toUpperCase()}]`, margin + 3, y + 4.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizeText(s.value), margin + 26, y + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      const matchNote = s.matchingReportsCount && s.matchingReportsCount > 0 ? `Matched in ${s.matchingReportsCount} Nirnay Reports` : 'Direct Evidence';
      doc.text(matchNote, pageWidth - margin - 3, y + 4.2, { align: 'right' });

      y += 7.5;
    });
    y += 2;
  }

  // -------------------------------------------------------------
  // 5. EXTERNAL COMPLAINT REFERENCES & RESPONSE MEMORY
  // -------------------------------------------------------------
  drawSectionHeader('4. External Reference Ledger & Bank Responses', 'Multi-Agency Tracking');

  if (incident.externalReferences && incident.externalReferences.length > 0) {
    incident.externalReferences.forEach((ref) => {
      ensureSpace(8);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6.8, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.rect(margin, y, contentWidth, 6.8, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(15, 23, 42);
      const authName = sanitizeText(ref.authorityName || 'Authority');
      doc.text(authName.length > 30 ? authName.slice(0, 28) + '..' : authName, margin + 3, y + 4.3);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 165, 233);
      doc.text(`Ref: ${sanitizeText(ref.referenceNumber)}`, margin + 65, y + 4.3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Status: ${sanitizeText(ref.statusDisplay)}`, margin + 115, y + 4.3);
      doc.text(sanitizeText(ref.dateSubmitted || 'Logged'), pageWidth - margin - 3, y + 4.3, { align: 'right' });

      y += 7.8;
    });
    y += 1.5;
  }

  // Authority Responses Breakdown
  if (incident.responses && incident.responses.length > 0) {
    incident.responses.forEach((resp) => {
      ensureSpace(22);
      doc.setFillColor(254, 242, 242); // Rose 50
      doc.roundedRect(margin, y, contentWidth, 20, 1, 1, 'F');
      doc.setDrawColor(254, 202, 202);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 20, 1, 1, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(153, 27, 27); // Dark Red
      doc.text(`OFFICIAL RESPONSE: ${sanitizeText(resp.responder).toUpperCase()} (${sanitizeText(resp.date)})`, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Decision: ${sanitizeText(resp.decision)}`, margin + 3, y + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const respSummary = sanitizeText(resp.whatTheySaid || resp.reason || '');
      const respLines = doc.splitTextToSize(respSummary, contentWidth - 8);
      doc.text(respLines.slice(0, 2), margin + 3, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(2, 132, 199);
      const nextStep = sanitizeText(resp.potentialNextAction || 'Escalate to Principal Nodal Officer / RBI CMS Portal');
      doc.text(`Next Legal Step: ${nextStep.length > 95 ? nextStep.slice(0, 93) + '..' : nextStep}`, margin + 3, y + 17.5);

      y += 22;
    });
    y += 2;
  }

  // -------------------------------------------------------------
  // 6. FACTUAL CHRONOLOGICAL TIMELINE (WITH PROVENANCE LABELS)
  // -------------------------------------------------------------
  if (incident.timeline && incident.timeline.length > 0) {
    drawSectionHeader('5. Factual Chronological Timeline', 'Source-Attributed Provenance');

    incident.timeline.forEach((tl) => {
      const descLines = doc.splitTextToSize(sanitizeText(tl.description), contentWidth - 32);
      const rowHeight = Math.max(7.5, descLines.length * 3.2 + 5.5);
      ensureSpace(rowHeight);

      // Time Column
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(14, 165, 233);
      doc.text(sanitizeText(tl.timestamp || 'Time'), margin + 2, y + 3.8);

      // Event Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      const titleStr = sanitizeText(tl.title);
      doc.text(titleStr.length > 60 ? titleStr.slice(0, 58) + '..' : titleStr, margin + 24, y + 3.8);

      // Provenance Badge on Right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      doc.text(`[${sanitizeText(tl.sourceLabel || 'USER REPORTED')}]`, pageWidth - margin - 2, y + 3.8, { align: 'right' });

      // Indented Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      doc.text(descLines, margin + 24, y + 7.5);

      y += rowHeight + 1;
    });

    y += 3;
  }

  // -------------------------------------------------------------
  // 7. DIGITAL EVIDENCE INDEX & ATTACHMENTS LEDGER
  // -------------------------------------------------------------
  if (incident.evidence && incident.evidence.length > 0) {
    drawSectionHeader('6. Digital Evidence Index & Artifacts Ledger', 'Preserved Records');

    incident.evidence.forEach((ev, idx) => {
      ensureSpace(7);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.rect(margin, y, contentWidth, 6.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text(`[EV-${idx + 1}] (${sanitizeText(ev.type).toUpperCase()}) ${sanitizeText(ev.title)}`, margin + 3, y + 3.9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Source: ${sanitizeText(ev.source)} | Status: ${sanitizeText(ev.status || 'verified').toUpperCase()}`, pageWidth - margin - 3, y + 3.9, { align: 'right' });

      y += 7;
    });

    y += 3;
  }

  // -------------------------------------------------------------
  // 8. OFFICIAL INSTITUTIONAL NOTE FOR INVESTIGATING OFFICERS
  // -------------------------------------------------------------
  ensureSpace(25);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 22, 1, 1, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 22, 1, 1, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL NOTE FOR LAW ENFORCEMENT & BANK NODAL OFFICERS:', margin + 3.5, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('1. This dossier consolidates fragmented banking parameters, payment receipts, and communications for direct investigation.', margin + 3.5, y + 9.5);
  doc.text('2. Critical 12-Digit UTRs and Beneficiary VPAs have been extracted and cross-checked against payment receipts.', margin + 3.5, y + 13.5);
  doc.text('3. Under the I4C 1930 / CFCFRMS framework and RBI Zero-Liability circulars, please prioritize immediate lien hold and dispute recall.', margin + 3.5, y + 17.5);

  // Finalize footer on last page
  drawRunningFooter(currentPage);

  // Save PDF
  const cleanCaseId = sanitizeText(incident.caseId).replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`NIRNAY_Case_Dossier_${cleanCaseId}.pdf`);
}

export function exportCaseJson(incident: IncidentCase) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incident, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `NIRNAY_Case_${incident.caseId}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
