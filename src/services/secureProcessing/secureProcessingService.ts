import {
  ExtractedTransactionData,
  extractFromPaymentEvidence
} from '../evidenceExtractorEngine';
import { createDataMinimizedAiPayload, MinimizedAiPayload } from './dataMinimizer';

export type TEEEnvironmentType =
  | 'MOCK_SANDBOX'
  | 'AWS_NITRO_ENCLAVE'
  | 'AZURE_CONFIDENTIAL_VM'
  | 'GCP_CONFIDENTIAL_SPACE';

export interface AttestationStatusReport {
  environment: TEEEnvironmentType;
  environmentName: string;
  isAttested: boolean;
  statusLabel: 'DEMO / ARCHITECTURE MODE' | 'HARDWARE ENCLAVE ATTESTED';
  enclavePcrValid: boolean;
  transportEncryption: 'TLS 1.3' | 'Noise Protocol with Enclave Public Key';
  dataMinimizationActive: boolean;
  memoryIsolationNotice: string;
  deploymentNotes: string;
}

export interface ProcessingStepCallback {
  (step: {
    phase: 'SECURE_TRANSPORT' | 'ISOLATED_DECRYPTION' | 'ENCLAVE_OCR' | 'PII_MINIMIZATION' | 'STRUCTURED_OUTPUT';
    label: string;
    description: string;
    progressPercentage: number;
  }): void;
}

export interface SecureProcessingProvider {
  getProviderName(): string;
  getAttestationReport(): AttestationStatusReport;
  processEvidenceEncrypted(
    filePayload: { fileName: string; rawText?: string; sampleHint?: 'sample_gpay' | 'sample_phonepe' | 'sample_sms' | 'custom' },
    onProgress?: ProcessingStepCallback
  ): Promise<ExtractedTransactionData>;
  minimizeForExternalModel(
    category: string,
    narrative: string,
    extractedData: ExtractedTransactionData
  ): Promise<MinimizedAiPayload>;
}

/**
 * =========================================================================
 * 1. MOCK SECURE PROCESSING PROVIDER (Active in Web Prototype)
 * =========================================================================
 * Represents the isolated processing boundary in this frontend demonstration.
 * In a production deployment, this adapter is swapped with AWS Nitro, Azure,
 * or GCP Confidential Space via backend KMS remote attestation.
 */
export class MockSecureProcessingProvider implements SecureProcessingProvider {
  getProviderName(): string {
    return 'Nivaran Mock Enclave Adapter (Demo / Architecture Mode)';
  }

  getAttestationReport(): AttestationStatusReport {
    return {
      environment: 'MOCK_SANDBOX',
      environmentName: 'Local Secure Processing Adapter (Architecture Demonstration)',
      isAttested: false,
      statusLabel: 'DEMO / ARCHITECTURE MODE',
      enclavePcrValid: false,
      transportEncryption: 'TLS 1.3',
      dataMinimizationActive: true,
      memoryIsolationNotice: 'TEE-backed processing is represented by a provider-neutral boundary in this prototype. Production deployment executes inside hardware-isolated enclaves.',
      deploymentNotes: 'Swap this provider with AWSNitroEnclaveProvider or AzureConfidentialVmProvider in enterprise backend.'
    };
  }

  async processEvidenceEncrypted(
    filePayload: { fileName: string; rawText?: string; sampleHint?: 'sample_gpay' | 'sample_phonepe' | 'sample_sms' | 'custom' },
    onProgress?: ProcessingStepCallback
  ): Promise<ExtractedTransactionData> {
    if (onProgress) {
      onProgress({
        phase: 'SECURE_TRANSPORT',
        label: '1. Transport to Gateway',
        description: 'Payload encrypted in transit via TLS 1.3.',
        progressPercentage: 25
      });
      await new Promise(r => setTimeout(r, 120));

      onProgress({
        phase: 'ISOLATED_DECRYPTION',
        label: '2. Enclave Boundary Decryption',
        description: 'Decrypted inside isolated processing memory space.',
        progressPercentage: 50
      });
      await new Promise(r => setTimeout(r, 140));

      onProgress({
        phase: 'ENCLAVE_OCR',
        label: '3. Protected Parameter Extraction',
        description: 'Parsing amount, UTR reference, and recipient VPA.',
        progressPercentage: 75
      });
      await new Promise(r => setTimeout(r, 120));

      onProgress({
        phase: 'PII_MINIMIZATION',
        label: '4. Data Minimization & Output',
        description: 'Masking unneeded sensitive fields before case return.',
        progressPercentage: 100
      });
      await new Promise(r => setTimeout(r, 100));
    }

    return extractFromPaymentEvidence(
      filePayload.fileName,
      filePayload.rawText,
      filePayload.sampleHint
    );
  }

  async minimizeForExternalModel(
    category: string,
    narrative: string,
    extractedData: ExtractedTransactionData
  ): Promise<MinimizedAiPayload> {
    return createDataMinimizedAiPayload(category, narrative, extractedData);
  }
}

/**
 * =========================================================================
 * 2. AWS NITRO ENCLAVES INTEGRATION STUB
 * =========================================================================
 * Production blueprint for AWS EC2 instances with Nitro Enclaves enabled.
 * Uses vsock communication between parent EC2 instance and isolated enclave.
 */
export class AWSNitroEnclaveProvider implements SecureProcessingProvider {
  getProviderName(): string {
    return 'AWS Nitro Enclaves (Hardware Isolation)';
  }

  getAttestationReport(): AttestationStatusReport {
    return {
      environment: 'AWS_NITRO_ENCLAVE',
      environmentName: 'AWS Nitro Enclave (EIF Image with PCR0-PCR8 Attestation)',
      isAttested: true,
      statusLabel: 'HARDWARE ENCLAVE ATTESTED',
      enclavePcrValid: true,
      transportEncryption: 'Noise Protocol with Enclave Public Key',
      dataMinimizationActive: true,
      memoryIsolationNotice: 'Isolated CPU cores and memory with no external network, no persistent storage, and no interactive shell access.',
      deploymentNotes: 'Enclave image signed with cryptographic measurement (PCR0) registered with AWS KMS for key release.'
    };
  }

  async processEvidenceEncrypted(filePayload: any): Promise<ExtractedTransactionData> {
    throw new Error('AWS Nitro Enclave backend connection requires Nitro-CLI server deployment.');
  }

  async minimizeForExternalModel(category: string, narrative: string, extractedData: ExtractedTransactionData): Promise<MinimizedAiPayload> {
    return createDataMinimizedAiPayload(category, narrative, extractedData);
  }
}

/**
 * =========================================================================
 * 3. AZURE CONFIDENTIAL COMPUTING INTEGRATION STUB
 * =========================================================================
 * Production blueprint for AMD SEV-SNP / Intel SGX Confidential VMs on Azure.
 */
export class AzureConfidentialVmProvider implements SecureProcessingProvider {
  getProviderName(): string {
    return 'Azure Confidential Computing (AMD SEV-SNP / Intel SGX)';
  }

  getAttestationReport(): AttestationStatusReport {
    return {
      environment: 'AZURE_CONFIDENTIAL_VM',
      environmentName: 'Microsoft Azure Attestation (MAA) with AMD SEV-SNP Hardware Encryption',
      isAttested: true,
      statusLabel: 'HARDWARE ENCLAVE ATTESTED',
      enclavePcrValid: true,
      transportEncryption: 'Noise Protocol with Enclave Public Key',
      dataMinimizationActive: true,
      memoryIsolationNotice: 'Full memory encryption using hardware-generated keys in memory controller invisible to cloud hypervisor.',
      deploymentNotes: 'Attestation tokens verified against Microsoft Azure Attestation service.'
    };
  }

  async processEvidenceEncrypted(filePayload: any): Promise<ExtractedTransactionData> {
    throw new Error('Azure Confidential Computing backend requires Azure Confidential VM deployment.');
  }

  async minimizeForExternalModel(category: string, narrative: string, extractedData: ExtractedTransactionData): Promise<MinimizedAiPayload> {
    return createDataMinimizedAiPayload(category, narrative, extractedData);
  }
}

/**
 * Singleton instance of the active secure processing service
 */
export const secureProcessingService: SecureProcessingProvider = new MockSecureProcessingProvider();
