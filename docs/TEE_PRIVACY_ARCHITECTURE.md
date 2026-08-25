# NIVARAN: Confidential Computing & TEE Privacy Architecture

## 1. Executive Summary

Financial cybercrime first-response platforms handle some of the most sensitive digital artifacts a citizen possesses:
* Bank transaction receipts with 12-digit UTR numbers
* Full or masked bank account numbers and IFSC codes
* Virtual Payment Addresses (VPAs) and phone numbers
* Threat chat transcripts (WhatsApp, SMS, Telegram)
* Personal identity references (NCRP acknowledgement slips, police complaint copies)

The **NIVARAN Privacy & Processing Architecture** is engineered to decouple sensitive evidence extraction and intelligence reasoning from untrusted frontend or multi-tenant infrastructure using **Trusted Execution Environment (TEE) / Confidential Computing** principles and strict **Data Minimization**.

---

## 2. Core Architecture & Processing Boundary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                                │
│  • Public static interface (GitHub Pages)                               │
│  • Client-side validation & progressive disclosure                      │
│  • ZERO secret keys / ZERO LLM API tokens in client code               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Encrypted HTTPS / TLS 1.3
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    NIVARAN SECURE PROCESSING GATEWAY                    │
│  • API endpoint & transport routing                                     │
│  • Rate limiting & DoS defense                                          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Attested Secure Channel (vsock)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│        TRUSTED EXECUTION ENVIRONMENT (TEE) / HARDWARE ENCLAVE           │
│  (AWS Nitro Enclave / Azure AMD SEV-SNP / GCP Confidential Space)       │
│                                                                         │
│  ┌─────────────────────────┐      ┌──────────────────────────────────┐  │
│  │ 1. Isolated In-Memory   │ ───► │ 2. Parameter Extraction & OCR   │  │
│  │    Payload Decryption   │      │    (Amount, UTR, VPA, Bank)      │  │
│  └─────────────────────────┘      └────────────────┬─────────────────┘  │
│                                                    ▼                    │
│  ┌─────────────────────────┐      ┌──────────────────────────────────┐  │
│  │ 4. Structured Output    │ ◄─── │ 3. PII Redaction & Data          │  │
│  │    Generation           │      │    Minimization Pipeline         │  │
│  └─────────────────────────┘      └──────────────────────────────────┘  │
│                                                                         │
│  • Memory isolation: Cryptographically encrypted in RAM                 │
│  • Zero persistent storage: Artifacts purged upon execution completion  │
│  • No external network access or interactive shell inside enclave       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Minimized Representation Only
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  EXTERNAL AI / LLM REASONING LAYER                      │
│  • Receives ONLY minimized structured feature representations           │
│  • NEVER receives raw images, unmasked account numbers, or OTPs         │
│  • Returns structured pattern classification                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Threat Model & Protections

| Threat Vector | Traditional Risk | NIVARAN TEE Mitigation |
| :--- | :--- | :--- |
| **Hypervisor / Host Admin Compromise** | Malicious cloud admins inspect VM memory | Hardware memory encryption (AMD SEV-SNP / Nitro) makes RAM unreadable to hypervisors. |
| **Raw Document Storage Breaches** | Unencrypted screenshots stored on S3/DB | Raw evidence is processed entirely in ephemeral enclave memory and purged after structured extraction. |
| **Third-Party AI Data Leakage** | Full bank statements sent to public LLM APIs | Data minimization strips PII, sending only structured numerical facts (e.g. `Amount: 18500, RedFlag: Urgency`). |
| **Credential Hijacking (OTP/PIN)** | Scammers steal 2FA credentials | Hard regex filter sanitizes and strictly rejects OTPs or UPI PINs from case dossiers. |

---

## 4. Cryptographic Remote Attestation & Key Release

In production deployment, the enclave must cryptographically prove its software integrity before decrypting user files:

1. **Attestation Document Generation**: The hardware security processor generates an attestation document containing cryptographic hash measurements of the enclave image (PCR0: Enclave Image Hash, PCR1: Kernel Hash, PCR2: App Hash).
2. **KMS Policy Verification**: The Cloud Key Management Service (AWS KMS, Azure Key Vault, or GCP Cloud KMS) validates that the PCR measurements match the authorized NIVARAN release build.
3. **Attested Key Release**: KMS releases the private decryption key exclusively to the attested enclave memory via a secure hardware channel.
4. **Ephemerality**: Once processing completes, memory is zeroed out.

---

## 5. Data Minimization Protocol

NIVARAN enforces a strict 4-stage minimization pipeline before any AI reasoning occurs:

```typescript
// 1. Account Number Masking
maskAccountNumber("50100492819104") -> "•••• 9104"

// 2. Mobile Phone Masking
maskPhoneNumber("+91 98451 92837") -> "+91 ••••••2837"

// 3. Prohibited Secrets Sanitization
// Strictly rejects OTPs, passwords, and UPI PINs
sanitizeAndFilterProhibitedSecrets(rawText) -> [REDACTED_AUTHENTICATION_OTP]

// 4. Minimized AI Payload
createDataMinimizedAiPayload(category, narrative, extractedData)
```

External LLM models receive only the sanitized feature vector:
```json
{
  "caseCategory": "upi_fraud",
  "disputedAmount": 18500,
  "currency": "INR",
  "senderBank": "HDFC Bank",
  "maskedAccount": "•••• 9104",
  "recipientUpiDomain": "@okaxis",
  "utrPresent": true,
  "identifiedRedFlags": ["artificial_urgency", "utility_impersonation"],
  "evidenceCount": 2
}
```

---

## 6. Prototype vs. Production Status

| Dimension | Web Application Prototype (Demo Mode) | Production Enterprise Deployment |
| :--- | :--- | :--- |
| **Execution Layer** | Provider-Neutral `MockSecureProcessingProvider` | Hardware-backed `AWSNitroEnclaveProvider` / `AzureConfidentialVmProvider` |
| **Attestation Status** | `DEMO / ARCHITECTURE MODE` | `HARDWARE ENCLAVE ATTESTED` (PCR0 Verified) |
| **Secret Management** | Client contains zero secret keys | AWS Secrets Manager / Azure Key Vault via Attested KMS |
| **Memory Isolation** | Sandboxed JavaScript execution boundary | Hardware-level memory encryption (AMD SEV-SNP / Intel SGX) |
| **PII Minimization** | Fully functional in `dataMinimizer.ts` | Fully functional inside hardware enclave boundary |

---

## 7. Zero Client-Side Secret Policy

The frontend repository contains:
* **NO** OpenAI, Anthropic, or Google API keys (`VITE_OPENAI_KEY`, etc. are prohibited).
* **NO** Enclave private keys or KMS access credentials.
* **NO** Backend database master passwords.

All privileged operations are mediated through authenticated backend endpoints.
