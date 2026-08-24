import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileCheck,
  FileCode,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  UploadCloud
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { EvidenceItem, EvidenceType } from '../../types';

export const EvidenceUpload: React.FC = () => {
  const {
    draftIncident,
    addDraftEvidence,
    removeDraftEvidence,
    setIntakeStep
  } = useIncident();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('screenshot');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('WhatsApp');
  const [rawTextSnippet, setRawTextSnippet] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation: 10MB limit
    const maxBytes = 10 * 1024 * 1024;
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.txt', '.apk'];
    const isValidExt = allowed.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidExt) {
      setUploadError("This file type isn't supported. Please upload JPG, PNG, PDF, TXT or APK files.");
      return;
    }

    if (file.size > maxBytes) {
      setUploadError(`File is larger than 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a smaller file.`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    setTimeout(() => {
      let inferredType: EvidenceType = 'screenshot';
      if (file.name.endsWith('.pdf')) inferredType = 'bank_statement';
      else if (file.name.endsWith('.txt')) inferredType = 'whatsapp_chat';
      else if (file.name.endsWith('.apk')) inferredType = 'apk_file';

      addDraftEvidence({
        type: inferredType,
        title: title.trim() || file.name,
        description: `Uploaded digital evidence: ${file.name}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        source: source || 'User Upload',
        status: 'verified',
        relevance: 'critical',
        fileSizeBytes: file.size,
        fileName: file.name
      });

      setIsUploading(false);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 300);
  };

  const handleAddTextSnippet = () => {
    if (!rawTextSnippet.trim()) return;

    let inferredType: EvidenceType = 'sms_text';
    if (rawTextSnippet.toLowerCase().includes('whatsapp') || rawTextSnippet.includes('[')) {
      inferredType = 'whatsapp_chat';
    }

    addDraftEvidence({
      type: inferredType,
      title: inferredType === 'whatsapp_chat' ? 'WhatsApp Chat Transcript' : 'Bank SMS Notification Record',
      description: 'Pasted text transcript from conversation or debit notification SMS',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      source: inferredType === 'whatsapp_chat' ? 'WhatsApp' : 'Bank SMS',
      status: 'verified',
      relevance: 'critical',
      contentSnippet: rawTextSnippet.trim()
    });

    setRawTextSnippet('');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (type: EvidenceType) => {
    switch (type) {
      case 'screenshot': return <ImageIcon size={16} className="text-brand-blue" />;
      case 'whatsapp_chat': return <MessageSquare size={16} className="text-brand-primary" />;
      case 'sms_text': return <FileText size={16} className="text-brand-amber" />;
      case 'bank_statement': return <FileCheck size={16} className="text-brand-green" />;
      default: return <Paperclip size={16} className="text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 4 OF 5 &bull; EVIDENCE PRESERVATION
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Upload Evidence & Chat Transcripts
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Attach payment receipts, threat messages, and debit SMS alerts to authenticate your case for 1930 and bank refund processing.
        </p>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{uploadError}</span>
        </div>
      )}

      {/* Existing Evidence List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            Preserved Evidence Items ({draftIncident.evidence.length})
          </h3>
          <span className="text-xs text-text-muted">
            {draftIncident.evidence.length} artifact(s) attached
          </span>
        </div>

        {draftIncident.evidence.length === 0 ? (
          <div className="p-6 rounded-card bg-surface border border-dashed border-surface-border text-center space-y-1">
            <Paperclip size={20} className="mx-auto text-text-muted opacity-60" />
            <div className="text-xs font-semibold text-text-secondary">No evidence files uploaded yet.</div>
            <p className="text-[11px] text-text-muted">
              You can upload files or paste SMS text below, or proceed and add them later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {draftIncident.evidence.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-card bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-3"
              >
                <div className="space-y-1 text-xs flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getIcon(ev.type)}
                    <span className="font-bold text-text-primary truncate">{ev.title}</span>
                  </div>
                  {ev.fileName && (
                    <div className="text-[11px] font-mono text-text-muted flex items-center gap-2">
                      <span className="truncate">{ev.fileName}</span>
                      {ev.fileSizeBytes && <span>&bull; {formatFileSize(ev.fileSizeBytes)}</span>}
                      <span className="text-brand-green font-semibold">&bull; Uploaded ✓</span>
                    </div>
                  )}
                  {ev.contentSnippet && (
                    <div className="p-2 rounded bg-surface-subtle border border-surface-border font-mono text-[11px] text-text-muted line-clamp-2">
                      &ldquo;{ev.contentSnippet}&rdquo;
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeDraftEvidence(ev.id)}
                  className="p-1.5 rounded-md text-text-muted hover:text-brand-red hover:bg-brand-red-soft transition-colors shrink-0"
                  title="Remove evidence"
                  aria-label="Remove evidence"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Method 1: File Dropzone */}
        <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <UploadCloud size={15} className="text-brand-primary" />
            <span>Upload Screenshot or PDF Receipt</span>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-surface-border hover:border-brand-primary/60 rounded-card p-6 text-center cursor-pointer transition-colors bg-surface-subtle hover:bg-surface-elevated"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelected}
              accept=".jpg,.jpeg,.png,.pdf,.txt,.apk"
              className="hidden"
            />
            <UploadCloud size={28} className="mx-auto text-brand-primary mb-2 opacity-80" />
            <div className="text-xs font-bold text-text-primary">
              {isUploading ? 'Validating file...' : 'Click to Upload Document / Screenshot'}
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              Supports JPG, PNG, PDF receipts (Max 10 MB).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-text-muted font-medium mb-1">Custom Label (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GPay Receipt"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-1.5 text-text-primary outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-text-muted font-medium mb-1">Source / Platform</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. WhatsApp"
                className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-1.5 text-text-primary outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Method 2: Paste Chat / SMS */}
        <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
              <MessageSquare size={15} className="text-brand-blue" />
              <span>Paste Debit SMS or WhatsApp Messages</span>
            </div>
          </div>

          <textarea
            value={rawTextSnippet}
            onChange={(e) => setRawTextSnippet(e.target.value)}
            placeholder="Paste your bank debit SMS alert (e.g. 'Rs 18,500 debited from A/C XX9104 on 24-AUG-26 by UPI/423719820491...') or suspicious message..."
            rows={5}
            className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 text-xs font-mono text-text-primary placeholder:text-text-muted focus:border-brand-primary outline-none"
          />

          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] text-text-muted font-mono">
              {rawTextSnippet.length} characters
            </span>
            <button
              type="button"
              onClick={handleAddTextSnippet}
              disabled={!rawTextSnippet.trim()}
              className="px-4 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-subtle text-text-primary border border-surface-border font-semibold text-xs transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-subtle"
            >
              <Plus size={13} />
              <span>Add Text Record</span>
            </button>
          </div>
        </div>

      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => setIntakeStep(3)}
          className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-subtle text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Transactions</span>
        </button>

        <button
          type="button"
          onClick={() => setIntakeStep(5)}
          className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-2"
        >
          <span>Review Case Before Submission</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
