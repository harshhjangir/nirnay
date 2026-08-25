import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  FileCheck,
  FileCode,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  UploadCloud,
  User
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { EvidenceItem, EvidenceType } from '../../types';

// Indian States & Major Cities Dataset
const INDIAN_STATES_CITIES: Record<string, string[]> = {
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Kalaburagi', 'Davanagere'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Navi Mumbai'],
  'Delhi': ['New Delhi', 'South Delhi', 'North Delhi', 'Dwarka', 'Rohini'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
  'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Ghaziabad', 'Prayagraj'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri']
};

export const EvidenceUpload: React.FC = () => {
  const {
    draftIncident,
    updateDraft,
    addDraftEvidence,
    removeDraftEvidence,
    setIntakeStep,
    user
  } = useIncident();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('WhatsApp');
  const [rawTextSnippet, setRawTextSnippet] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Complainant & Timing Form State
  const complainant = draftIncident.complainant;
  const [name, setName] = useState(complainant.name || user?.name || '');
  const [phone, setPhone] = useState(complainant.phone || user?.phone || '');
  const [email, setEmail] = useState(complainant.email || user?.email || '');
  const [selectedState, setSelectedState] = useState(complainant.state || 'Karnataka');
  const [selectedCity, setSelectedCity] = useState(complainant.city || 'Bengaluru');
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const [incidentDate, setIncidentDate] = useState(todayStr);
  const [incidentTime, setIncidentTime] = useState('10:28');

  const availableCities = INDIAN_STATES_CITIES[selectedState] || ['Bengaluru'];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const cities = INDIAN_STATES_CITIES[state] || [];
    const defaultCity = cities[0] || '';
    setSelectedCity(defaultCity);
    updateDraft({
      complainant: {
        ...complainant,
        state,
        city: defaultCity
      }
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    updateDraft({
      complainant: {
        ...complainant,
        city
      }
    });
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 10 * 1024 * 1024;
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.txt', '.apk'];
    const isValidExt = allowed.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidExt) {
      setUploadError("Please upload a valid JPG, PNG, PDF, TXT or APK file.");
      return;
    }

    if (file.size > maxBytes) {
      setUploadError(`File is larger than 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
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
        timestamp: `${incidentDate} ${incidentTime}`,
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
      title: inferredType === 'whatsapp_chat' ? 'WhatsApp Chat Transcript' : 'Bank Debit SMS Alert',
      description: 'Pasted text transcript from conversation or debit notification SMS',
      timestamp: `${incidentDate} ${incidentTime}`,
      source: inferredType === 'whatsapp_chat' ? 'WhatsApp' : 'Bank SMS',
      status: 'verified',
      relevance: 'critical',
      contentSnippet: rawTextSnippet.trim()
    });

    setRawTextSnippet('');
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    updateDraft({
      complainant: {
        name: name.trim() || 'Citizen Complainant',
        phone: phone.trim() || '+91 98450 00000',
        email: email.trim() || 'citizen@example.com',
        state: selectedState,
        city: selectedCity
      }
    });
    setIntakeStep(5);
  };

  const getIcon = (type: EvidenceType) => {
    switch (type) {
      case 'screenshot':
        return <ImageIcon size={16} className="text-brand-primary" />;
      case 'bank_statement':
        return <FileText size={16} className="text-brand-green" />;
      case 'whatsapp_chat':
      case 'sms_text':
        return <MessageSquare size={16} className="text-brand-blue" />;
      case 'apk_file':
        return <FileCode size={16} className="text-brand-red" />;
      default:
        return <FileCheck size={16} className="text-brand-primary" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div>
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-1">
          STEP 4 OF 5 &bull; EVIDENCE ATTACHMENT &amp; COMPLAINANT PARTICULARS
        </div>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">
          Attach Evidence &amp; Contact Details
        </h2>
        <p className="text-sm text-text-secondary mt-1 font-sans">
          Upload any supporting threat messages, WhatsApp chat logs, or APK files. Provide verified jurisdiction details for the formal case dossier.
        </p>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-lg bg-brand-red-soft border border-brand-red/30 text-xs text-brand-red flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{uploadError}</span>
        </div>
      )}

      {/* Section 1: Attached Evidence Ledger */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <Paperclip size={15} className="text-brand-primary" />
            <span>Attached Evidence Items ({draftIncident.evidence.length})</span>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Source-Attributed Files
          </span>
        </div>

        {draftIncident.evidence.length === 0 ? (
          <div className="p-5 rounded-card bg-surface-subtle border border-dashed border-surface-border text-center space-y-1">
            <Paperclip size={18} className="mx-auto text-text-muted opacity-60" />
            <div className="text-xs font-semibold text-text-secondary">No secondary evidence files attached yet.</div>
            <p className="text-[11px] text-text-muted">
              Primary transaction receipt is already recorded. You can attach WhatsApp chats, APKs, or paste SMS below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {draftIncident.evidence.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-card bg-surface-subtle border border-surface-border shadow-subtle flex items-start justify-between gap-3"
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
                    <div className="p-2 rounded bg-surface border border-surface-border font-mono text-[11px] text-text-muted line-clamp-2">
                      &ldquo;{ev.contentSnippet}&rdquo;
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeDraftEvidence(ev.id)}
                  className="p-1.5 rounded-md text-text-muted hover:text-brand-red hover:bg-brand-red-soft transition-colors shrink-0"
                  title="Remove evidence"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Upload Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Method 1: File Dropzone */}
        <div className="p-4 rounded-card bg-surface border border-surface-border shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <UploadCloud size={15} className="text-brand-primary" />
            <span>Upload Document / Chat Export</span>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-surface-border hover:border-brand-primary/60 rounded-card p-5 text-center cursor-pointer transition-colors bg-surface-subtle hover:bg-surface-elevated"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelected}
              accept=".jpg,.jpeg,.png,.pdf,.txt,.apk"
              className="hidden"
            />
            <UploadCloud size={24} className="mx-auto text-brand-primary mb-1.5 opacity-80" />
            <div className="text-xs font-bold text-text-primary">
              {isUploading ? 'Validating file...' : 'Click to Upload Document / Screenshot'}
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              Supports JPG, PNG, PDF receipts, TXT chats (Max 10 MB).
            </p>
          </div>
        </div>

        {/* Method 2: Paste Chat / SMS */}
        <div className="p-4 rounded-card bg-surface border border-surface-border shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide">
            <MessageSquare size={15} className="text-brand-blue" />
            <span>Paste Debit SMS or Threat Text</span>
          </div>

          <textarea
            value={rawTextSnippet}
            onChange={(e) => setRawTextSnippet(e.target.value)}
            placeholder="Paste your bank debit SMS alert or WhatsApp message..."
            rows={4}
            className="w-full bg-surface-subtle border border-surface-border rounded-lg p-2.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:border-brand-primary outline-none"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddTextSnippet}
              disabled={!rawTextSnippet.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-subtle text-text-primary border border-surface-border font-semibold text-xs transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-subtle"
            >
              <Plus size={13} />
              <span>Add Text Record</span>
            </button>
          </div>
        </div>

      </div>

      {/* Section 3: Complainant Information & Defined Date/State Dropdowns (User requirement) */}
      <div className="p-5 rounded-card bg-surface border border-surface-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary uppercase tracking-wide border-b border-surface-border/60 pb-2.5">
          <User size={15} className="text-brand-primary" />
          <span>Complainant Particulars &amp; Jurisdiction Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-text-primary mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand-primary"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-text-primary mb-1">Mobile Phone (10 Digits) *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98451 92837"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono text-text-primary outline-none focus:border-brand-primary"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-text-primary mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. citizen@example.com"
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono text-text-primary outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* State and City Auto-Select Dropdowns (User requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="block font-bold text-text-primary mb-1 flex items-center gap-1">
              <MapPin size={12} className="text-brand-primary" />
              <span>Select State (Jurisdiction) *</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-semibold text-text-primary outline-none focus:border-brand-primary"
              required
            >
              {Object.keys(INDIAN_STATES_CITIES).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-text-primary mb-1 flex items-center gap-1">
              <MapPin size={12} className="text-brand-primary" />
              <span>Select City *</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-semibold text-text-primary outline-none focus:border-brand-primary"
              required
            >
              {availableCities.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Defined Date and Time Inputs (User requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="block font-bold text-text-primary mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-brand-primary" />
              <span>Incident Date *</span>
            </label>
            <input
              type="date"
              max={todayStr}
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono text-text-primary outline-none focus:border-brand-primary"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-text-primary mb-1 flex items-center gap-1">
              <Clock size={12} className="text-brand-primary" />
              <span>Incident Time *</span>
            </label>
            <input
              type="time"
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border rounded-lg px-3 py-2 font-mono text-text-primary outline-none focus:border-brand-primary"
              required
            />
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
          type="submit"
          className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors shadow-subtle flex items-center gap-2"
        >
          <span>Review Case Before Submission</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
};
