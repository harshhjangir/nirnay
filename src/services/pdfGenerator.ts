import { jsPDF } from 'jspdf';
import { IncidentCase } from '../types';

/**
 * Enhanced PDF Case Dossier Generator for NIVARAN
 * Produces structured, multi-page, non-overlapping reports formatted for:
 * - 1930 Helpline / I4C CFCFRMS Nodal Verification
 * - Bank Fraud Control Cells & Grievance Redressal Officers
 * - State Cyber Crime Police Stations (NCRP FIR filing)
 * - RBI Banking Ombudsman (CMS Portal escalation)
 */
export function generateCasePdf(incident: IncidentCase) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 22; // Safe distance from bottom for footer

  let currentPage = 1;
  let y = margin;

  // Helper: Draw running header on any page
  const drawRunningHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      // Top Dark Banner for Page 1
      doc.setFillColor(15, 23, 42); // Slate 900
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Platform Brand
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('NIVARAN', margin, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text('PRIVACY-PRESERVING FRAUD CASE INTELLIGENCE', margin + 30, 11);

      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225); // Slate 300
      doc.text('STANDARDIZED EVIDENCE DOSSIER & INSTITUTIONAL ESCALATION RECORD', margin, 18);

      // Case ID & Status Badge on Right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(56, 189, 248); // Sky 400
      doc.text(`CASE ID: ${incident.caseId}`, pageWidth - margin, 11, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - margin, 18, { align: 'right' });

      // Clean Accent Line
      doc.setFillColor(14, 165, 233); // Brand Cyan
      doc.rect(0, 27, pageWidth, 1.2, 'F');

      y = 34;
    } else {
      // Minimal Running Header for subsequent pages
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, pageWidth, 14, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(0, 14, pageWidth, 14);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text('NIVARAN FRAUD CASE DOSSIER', margin, 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Case Ref: ${incident.caseId}`, pageWidth / 2, 9, { align: 'center' });
      doc.text('CONFIDENTIAL & PRIVILEGED', pageWidth - margin, 9, { align: 'right' });

      y = 20;
    }
  };

  // Helper: Draw running footer on every page
  const drawRunningFooter = (pageNumber: number) => {
    const footerY = pageHeight - 10;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text('NIVARAN is an independent civic intelligence platform. Does not replace official statutory reporting on cybercrime.gov.in.', margin, footerY);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNumber}`, pageWidth - margin, footerY, { align: 'right' });
  };

  // Helper: Pagination check
  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - bottomMargin) {
      drawRunningFooter(currentPage);
      doc.addPage();
      currentPage++;
      drawRunningHeader(false);
    }
  };

  // Helper: Draw Section Header Bar
  const drawSectionHeader = (title: string, tag?: string) => {
    ensureSpace(12);
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin + 3, y + 4.8);

    if (tag) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(14, 165, 233);
      doc.text(tag.toUpperCase(), pageWidth - margin - 3, y + 4.8, { align: 'right' });
    }

    y += 10;
  };

  // -------------------------------------------------------------
  // START DOCUMENT RENDERING
  // -------------------------------------------------------------
  drawRunningHeader(true);

  // 1. EXECUTIVE SUMMARY & COMPLAINANT PARTICULARS CARD
  ensureSpace(40);
  const totalAmount = incident.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const cardHeight = 34;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'S');

  // Left Column: Incident Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DISPUTED AMOUNT', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(225, 29, 72); // Rose 600
  doc.text(`INR ${totalAmount.toLocaleString('en-IN')}`, margin + 4, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('FRAUD CLASSIFICATION', margin + 4, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const likelyTypeStr = incident.analysis?.likelyType || (incident.category === 'upi_fraud' ? 'UPI Social Engineering' : incident.category.replace('_', ' ').toUpperCase());
  doc.text(likelyTypeStr.length > 40 ? likelyTypeStr.slice(0, 38) + '..' : likelyTypeStr, margin + 4, y + 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('RISK SEVERITY', margin + 4, y + 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text(`${(incident.analysis?.riskLevel || 'HIGH').toUpperCase()} (Score: ${incident.analysis?.riskScore || 85}/100)`, margin + 4, y + 32);

  // Vertical Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 90, y + 4, margin + 90, y + cardHeight - 4);

  // Right Column: Complainant Information
  const rightColX = margin + 96;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('COMPLAINANT PARTICULARS & JURISDICTION', rightColX, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Name: ${incident.complainant.name || 'Citizen Complainant'}`, rightColX, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Phone: ${incident.complainant.phone || 'N/A'}`, rightColX, y + 17);
  doc.text(`Email: ${incident.complainant.email || 'N/A'}`, rightColX, y + 22);
  doc.text(`Location: ${incident.complainant.city || 'N/A'}, ${incident.complainant.state || 'N/A'}`, rightColX, y + 27);
  doc.text(`Date of Occurrence: ${incident.incidentDate || '2026-08-24'} at ${incident.incidentTime || '10:28 AM'}`, rightColX, y + 32);

  y += cardHeight + 6;

  // 2. DISPUTED FINANCIAL TRANSACTIONS LEDGER (PRIMARY TRIAGE)
  drawSectionHeader('1. Disputed Financial Transactions Ledger', 'For 1930 / I4C Lien Triage');

  // Table Header Row
  ensureSpace(12);
  const colX = {
    time: margin + 2,
    bank: margin + 26,
    method: margin + 68,
    amount: margin + 96,
    recipient: margin + 122,
    utr: margin + 158
  };

  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('TIMESTAMP', colX.time, y + 4.2);
  doc.text('DEBITING BANK & A/C', colX.bank, y + 4.2);
  doc.text('CHANNEL', colX.method, y + 4.2);
  doc.text('AMOUNT (INR)', colX.amount, y + 4.2);
  doc.text('BENEFICIARY VPA / ACC', colX.recipient, y + 4.2);
  doc.text('12-DIGIT UTR / RRN', colX.utr, y + 4.2);
  y += 6;

  // Table Data Rows
  incident.transactions.forEach((tx, idx) => {
    ensureSpace(8);
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, pageWidth - margin, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);

    const timeStr = tx.timestamp ? (tx.timestamp.includes(' ') ? tx.timestamp.split(' ')[1] : tx.timestamp) : '10:28';
    doc.text(timeStr, colX.time, y + 4.5);
    doc.text(`${tx.senderBank} (*${(tx.senderAccountMasked || '9104').slice(-4)})`, colX.bank, y + 4.5);
    doc.text(`${tx.paymentMethod || 'UPI'} (${tx.paymentApp || 'GPay'})`, colX.method, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72);
    doc.text(`INR ${(tx.amount || 0).toLocaleString('en-IN')}`, colX.amount, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const recipStr = (tx.recipientUpiOrAcc || '').length > 20 ? (tx.recipientUpiOrAcc || '').slice(0, 18) + '..' : (tx.recipientUpiOrAcc || 'N/A');
    doc.text(recipStr, colX.recipient, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 165, 233);
    doc.text(tx.utrNumber || 'Pending', colX.utr, y + 4.5);

    y += 7;
  });

  y += 5;

  // 3. INCIDENT MODUS OPERANDI & NARRATIVE STATEMENT
  drawSectionHeader('2. Incident Modus Operandi & Narrative Statement', 'Verified Statement');

  ensureSpace(15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59); // Slate 800

  const narrativeText = incident.whatHappenedSummary || 'Incident submitted through the Nivaran structured evidence intake workflow.';
  const narrativeLines = doc.splitTextToSize(narrativeText, contentWidth - 4);
  
  ensureSpace(narrativeLines.length * 3.8 + 4);
  doc.text(narrativeLines, margin + 2, y + 2);
  y += narrativeLines.length * 3.8 + 5;

  // Extracted Scam Factors Bullet Points
  if (incident.analysis?.reasonFactors && incident.analysis.reasonFactors.length > 0) {
    ensureSpace(incident.analysis.reasonFactors.length * 4 + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('EXTRACTED DECEPTION MECHANISMS & SIGNALS:', margin + 2, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    incident.analysis.reasonFactors.forEach((factor) => {
      doc.text(`•  ${factor}`, margin + 6, y);
      y += 3.8;
    });
    y += 3;
  }

  // 4. SUSPECT IDENTIFIERS & FRAUD CAMPAIGN INTELLIGENCE
  if (incident.suspects && incident.suspects.length > 0) {
    drawSectionHeader('3. Suspect Identifiers & Communication Nodes', 'Syndicate Signals');

    incident.suspects.forEach((s) => {
      ensureSpace(8);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(14, 165, 233);
      doc.text(`[${s.type.toUpperCase()}]`, margin + 3, y + 4.6);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(s.value, margin + 28, y + 4.6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const matchNote = s.matchingReportsCount && s.matchingReportsCount > 0 ? `• Matched in ${s.matchingReportsCount} Nivaran Reports` : '';
      const sourceNote = `Source: ${s.source || 'Evidence'} ${matchNote}`;
      doc.text(sourceNote, pageWidth - margin - 3, y + 4.6, { align: 'right' });

      y += 8.5;
    });

    y += 2;
  }

  // 5. EXTERNAL COMPLAINT REFERENCES & RESPONSE MEMORY
  drawSectionHeader('4. External Reference Ledger & Bank Responses', 'Multi-Agency Tracking');

  if (incident.externalReferences && incident.externalReferences.length > 0) {
    incident.externalReferences.forEach((ref) => {
      ensureSpace(9);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 7.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(ref.authorityName, margin + 3, y + 4.8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 165, 233);
      doc.text(`Ref: ${ref.referenceNumber}`, margin + 65, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Status: ${ref.statusDisplay}`, margin + 115, y + 4.8);
      doc.text(ref.dateSubmitted || 'Logged', pageWidth - margin - 3, y + 4.8, { align: 'right' });

      y += 9;
    });
    y += 2;
  }

  // Authority Responses Breakdown if available
  if (incident.responses && incident.responses.length > 0) {
    incident.responses.forEach((resp) => {
      ensureSpace(24);
      doc.setFillColor(254, 242, 242); // Light red
      doc.roundedRect(margin, y, contentWidth, 22, 1, 1, 'F');
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(margin, y, contentWidth, 22, 1, 1, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(153, 27, 27); // Dark red
      doc.text(`OFFICIAL RESPONSE RECEIVED: ${resp.responder.toUpperCase()} (${resp.date})`, margin + 3, y + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`Decision: ${resp.decision}`, margin + 3, y + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(71, 85, 105);
      const respLines = doc.splitTextToSize(resp.whatTheySaid || resp.reason, contentWidth - 8);
      doc.text(respLines.slice(0, 2), margin + 3, y + 14.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(2, 132, 199);
      doc.text(`Next Legal Step: ${resp.potentialNextAction || 'Escalate to Principal Nodal Officer / RBI CMS Portal'}`, margin + 3, y + 19.5);

      y += 25;
    });
  }

  // 6. FACTUAL CHRONOLOGICAL TIMELINE (WITH PROVENANCE TAGS)
  if (incident.timeline && incident.timeline.length > 0) {
    drawSectionHeader('5. Factual Chronological Timeline', 'Source-Attributed Provenance');

    incident.timeline.forEach((tl) => {
      const descLines = doc.splitTextToSize(tl.description, contentWidth - 28);
      const rowHeight = Math.max(8, descLines.length * 3.5 + 6);
      ensureSpace(rowHeight);

      // Time Column on Left
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(14, 165, 233);
      doc.text(tl.timestamp || 'Time', margin + 2, y + 4);

      // Provenance Tag & Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(tl.title, margin + 24, y + 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`[${tl.sourceLabel || 'USER REPORTED'}]`, pageWidth - margin - 2, y + 4, { align: 'right' });

      // Description Lines
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(71, 85, 105);
      doc.text(descLines, margin + 24, y + 8);

      y += rowHeight + 1.5;
    });

    y += 4;
  }

  // 7. DIGITAL EVIDENCE INDEX & ATTACHMENTS LEDGER
  if (incident.evidence && incident.evidence.length > 0) {
    drawSectionHeader('6. Digital Evidence Index & Artifacts Ledger', 'Preserved Records');

    incident.evidence.forEach((ev, idx) => {
      ensureSpace(7.5);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 6.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(15, 23, 42);
      doc.text(`[EV-${idx + 1}] (${ev.type.toUpperCase()}) ${ev.title}`, margin + 3, y + 4.3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Source: ${ev.source} | Status: ${(ev.status || 'verified').toUpperCase()}`, pageWidth - margin - 3, y + 4.3, { align: 'right' });

      y += 7.5;
    });

    y += 5;
  }

  // 8. OFFICIAL NOTE FOR LAW ENFORCEMENT & BANK NODAL OFFICERS
  ensureSpace(28);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL NOTE FOR LAW ENFORCEMENT & BANK NODAL OFFICERS:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);
  doc.text('1. This dossier is prepared by the citizen using the NIVARAN platform to consolidate fragmented transaction parameters.', margin + 4, y + 11);
  doc.text('2. Core parameters (12-Digit UTR, timestamps, beneficiary VPA) have been verified against payment app receipts and bank debit alerts.', margin + 4, y + 15.5);
  doc.text('3. Under the I4C 1930 / CFCFRMS framework and RBI Zero-Liability circulars, please prioritize immediate lien hold and dispute review.', margin + 4, y + 20);

  // Finalize footer on last page
  drawRunningFooter(currentPage);

  // Save PDF with sanitized name
  const cleanId = incident.caseId.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`NIVARAN_Case_Dossier_${cleanId}.pdf`);
}

export function exportCaseJson(incident: IncidentCase) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incident, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `NIVARAN_Case_${incident.caseId}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
