import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuthUser,
  CaseReadiness,
  CaseResponse,
  EvidenceConflict,
  EvidenceItem,
  ExternalReference,
  FraudCategory,
  IncidentCase,
  NivaranToolResult,
  NotificationItem,
  TransactionDetail
} from '../types';
import { DEMO_USER, INITIAL_DEMO_CASES, DEMO_NOTIFICATIONS } from '../services/mockData';
import { analyzeIncident, generateActionPlan } from '../services/incidentAnalysisEngine';
import { calculateCaseReadiness } from '../services/caseReadinessEngine';
import { evaluateEvidenceConsistency, ConsistencyCheckResult } from '../services/evidenceConsistencyEngine';
import { findMatchingCampaign } from '../services/fraudNetworkEngine';
import { generateGenericEscalationLadder } from '../services/responseInterpreterEngine';

export interface DraftIncidentData {
  category: FraudCategory;
  whatHappenedSummary: string;
  transactions: TransactionDetail[];
  evidence: EvidenceItem[];
  complainant: {
    name: string;
    phone: string;
    email: string;
    city: string;
    state: string;
  };
  isDirty: boolean;
}

interface IncidentContextType {
  // Authentication
  user: AuthUser | null;
  isLoginModalOpen: boolean;
  openLoginModal: (redirectTab?: string) => void;
  closeLoginModal: () => void;
  loginUser: (emailOrPhone: string, name?: string) => void;
  logoutUser: () => void;
  loginAsDemo: () => void;

  // Case Management
  cases: IncidentCase[];
  activeCaseId: string;
  activeCase: IncidentCase;
  selectCase: (caseId: string) => void;
  submitNewCaseFromDraft: () => string; // returns created caseId

  // Live Case Intelligence
  caseReadiness: CaseReadiness;
  consistencyResult: ConsistencyCheckResult;

  // External References & Responses
  addExternalReference: (caseId: string, ref: Omit<ExternalReference, 'id' | 'lastUpdated'>) => void;
  removeExternalReference: (caseId: string, refId: string) => void;
  addCaseResponse: (caseId: string, response: Omit<CaseResponse, 'id'>) => void;
  resolveEvidenceConflict: (caseId: string, conflictId: string, resolutionNote: string) => void;
  addToolResultToCase: (caseId: string, toolResult: NivaranToolResult) => void;
  updateCaseNotes: (caseId: string, notes: string) => void;

  // Draft Intake Wizard
  draftIncident: DraftIncidentData;
  updateDraft: (updates: Partial<DraftIncidentData>) => void;
  addDraftTransaction: (tx: Omit<TransactionDetail, 'id'>) => void;
  removeDraftTransaction: (id: string) => void;
  addDraftEvidence: (ev: Omit<EvidenceItem, 'id'>) => void;
  removeDraftEvidence: (id: string) => void;
  resetDraft: () => void;
  intakeStep: number;
  setIntakeStep: (step: number) => void;

  // Navigation & Privacy Settings
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMasked: boolean;
  toggleMasking: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;

  // Public Tracking
  findCaseForTracking: (caseId: string, phoneOrEmail: string) => IncidentCase | null;
  toggleActionStatus: (caseId: string, actionId: string) => void;
}

const initialDraftState: DraftIncidentData = {
  category: 'upi_fraud',
  whatHappenedSummary: '',
  transactions: [],
  evidence: [],
  complainant: {
    name: '',
    phone: '',
    email: '',
    city: '',
    state: ''
  },
  isDirty: false
};

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const CASES_STORAGE_KEY = 'nivaran_cases_v3';
const USER_STORAGE_KEY = 'nivaran_auth_user_v3';
const DRAFT_STORAGE_KEY = 'nivaran_draft_incident_v3';
const NOTIFS_STORAGE_KEY = 'nivaran_notifs_v3';

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth State
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_USER;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirectTab, setLoginRedirectTab] = useState<string | null>(null);

  // 2. Cases State
  const [cases, setCases] = useState<IncidentCase[]>(() => {
    try {
      const saved = localStorage.getItem(CASES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEMO_CASES;
  });

  const [activeCaseId, setActiveCaseId] = useState<string>(() => {
    return cases[0]?.caseId || 'NVR-2026-00124';
  });

  // 3. Draft Incident State
  const [draftIncident, setDraftIncident] = useState<DraftIncidentData>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialDraftState;
  });

  const [intakeStep, setIntakeStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMasked, setIsMasked] = useState<boolean>(true);

  // 4. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_NOTIFICATIONS;
  });

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
    } catch {}
  }, [cases]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftIncident));
    } catch {}
  }, [draftIncident]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Derived Active Case
  const activeCase = cases.find(c => c.caseId === activeCaseId) || cases[0] || INITIAL_DEMO_CASES[0];

  // Derived Live Case Intelligence
  const caseReadiness = calculateCaseReadiness(activeCase);
  const consistencyResult = evaluateEvidenceConsistency(activeCase.transactions, activeCase.evidence, activeCase.conflicts);

  // Auth methods
  const openLoginModal = (redirectTab?: string) => {
    if (redirectTab) setLoginRedirectTab(redirectTab);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginRedirectTab(null);
  };

  const loginUser = (emailOrPhone: string, name?: string) => {
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: name || (emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Citizen User'),
      email: emailOrPhone.includes('@') ? emailOrPhone : 'citizen@example.com',
      phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98450 00000',
      isDemo: false,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    closeLoginModal();
    if (loginRedirectTab) {
      setActiveTab(loginRedirectTab);
    } else {
      setActiveTab('dashboard');
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    closeLoginModal();
    if (loginRedirectTab) {
      setActiveTab(loginRedirectTab);
    } else {
      setActiveTab('dashboard');
    }
  };

  const logoutUser = () => {
    setUser(null);
    setActiveTab('home');
  };

  // Case Selection
  const selectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setActiveTab('case_details');
  };

  // External Reference Management
  const addExternalReference = (caseId: string, refData: Omit<ExternalReference, 'id' | 'lastUpdated'>) => {
    const newRef: ExternalReference = {
      ...refData,
      id: `ref-${Date.now()}`,
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        const updatedRefs = [...c.externalReferences, newRef];
        const newTimelineEvent = {
          id: `tl-ref-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          title: `External Reference Added: ${refData.authorityName} (${refData.referenceNumber})`,
          description: `Status: ${refData.statusDisplay}. Recorded under case file.`,
          actor: 'authority' as const,
          source: 'User entered external reference',
          urgency: 'info' as const
        };

        return {
          ...c,
          externalReferences: updatedRefs,
          timeline: [...c.timeline, newTimelineEvent],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Reference ${refData.referenceNumber} Attached to Case`,
      message: `${refData.authorityName} complaint reference is now tracked in your case dossier.`,
      timestamp: 'Just now',
      read: false,
      type: 'status_change',
      caseId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const removeExternalReference = (caseId: string, refId: string) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        return {
          ...c,
          externalReferences: c.externalReferences.filter(r => r.id !== refId),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  // Case Response Management (Response Interpreter)
  const addCaseResponse = (caseId: string, responseData: Omit<CaseResponse, 'id'>) => {
    const newResponse: CaseResponse = {
      ...responseData,
      id: `resp-${Date.now()}`
    };

    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        const updatedResponses = [...c.responses, newResponse];
        const newTimelineEvent = {
          id: `tl-resp-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          title: `Response Received from ${responseData.responder}`,
          description: responseData.decision,
          actor: 'bank' as const,
          source: 'Imported from bank / authority response',
          urgency: 'warning' as const
        };

        return {
          ...c,
          responses: updatedResponses,
          timeline: [...c.timeline, newTimelineEvent],
          nextAction: {
            title: responseData.potentialNextAction,
            why: responseData.plainSummary,
            actionLabel: 'Escalate to Next Level',
            actionTab: 'escalation',
            urgency: 'high_now' as const
          },
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Response Interpreted from ${responseData.responder}`,
      message: responseData.decision,
      timestamp: 'Just now',
      read: false,
      type: 'response_alert',
      caseId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Resolve Evidence Conflict
  const resolveEvidenceConflict = (caseId: string, conflictId: string, resolutionNote: string) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        return {
          ...c,
          conflicts: c.conflicts.map(conf => conf.id === conflictId ? { ...conf, status: 'resolved', resolutionNote } : conf),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  // Mini Tool Result Injection into Case
  const addToolResultToCase = (caseId: string, toolResult: NivaranToolResult) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        const updatedSuspects = [...c.suspects];
        const updatedEvidence = [...c.evidence];
        const updatedTransactions = [...c.transactions];

        // 1. If tool extracted a suspect identifier (UPI, phone, URL)
        if (toolResult.extractedData?.upiId && !updatedSuspects.some(s => s.value.toLowerCase() === toolResult.extractedData!.upiId!.toLowerCase())) {
          updatedSuspects.push({
            id: `susp-${Date.now()}`,
            type: 'upi_id',
            value: toolResult.extractedData.upiId,
            source: toolResult.toolName,
            matchingReportsCount: toolResult.verdict === 'HIGH_RISK_ALERT' ? 17 : 0,
            notes: toolResult.summary
          });
        }

        if (toolResult.extractedData?.phoneNumber && !updatedSuspects.some(s => s.value.includes(toolResult.extractedData!.phoneNumber!))) {
          updatedSuspects.push({
            id: `susp-ph-${Date.now()}`,
            type: 'phone_number',
            value: toolResult.extractedData.phoneNumber,
            source: toolResult.toolName,
            notes: toolResult.summary
          });
        }

        if (toolResult.extractedData?.url && !updatedSuspects.some(s => s.value.includes(toolResult.extractedData!.url!))) {
          updatedSuspects.push({
            id: `susp-url-${Date.now()}`,
            type: 'website_url',
            value: toolResult.extractedData.url,
            source: toolResult.toolName,
            notes: toolResult.summary
          });
        }

        // 2. If tool parsed a transaction (SMS parser)
        if (toolResult.toolId === 'sms_parser' && toolResult.extractedData?.amount) {
          updatedTransactions.push({
            id: `tx-${Date.now()}`,
            amount: toolResult.extractedData.amount,
            currency: 'INR',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            senderBank: toolResult.extractedData.bank || 'HDFC Bank',
            senderAccountMasked: toolResult.extractedData.senderAccountMasked || '9104',
            recipientUpiOrAcc: toolResult.extractedData.upiId || 'discom.billupdate.982@okaxis',
            utrNumber: toolResult.extractedData.utrNumber || '423719820491',
            paymentApp: 'Google Pay',
            paymentMethod: 'UPI',
            notes: 'Imported from Bank SMS Parser'
          });
        }

        // 3. Attach as Evidence Item
        updatedEvidence.push({
          id: `ev-tool-${Date.now()}`,
          type: toolResult.toolId === 'sms_parser' ? 'sms_text' : toolResult.toolId === 'qr_check' ? 'qr_code' : 'url_link',
          title: `${toolResult.toolName} Result`,
          description: toolResult.summary,
          timestamp: toolResult.timestamp,
          source: `Nivaran Tool (${toolResult.toolName})`,
          status: 'verified',
          relevance: 'critical',
          extractedData: toolResult.extractedData
        });

        // 4. Add Timeline Event with source attribution
        const timelineEvent = {
          id: `tl-tool-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          title: `Intelligence Added from ${toolResult.toolName}`,
          description: toolResult.summary,
          actor: 'system' as const,
          source: `From ${toolResult.toolName}`,
          urgency: 'info' as const
        };

        const updatedCampaign = findMatchingCampaign(updatedSuspects);

        return {
          ...c,
          suspects: updatedSuspects,
          evidence: updatedEvidence,
          transactions: updatedTransactions,
          timeline: [...c.timeline, timelineEvent],
          connectedCampaign: updatedCampaign || c.connectedCampaign,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Intelligence Attached: ${toolResult.toolName}`,
      message: `Extracted parameters from ${toolResult.toolName} have been added to Case ${caseId}.`,
      timestamp: 'Just now',
      read: false,
      type: 'evidence_alert',
      caseId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateCaseNotes = (caseId: string, notes: string) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        return { ...c, userNotes: notes, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  // Draft Management
  const updateDraft = (updates: Partial<DraftIncidentData>) => {
    setDraftIncident(prev => ({
      ...prev,
      ...updates,
      isDirty: true
    }));
  };

  const addDraftTransaction = (txData: Omit<TransactionDetail, 'id'>) => {
    const newTx: TransactionDetail = {
      ...txData,
      id: `tx-${Date.now()}`
    };
    setDraftIncident(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTx],
      isDirty: true
    }));
  };

  const removeDraftTransaction = (id: string) => {
    setDraftIncident(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
      isDirty: true
    }));
  };

  const addDraftEvidence = (evData: Omit<EvidenceItem, 'id'>) => {
    const newEv: EvidenceItem = {
      ...evData,
      id: `ev-${Date.now()}`
    };
    setDraftIncident(prev => ({
      ...prev,
      evidence: [...prev.evidence, newEv],
      isDirty: true
    }));
  };

  const removeDraftEvidence = (id: string) => {
    setDraftIncident(prev => ({
      ...prev,
      evidence: prev.evidence.filter(e => e.id !== id),
      isDirty: true
    }));
  };

  const resetDraft = () => {
    setDraftIncident(initialDraftState);
    setIntakeStep(1);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
  };

  // Submit Draft to Create a Real Case
  const submitNewCaseFromDraft = (): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newCaseId = `NVR-2026-${randomNum}`;
    const nowIso = new Date().toISOString();
    const nowReadable = `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

    // Run deterministic analysis
    const analysis = analyzeIncident({
      category: draftIncident.category,
      whatHappened: draftIncident.whatHappenedSummary,
      transactions: draftIncident.transactions,
      evidence: draftIncident.evidence
    });

    const actions = generateActionPlan(
      draftIncident.category,
      draftIncident.transactions,
      analysis
    );

    // Build timeline events from transactions with clear source
    const timelineEvents = draftIncident.transactions.map((tx, idx) => ({
      id: `tl-gen-${idx}`,
      timestamp: tx.timestamp ? tx.timestamp.slice(11, 16) || '10:00 AM' : '10:00 AM',
      title: `INR ${tx.amount.toLocaleString('en-IN')} debited via ${tx.paymentMethod}`,
      description: `Debited from ${tx.senderBank} to ${tx.recipientUpiOrAcc}. UTR: ${tx.utrNumber || 'Pending'}`,
      actor: 'victim' as const,
      source: 'From user entered transaction details',
      urgency: 'critical' as const
    }));

    // Build suspects from recipient VPAs
    const suspects = draftIncident.transactions.map((tx, i) => ({
      id: `susp-gen-${i}`,
      type: 'upi_id' as const,
      value: tx.recipientUpiOrAcc,
      source: 'Transaction Details',
      matchingReportsCount: tx.recipientUpiOrAcc.includes('discom.billupdate') ? 17 : 0,
      notes: `Beneficiary handle for transaction #${i + 1}`
    }));

    const connectedCampaign = findMatchingCampaign(suspects);

    const newCase: IncidentCase = {
      caseId: newCaseId,
      userId: user?.id,
      createdAt: nowIso,
      updatedAt: nowIso,
      isDemo: false,
      statusProgress: 'incident_reported',
      nextAction: {
        title: 'Call 1930 and Notify Your Bank Fraud Cell',
        why: 'Quoting your 12-digit UTR immediately to 1930 enables an inter-bank lien to freeze funds before recipient withdrawal.',
        actionLabel: 'View Emergency 1930 Script',
        actionTab: 'actions',
        urgency: 'critical_now'
      },
      progressTimeline: [
        {
          step: 1,
          label: 'Incident Reported',
          timestamp: nowReadable,
          completed: true,
          description: 'Incident submitted and Case ID generated on NIVARAN platform.'
        },
        {
          step: 2,
          label: 'Information Verified',
          timestamp: 'In Progress',
          completed: false,
          isCurrent: true,
          description: 'Validating UTR and banking parameters for 1930 / I4C transmission.'
        },
        {
          step: 3,
          label: 'Complaint Forwarded',
          timestamp: 'Pending',
          completed: false,
          description: 'Forwarding to Bank Nodal Cell & Cybercrime Reporting network.'
        },
        {
          step: 4,
          label: 'Under Investigation',
          timestamp: 'Pending',
          completed: false,
          description: 'Inter-bank lien and recipient account freeze coordination.'
        },
        {
          step: 5,
          label: 'Action / Resolution',
          timestamp: 'Pending',
          completed: false,
          description: 'Bank dispute adjudication and recovery resolution.'
        },
        {
          step: 6,
          label: 'Closed',
          timestamp: 'Pending',
          completed: false,
          description: 'Formal case archival.'
        }
      ],
      externalReferences: [],
      responses: [],
      conflicts: [],
      connectedCampaign,
      escalationLadder: generateGenericEscalationLadder(draftIncident.transactions[0]?.senderBank || 'HDFC Bank'),
      category: draftIncident.category,
      whatHappenedSummary: draftIncident.whatHappenedSummary || 'Incident submitted via NIVARAN intake wizard.',
      complainant: {
        name: draftIncident.complainant.name || user?.name || 'Citizen Complainant',
        phone: draftIncident.complainant.phone || user?.phone || '',
        email: draftIncident.complainant.email || user?.email || '',
        city: draftIncident.complainant.city || 'Bengaluru',
        state: draftIncident.complainant.state || 'Karnataka'
      },
      transactions: draftIncident.transactions.length > 0 ? draftIncident.transactions : [
        {
          id: `tx-${Date.now()}`,
          amount: 18500,
          currency: 'INR',
          timestamp: nowReadable,
          senderBank: 'HDFC Bank',
          senderAccountMasked: '9104',
          recipientUpiOrAcc: 'discom.billupdate.982@okaxis',
          utrNumber: '423719820491',
          paymentApp: 'Google Pay',
          paymentMethod: 'UPI'
        }
      ],
      evidence: draftIncident.evidence,
      timeline: timelineEvents.length > 0 ? timelineEvents : [
        {
          id: 'tl-1',
          timestamp: 'Recent',
          title: 'Unauthorized Transaction Executed',
          description: 'Funds debited from primary account under deceptive circumstances.',
          actor: 'victim',
          source: 'From user description',
          urgency: 'critical'
        }
      ],
      analysis,
      actions,
      suspects
    };

    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(newCaseId);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Case ${newCaseId} Created Successfully`,
      message: `Your incident report has been registered. Next step: Call 1930 with UTR ${newCase.transactions[0]?.utrNumber || 'details'}.`,
      timestamp: nowReadable,
      read: false,
      type: 'status_change',
      caseId: newCaseId
    };
    setNotifications(prev => [newNotif, ...prev]);

    resetDraft();
    return newCaseId;
  };

  const toggleActionStatus = (caseId: string, actionId: string) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        return {
          ...c,
          actions: c.actions.map(a => a.id === actionId ? { ...a, completed: !a.completed } : a),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleMasking = () => {
    setIsMasked(prev => !prev);
  };

  // Public case finder
  const findCaseForTracking = (caseId: string, phoneOrEmail: string): IncidentCase | null => {
    const cleanCaseId = caseId.trim().toUpperCase();
    const cleanContact = phoneOrEmail.trim().toLowerCase().replace(/[\s\+\-]/g, '');

    const found = cases.find(c => {
      const matchId = c.caseId.toUpperCase() === cleanCaseId;
      if (!matchId) return false;

      const compPhone = (c.complainant.phone || '').toLowerCase().replace(/[\s\+\-]/g, '');
      const compEmail = (c.complainant.email || '').toLowerCase();
      
      return compPhone.includes(cleanContact) || compEmail.includes(cleanContact) || cleanContact.length >= 4;
    });

    return found || null;
  };

  return (
    <IncidentContext.Provider
      value={{
        user,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginUser,
        logoutUser,
        loginAsDemo,

        cases,
        activeCaseId,
        activeCase,
        selectCase,
        submitNewCaseFromDraft,

        caseReadiness,
        consistencyResult,

        addExternalReference,
        removeExternalReference,
        addCaseResponse,
        resolveEvidenceConflict,
        addToolResultToCase,
        updateCaseNotes,

        draftIncident,
        updateDraft,
        addDraftTransaction,
        removeDraftTransaction,
        addDraftEvidence,
        removeDraftEvidence,
        resetDraft,
        intakeStep,
        setIntakeStep,

        activeTab,
        setActiveTab,
        isMasked,
        toggleMasking,

        notifications,
        markNotificationRead,
        unreadCount,

        findCaseForTracking,
        toggleActionStatus
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};
