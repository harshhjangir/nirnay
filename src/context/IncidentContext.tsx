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
  TimelineSourceLabel,
  TransactionDetail
} from '../types';
import { DEMO_USER, INITIAL_DEMO_CASES, DEMO_NOTIFICATIONS, DEMO_CASE_1, DEMO_CASE_2, DEMO_CASE_3 } from '../services/mockData';
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
  deleteCase: (caseId: string) => void;
  submitNewCaseFromDraft: () => string; // returns created caseId
  
  // Demo Scenarios Management
  hasActiveDemoSession: boolean;
  activeDemoScenario: 'electricity' | 'airline' | 'telegram' | null;
  loadDemoScenario: (scenario: 'electricity' | 'airline' | 'telegram') => void;
  loadDemoElectricityScenario: () => void;
  loadDemoAirlineScenario: () => void;
  loadDemoTelegramScenario: () => void;
  clearActiveDemoSession: () => void;

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
    city: 'Bengaluru',
    state: 'Karnataka'
  },
  isDirty: false
};

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const CASES_STORAGE_KEY = 'nivaran_cases_v5';
const USER_STORAGE_KEY = 'nivaran_auth_user_v5';
const DRAFT_STORAGE_KEY = 'nivaran_draft_incident_v5';
const NOTIFS_STORAGE_KEY = 'nivaran_notifs_v5';
const DEMO_SESSION_KEY = 'nivaran_demo_active_v5';

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

  // Demo Session Flag (user requested: show demo card on home only if user clicked run demo or created case)
  const [hasActiveDemoSession, setHasActiveDemoSession] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DEMO_SESSION_KEY) === 'true';
    } catch {}
    return false;
  });

  const [activeDemoScenario, setActiveDemoScenario] = useState<'electricity' | 'airline' | 'telegram' | null>('electricity');

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

  useEffect(() => {
    try {
      localStorage.setItem(DEMO_SESSION_KEY, String(hasActiveDemoSession));
    } catch {}
  }, [hasActiveDemoSession]);

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
    setHasActiveDemoSession(true);
    setActiveTab('case_details');
  };

  const deleteCase = (caseId: string) => {
    setCases(prev => {
      const remaining = prev.filter(c => c.caseId !== caseId);
      if (remaining.length === 0) {
        return [DEMO_CASE_1];
      }
      return remaining;
    });
    if (activeCaseId === caseId) {
      const nextRemaining = cases.filter(c => c.caseId !== caseId);
      setActiveCaseId(nextRemaining[0]?.caseId || DEMO_CASE_1.caseId);
    }
    setActiveTab('dashboard');
  };

  // Demo Scenarios Handlers
  const loadDemoScenario = (scenario: 'electricity' | 'airline' | 'telegram') => {
    setActiveDemoScenario(scenario);
    setHasActiveDemoSession(true);
    if (scenario === 'electricity') {
      setCases(prev => [DEMO_CASE_1, ...prev.filter(c => c.caseId !== DEMO_CASE_1.caseId)]);
      setActiveCaseId(DEMO_CASE_1.caseId);
    } else if (scenario === 'airline') {
      setCases(prev => [DEMO_CASE_2, ...prev.filter(c => c.caseId !== DEMO_CASE_2.caseId)]);
      setActiveCaseId(DEMO_CASE_2.caseId);
    } else if (scenario === 'telegram') {
      setCases(prev => [DEMO_CASE_3, ...prev.filter(c => c.caseId !== DEMO_CASE_3.caseId)]);
      setActiveCaseId(DEMO_CASE_3.caseId);
    }
  };

  const loadDemoElectricityScenario = () => {
    loadDemoScenario('electricity');
    setActiveTab('case_details');
  };

  const loadDemoAirlineScenario = () => {
    loadDemoScenario('airline');
    setActiveTab('case_details');
  };

  const loadDemoTelegramScenario = () => {
    loadDemoScenario('telegram');
    setActiveTab('case_details');
  };

  const clearActiveDemoSession = () => {
    setHasActiveDemoSession(false);
  };

  // External References & Responses
  const addExternalReference = (caseId: string, refData: Omit<ExternalReference, 'id' | 'lastUpdated'>) => {
    const newRef: ExternalReference = {
      ...refData,
      id: `ref-${Date.now()}`,
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        const updatedRefs = [...c.externalReferences, newRef];
        const newTimelineEvent = {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          title: `External Reference Added (${refData.authorityName})`,
          description: `Complaint reference ${refData.referenceNumber} recorded for tracking with status: ${refData.statusDisplay}.`,
          actor: 'victim' as const,
          source: `${refData.authorityName} (${refData.referenceNumber})`,
          sourceLabel: 'EXTERNAL RESPONSE' as TimelineSourceLabel,
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

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Reference Added: ${refData.referenceNumber}`,
      message: `Recorded ${refData.authorityName} reference ${refData.referenceNumber} into case ${caseId}.`,
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

  const addCaseResponse = (caseId: string, responseData: Omit<CaseResponse, 'id'>) => {
    const newResponse: CaseResponse = {
      ...responseData,
      id: `resp-${Date.now()}`
    };

    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        const updatedResponses = [newResponse, ...c.responses];
        const newTimelineEvent = {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          title: `Response Received from ${responseData.responder}`,
          description: `${responseData.decision}. Reason: ${responseData.reason}`,
          actor: 'bank' as const,
          source: responseData.responder,
          sourceLabel: 'EXTERNAL RESPONSE' as TimelineSourceLabel,
          urgency: 'warning' as const
        };
        return {
          ...c,
          responses: updatedResponses,
          timeline: [...c.timeline, newTimelineEvent],
          updatedAt: new Date().toISOString(),
          nextAction: {
            title: `Review ${responseData.responder} Response & Escalate`,
            why: responseData.potentialNextAction,
            actionLabel: 'Review Escalation Route',
            actionTab: 'responses',
            urgency: 'critical_now'
          }
        };
      }
      return c;
    }));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Authority Response Logged`,
      message: `${responseData.responder} decision recorded: ${responseData.decision}.`,
      timestamp: 'Just now',
      read: false,
      type: 'response_alert',
      caseId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const resolveEvidenceConflict = (caseId: string, conflictId: string, resolutionNote: string) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        const updatedConflicts = (c.conflicts || []).map(conf => {
          if (conf.id === conflictId) {
            return {
              ...conf,
              status: 'resolved' as const,
              resolutionNote
            };
          }
          return conf;
        });

        const newTimeline = [
          ...c.timeline,
          {
            id: `tl-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            title: 'Evidence Conflict Resolved',
            description: `Conflict on ${conflictId} resolved by user: ${resolutionNote}`,
            actor: 'victim' as const,
            source: 'User confirmation',
            sourceLabel: 'USER CONFIRMED' as TimelineSourceLabel,
            urgency: 'info' as const
          }
        ];

        return {
          ...c,
          conflicts: updatedConflicts,
          timeline: newTimeline,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const addToolResultToCase = (caseId: string, toolResult: NivaranToolResult) => {
    setCases(prev => prev.map(c => {
      if (c.caseId === caseId) {
        const isCritical = (toolResult.verdict as string) === 'REPORTED_IN_NIVARAN' || toolResult.verdict === 'HIGH_RISK_ALERT' || toolResult.verdict === 'POTENTIAL_RISK_SIGNALS';
        const newEvidence: EvidenceItem = {
          id: `ev-tool-${Date.now()}`,
          type: 'tool_output',
          title: `Tool Finding: ${toolResult.toolName}`,
          description: `Analysis result for query: "${toolResult.query}". Summary: ${toolResult.summary}`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          source: toolResult.toolName,
          sourceTypeLabel: 'CASE TOOL',
          status: 'verified',
          relevance: isCritical ? 'critical' : 'supporting',
          extractedData: {
            upiId: toolResult.toolId === 'upi_check' ? toolResult.query : undefined,
            phone: toolResult.toolId === 'phone_check' ? toolResult.query : undefined,
            url: toolResult.toolId === 'url_check' ? toolResult.query : undefined
          }
        };

        const newTimelineEvent = {
          id: `tl-tool-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          title: `Intelligence Added from ${toolResult.toolName}`,
          description: toolResult.summary,
          actor: 'system' as const,
          source: toolResult.toolName,
          sourceLabel: 'DOCUMENT EXTRACTED' as TimelineSourceLabel,
          urgency: 'info' as const
        };

        const newSuspect = toolResult.toolId === 'upi_check' ? {
          id: `susp-${Date.now()}`,
          type: 'upi_id' as const,
          value: toolResult.query,
          source: toolResult.toolName,
          sourceTypeLabel: 'CASE TOOL' as const,
          matchingReportsCount: isCritical ? 17 : 0,
          notes: toolResult.summary
        } : toolResult.toolId === 'phone_check' ? {
          id: `susp-${Date.now()}`,
          type: 'phone_number' as const,
          value: toolResult.query,
          source: toolResult.toolName,
          sourceTypeLabel: 'CASE TOOL' as const,
          matchingReportsCount: isCritical ? 17 : 0,
          notes: toolResult.summary
        } : null;

        return {
          ...c,
          evidence: [...c.evidence, newEvidence],
          timeline: [...c.timeline, newTimelineEvent],
          suspects: newSuspect ? [...c.suspects, newSuspect] : c.suspects,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Tool Intelligence Attached`,
      message: `Findings from ${toolResult.toolName} attached to Case ${caseId}.`,
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

    const timelineEvents = draftIncident.transactions.map((tx, idx) => ({
      id: `tl-gen-${idx}`,
      timestamp: tx.timestamp ? tx.timestamp.slice(11, 16) || '10:00 AM' : '10:00 AM',
      title: `INR ${tx.amount.toLocaleString('en-IN')} transferred via ${tx.paymentMethod}`,
      description: `Debited from ${tx.senderBank} to ${tx.recipientUpiOrAcc}. UTR: ${tx.utrNumber || 'Pending'}`,
      actor: 'victim' as const,
      source: tx.source || 'Payment evidence extraction',
      sourceLabel: 'DOCUMENT EXTRACTED' as TimelineSourceLabel,
      urgency: 'critical' as const
    }));

    const suspects = draftIncident.transactions.map((tx, i) => ({
      id: `susp-gen-${i}`,
      type: 'upi_id' as const,
      value: tx.recipientUpiOrAcc,
      source: 'Extracted Transaction',
      sourceTypeLabel: 'OCR EXTRACTED' as const,
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
        title: 'Call 1930 & Notify Debiting Bank with UTR',
        why: 'Quoting your 12-digit UTR immediately to 1930 enables an inter-bank lien to freeze funds before recipient cash-out.',
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
      whatHappenedSummary: draftIncident.whatHappenedSummary || 'Incident organized via Nivaran evidence-first intake.',
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
          paymentMethod: 'UPI',
          source: 'USER ENTERED',
          confidence: 'medium'
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
          source: 'User description',
          sourceLabel: 'USER REPORTED',
          urgency: 'critical'
        }
      ],
      analysis,
      actions,
      suspects
    };

    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(newCaseId);
    setHasActiveDemoSession(true);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Case ${newCaseId} Initialized`,
      message: `Your fraud case has been created. Next action: Call 1930 with 12-digit UTR ${newCase.transactions[0]?.utrNumber || 'details'}.`,
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
        deleteCase,
        submitNewCaseFromDraft,

        hasActiveDemoSession,
        activeDemoScenario,
        loadDemoScenario,
        loadDemoElectricityScenario,
        loadDemoAirlineScenario,
        loadDemoTelegramScenario,
        clearActiveDemoSession,

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
