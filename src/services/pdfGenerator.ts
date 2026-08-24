import { jsPDF } from 'jspdf';
import { IncidentCase } from '../types';

export function generateCasePdf(incident: IncidentCase) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(13, 20, 29); // #0D141D
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(244, 247, 248);
  doc.text('NIVARAN | FINANCIAL CYBERCRIME CASE DOSSIER', 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(170, 183, 194);
  doc.text('EMERGENCY FIRST-RESPONSE & CASE PREPARATION LAYER (FOR 1930 / NCRP / BANK NODAL)', 14, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(40, 215, 160); // #28D7A0
  doc.text(`CASE ID: ${incident.caseId}`, pageWidth - 14, 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(170, 183, 194);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth - 14, 20, { align: 'right' });

  y = 40;

  // Section 1: Executive Summary & Triage Metadata
  doc.setFillColor(245, 247, 250);
  doc.rect(14, y, pageWidth - 28, 28, 'F');
  doc.setDrawColor(200, 210, 220);
  doc.rect(14, y, pageWidth - 28, 28, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 30, 45);

  const totalAmount = incident.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  doc.text(`Total Amount Disputed: INR ${totalAmount.toLocaleString('en-IN')}`, 18, y + 7);
  doc.text(`Incident Classification: ${incident.analysis.likelyType}`, 18, y + 14);
  doc.text(`Risk Assessment: ${incident.analysis.riskLevel.toUpperCase()} (Score: ${incident.analysis.riskScore}/100)`, 18, y + 21);

  doc.text(`Complainant: ${incident.complainant.name || 'Not Disclosed'}`, 110, y + 7);
  doc.text(`Contact: ${incident.complainant.phone || 'N/A'}`, 110, y + 14);
  doc.text(`Jurisdiction / City: ${incident.complainant.city || 'N/A'}, ${incident.complainant.state || 'N/A'}`, 110, y + 21);

  y += 36;

  // Section 2: Incident Modus Operandi & Narrative
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 25, 35);
  doc.text('1. Incident Narrative & Modus Operandi', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 70);
  const narrativeLines = doc.splitTextToSize(incident.whatHappenedSummary || 'Incident reported via NIVARAN intake workflow.', pageWidth - 28);
  doc.text(narrativeLines, 14, y);
  y += narrativeLines.length * 4.5 + 4;

  // Key Risk Signals
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 25, 35);
  doc.text('Key Risk Signals Identified:', 14, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  incident.analysis.reasonFactors.forEach((factor) => {
    doc.text(`•  ${factor}`, 18, y);
    y += 4;
  });
  y += 3;

  // Section 3: Financial Transactions Ledger
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 25, 35);
  doc.text('2. Financial Transaction Ledger (For 1930 / Bank Lien Triage)', 14, y);
  y += 5;

  // Table Header
  doc.setFillColor(230, 235, 242);
  doc.rect(14, y, pageWidth - 28, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 50, 60);
  doc.text('Timestamp', 16, y + 4.2);
  doc.text('Debit Bank & A/C', 45, y + 4.2);
  doc.text('Amount (INR)', 85, y + 4.2);
  doc.text('Beneficiary VPA / A/C', 115, y + 4.2);
  doc.text('UTR / 12-Digit Ref', 160, y + 4.2);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  incident.transactions.forEach((tx) => {
    doc.setDrawColor(220, 225, 230);
    doc.line(14, y + 6, pageWidth - 14, y + 6);
    doc.text(tx.timestamp || 'N/A', 16, y + 4.5);
    doc.text(`${tx.senderBank} (*${tx.senderAccountMasked.slice(-4)})`, 45, y + 4.5);
    doc.text(`INR ${tx.amount.toLocaleString('en-IN')}`, 85, y + 4.5);
    doc.text(tx.recipientUpiOrAcc.length > 24 ? tx.recipientUpiOrAcc.slice(0, 22) + '..' : tx.recipientUpiOrAcc, 115, y + 4.5);
    doc.text(tx.utrNumber || 'Pending', 160, y + 4.5);
    y += 7;
  });

  y += 4;

  // Section 4: Suspect Identifiers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 25, 35);
  doc.text('3. Suspect Identifiers & Communication Nodes', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  incident.suspects.forEach((s) => {
    doc.text(`[${s.type.toUpperCase()}] ${s.value} — ${s.notes || 'Identified in communication'}`, 18, y);
    y += 4.5;
  });

  y += 3;

  // Section 5: Timeline of Events
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 25, 35);
  doc.text('4. Chronological Incident Timeline', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  incident.timeline.forEach((tl) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${tl.timestamp} | ${tl.title}`, 18, y);
    doc.setFont('helvetica', 'normal');
    const desc = doc.splitTextToSize(tl.description, pageWidth - 40);
    doc.text(desc, 18, y + 3.8);
    y += desc.length * 3.8 + 3.5;
  });

  // Check if we need new page or continue
  if (y > 240) {
    doc.addPage();
    y = 18;
  } else {
    y += 4;
  }

  // Section 6: Evidence Index
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 25, 35);
  doc.text('5. Digital Evidence Index', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  incident.evidence.forEach((ev, idx) => {
    doc.text(`[EV-${idx + 1}] (${ev.type.toUpperCase()}) ${ev.title} | Source: ${ev.source} | Status: ${ev.status.toUpperCase()}`, 18, y);
    y += 4.2;
  });

  y += 6;

  // Section 7: Official Handover Note for Investigating Officer
  doc.setFillColor(240, 244, 248);
  doc.rect(14, y, pageWidth - 28, 22, 'F');
  doc.setDrawColor(180, 195, 210);
  doc.rect(14, y, pageWidth - 28, 22, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 30, 40);
  doc.text('OFFICIAL NOTE FOR LAW ENFORCEMENT & BANK NODAL OFFICERS:', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('This dossier has been generated via NIVARAN to assist victims in presenting clean, chronological, and verified', 18, y + 11);
  doc.text('transaction references (UTR/VPA/Timestamps). Please prioritize immediate nodal lien under the I4C 1930 framework.', 18, y + 15);

  // Footer Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(120, 130, 140);
  doc.text('NIVARAN is an independent emergency-response and case preparation platform. It does not replace official police FIR or NCRP acknowledgement.', 14, 288);
  doc.text(`Case Reference: ${incident.caseId} | Page 1 of 1`, pageWidth - 14, 288, { align: 'right' });

  // Save the PDF
  doc.save(`NIVARAN_Case_Summary_${incident.caseId}.pdf`);
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
