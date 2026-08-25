import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode,
  FileText,
  Key,
  Layers,
  Lock,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Terminal,
  Zap
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { secureProcessingService } from '../../services/secureProcessing/secureProcessingService';

export const PrivacySecurityExplainer: React.FC = () => {
  const { setActiveTab, setIntakeStep, isMasked, toggleMasking } = useIncident();
  const [technicalDetailsOpen, setTechnicalDetailsOpen] = useState(false);

  const attestationReport = secureProcessingService.getAttestationReport();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in">
      
      {/* Top Header */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
          DATA PROTECTION &bull; CONFIDENTIAL COMPUTING &bull; ZERO-TRUST BOUNDARIES
        </div>
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
          Privacy &amp; Security Architecture
        </h1>
        <p className="text-sm text-text-secondary max-w-3xl leading-relaxed font-sans">
          Your financial cybercrime documents contain highly sensitive personal and transaction data. NIVARAN is engineered around a strict data minimization and confidential processing architecture.
        </p>
      </div>

      {/* Honest Attestation & Architecture Status Banner */}
      <div className="p-5 rounded-card-lg bg-surface border border-surface-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="font-mono text-xs font-bold text-brand-primary uppercase">
              STATUS: {attestationReport.statusLabel}
            </span>
          </div>
          <h3 className="text-base font-bold text-text-primary">
            Protected Processing Boundary Active
          </h3>
          <p className="text-xs text-text-muted font-sans max-w-2xl leading-relaxed">
            {attestationReport.memoryIsolationNotice}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleMasking}
            className="px-3.5 py-2 rounded-lg bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-surface-border font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            {isMasked ? <Eye size={14} className="text-brand-primary" /> : <EyeOff size={14} />}
            <span>{isMasked ? 'Data Masking ON' : 'Data Masking OFF'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars of NIVARAN Privacy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        
        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
          <div className="h-8 w-8 rounded-md bg-brand-soft text-brand-primary flex items-center justify-center">
            <Lock size={16} />
          </div>
          <div className="font-bold text-text-primary font-mono text-[11px] uppercase">
            1. DATA IN TRANSIT
          </div>
          <p className="text-text-secondary leading-relaxed">
            All evidence transfers and API requests are protected via end-to-end TLS 1.3 encryption.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
          <div className="h-8 w-8 rounded-md bg-brand-green-soft text-brand-green flex items-center justify-center">
            <Cpu size={16} />
          </div>
          <div className="font-bold text-text-primary font-mono text-[11px] uppercase">
            2. PROTECTED PROCESSING
          </div>
          <p className="text-text-secondary leading-relaxed">
            OCR parsing and sensitive parameter extraction are isolated inside protected execution memory.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
          <div className="h-8 w-8 rounded-md bg-brand-blue-soft text-brand-blue flex items-center justify-center">
            <ShieldCheck size={16} />
          </div>
          <div className="font-bold text-text-primary font-mono text-[11px] uppercase">
            3. MINIMIZED FOR AI
          </div>
          <p className="text-text-secondary leading-relaxed">
            Raw document images are never sent to external LLMs. Only minimized structured facts are passed.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
          <div className="h-8 w-8 rounded-md bg-brand-amber-soft text-brand-amber flex items-center justify-center">
            <EyeOff size={16} />
          </div>
          <div className="font-bold text-text-primary font-mono text-[11px] uppercase">
            4. SENSITIVE MASKING
          </div>
          <p className="text-text-secondary leading-relaxed">
            Account numbers and phone numbers use progressive disclosure and masking across all views.
          </p>
        </div>

      </div>

      {/* Visual Protected Processing Pipeline */}
      <div className="p-6 rounded-card-lg bg-surface border border-surface-border shadow-card space-y-4">
        <div className="space-y-0.5">
          <div className="text-xs font-mono font-bold text-brand-primary uppercase">
            PROCESSING FLOW
          </div>
          <h2 className="text-lg font-bold text-text-primary font-display">
            How Your Financial Evidence Travels
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-xs">
          
          <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] text-text-muted font-bold">STAGE 1</div>
              <div className="font-bold text-text-primary">Client Browser</div>
              <p className="text-[11px] text-text-secondary font-sans leading-tight mt-1">
                You select payment screenshot or paste bank debit SMS.
              </p>
            </div>
            <div className="text-[10px] font-mono text-brand-primary font-semibold pt-1 border-t border-surface-border/50">
              HTTPS TLS 1.3
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] text-text-muted font-bold">STAGE 2</div>
              <div className="font-bold text-text-primary">Secure Gateway</div>
              <p className="text-[11px] text-text-secondary font-sans leading-tight mt-1">
                Payload routed directly to confidential processing backend.
              </p>
            </div>
            <div className="text-[10px] font-mono text-brand-primary font-semibold pt-1 border-t border-surface-border/50">
              vsock / Enclave Key
            </div>
          </div>

          <div className="p-3 rounded-lg bg-brand-soft/40 border border-brand-primary/30 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] text-brand-primary font-bold">STAGE 3 (TEE)</div>
              <div className="font-bold text-text-primary">Isolated Enclave</div>
              <p className="text-[11px] text-text-secondary font-sans leading-tight mt-1">
                OCR extracts Amount, 12-digit UTR, Bank &amp; VPA in RAM.
              </p>
            </div>
            <div className="text-[10px] font-mono text-brand-green font-semibold pt-1 border-t border-brand-primary/20">
              Ephemerally Purged
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] text-text-muted font-bold">STAGE 4</div>
              <div className="font-bold text-text-primary">PII Minimization</div>
              <p className="text-[11px] text-text-secondary font-sans leading-tight mt-1">
                Accounts masked (•••• 4521). Passwords &amp; OTPs rejected.
              </p>
            </div>
            <div className="text-[10px] font-mono text-text-muted font-semibold pt-1 border-t border-surface-border/50">
              Zero PII Leakage
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] text-text-muted font-bold">STAGE 5</div>
              <div className="font-bold text-text-primary">Case Dossier</div>
              <p className="text-[11px] text-text-secondary font-sans leading-tight mt-1">
                Structured legal dossier package generated for 1930 / bank.
              </p>
            </div>
            <div className="text-[10px] font-mono text-brand-green font-semibold pt-1 border-t border-surface-border/50">
              User Verified ✓
            </div>
          </div>

        </div>
      </div>

      {/* Prohibited Secrets Protection Box */}
      <div className="p-5 rounded-card-lg bg-brand-amber-soft/40 border border-brand-amber/30 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-mono font-bold text-brand-amber uppercase">
          <ShieldAlert size={16} />
          <span>AUTHENTICATION CREDENTIALS ARE STRICTLY PROHIBITED</span>
        </div>
        <p className="text-text-primary font-sans leading-relaxed">
          NIVARAN will <strong>never ask for, store, or process your OTPs, UPI PINs, netbanking passwords, or card CVV numbers</strong>. Any automated attempts to input such credentials into case descriptions are sanitized and rejected by our regex data minimizer before processing.
        </p>
      </div>

      {/* Expandable Technical Deep-Dive for Developers & Hackathon Judges */}
      <div className="rounded-card-lg bg-surface border border-surface-border shadow-subtle overflow-hidden">
        <button
          onClick={() => setTechnicalDetailsOpen(prev => !prev)}
          className="w-full p-5 flex items-center justify-between text-left focus:outline-none hover:bg-surface-subtle transition-colors"
        >
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-brand-primary" />
            <div>
              <div className="text-sm font-bold text-text-primary font-sans">
                Technical Enclave Architecture &amp; Attestation Blueprint
              </div>
              <div className="text-xs text-text-muted font-mono">
                For developers, security auditors, and hackathon technical review
              </div>
            </div>
          </div>

          <div className={`p-1 text-text-muted transition-transform ${technicalDetailsOpen ? 'rotate-180 text-brand-primary' : ''}`}>
            <ChevronDown size={18} />
          </div>
        </button>

        {technicalDetailsOpen && (
          <div className="p-6 border-t border-surface-border/60 bg-surface-subtle space-y-5 text-xs font-sans animate-in fade-in">
            
            <div className="space-y-2">
              <h4 className="font-bold text-text-primary font-mono uppercase text-[11px]">
                Hardware Enclave Target Compatibility
              </h4>
              <p className="text-text-secondary leading-relaxed">
                The NIVARAN secure processing interface (`SecureProcessingProvider`) is designed to run inside cloud confidential computing hardware environments without code refactoring:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono text-[11px]">
                <div className="p-3 rounded bg-surface border border-surface-border space-y-1">
                  <div className="font-bold text-brand-primary">AWS Nitro Enclaves</div>
                  <div className="text-text-muted">CPU/Memory isolation via vsock and cryptographic PCR0 attestation release with AWS KMS.</div>
                </div>
                <div className="p-3 rounded bg-surface border border-surface-border space-y-1">
                  <div className="font-bold text-brand-primary">Azure Confidential VMs</div>
                  <div className="text-text-muted">AMD SEV-SNP hardware memory encryption invisible to cloud hypervisor.</div>
                </div>
                <div className="p-3 rounded bg-surface border border-surface-border space-y-1">
                  <div className="font-bold text-brand-primary">Google Confidential Space</div>
                  <div className="text-text-muted">Workload attestation tokens verified via GCP Cloud Key Management Service.</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-surface-border/50">
              <h4 className="font-bold text-text-primary font-mono uppercase text-[11px]">
                Zero Client-Side Secret Guarantee
              </h4>
              <p className="text-text-secondary leading-relaxed">
                This public frontend client contains <strong>zero LLM API keys, zero encryption secrets, and zero privileged tokens</strong>. All external AI inference is proxied through our data minimization backend service.
              </p>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
