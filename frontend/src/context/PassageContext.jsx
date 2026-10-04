import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_CASES } from '../data/cases';

const PassageContext = createContext(null);

export const PassageProvider = ({ children }) => {
  const [caseKey, setCaseKey] = useState('case1');
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'plan' | 'drafts' | 'tracker' | 'inbox' | 'escalation' | 'resolved'
  const [activeRole, setActiveRole] = useState('user'); // 'user' | org slug

  // Current case base config
  const activeCase = DEMO_CASES[caseKey];

  // Dynamic state
  const [narrative, setNarrative] = useState(activeCase.narrative);
  const [organizations, setOrganizations] = useState(activeCase.organizations);
  const [drafts, setDrafts] = useState(activeCase.drafts);
  const [evidenceList, setEvidenceList] = useState(activeCase.evidenceList);
  
  // Disclosure toggles: orgSlug -> [evId, ...]
  const [orgEvidenceSelection, setOrgEvidenceSelection] = useState(() => {
    const initial = {};
    activeCase.organizations.forEach(org => {
      initial[org.slug] = [...(org.allowedEvidence || [])];
    });
    return initial;
  });

  const [relayConsent, setRelayConsent] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState(activeCase.initialEvents);
  const [pendingQuestion, setPendingQuestion] = useState(activeCase.question);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isEscalated, setIsEscalated] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);

  // Sync state whenever caseKey changes
  useEffect(() => {
    const c = DEMO_CASES[caseKey];
    setNarrative(c.narrative);
    setOrganizations(c.organizations);
    setDrafts(c.drafts);
    setEvidenceList(c.evidenceList);
    
    const initial = {};
    c.organizations.forEach(org => {
      initial[org.slug] = [...(org.allowedEvidence || [])];
    });
    setOrgEvidenceSelection(initial);

    setTimelineEvents(c.initialEvents);
    setPendingQuestion(c.question);
    setAnsweredQuestions([]);
    setIsEscalated(false);
    setIsResolved(false);
    setCurrentScreen('start');
    setActiveRole('user');
  }, [caseKey]);

  // Helper to generate realistic SHA-256 hash stamp
  const generateHash = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
  };

  // Add file evidence
  const addEvidence = (files) => {
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map((file, idx) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const type = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
        ? 'photo'
        : ['pdf', 'doc', 'docx', 'txt'].includes(ext)
        ? 'invoice'
        : 'chat';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = sizeMb === '0.0' ? `${(file.size / 1024).toFixed(0)} KB` : `${sizeMb} MB`;
      return {
        id: `ev-uploaded-${Date.now()}-${idx}`,
        name: file.name,
        type: type,
        size: sizeStr
      };
    });

    setEvidenceList(prev => [...prev, ...newItems]);
  };

  // Remove file evidence
  const removeEvidence = (evId) => {
    setEvidenceList(prev => prev.filter(e => e.id !== evId));
  };

  // Switch demo case
  const switchCase = (newKey) => {
    if (DEMO_CASES[newKey]) {
      setCaseKey(newKey);
    }
  };

  // Compile narrative into structured Passage
  const compilePassage = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      // Add event to chain
      setTimelineEvents(prev => [
        ...prev,
        {
          id: `evt-${Date.now()}`,
          timestamp: `Today • ${getTimeString()}`,
          type: "compiled",
          title: "AI Compilation Completed (Local Gemma 4)",
          desc: "Extracted entities, verified timeline, and organized evidence policy.",
          hash: generateHash(),
          author: "Gemma 4 (Local Ollama Engine)"
        }
      ]);
      setCurrentScreen('plan');
    }, 700);
  };

  // Toggle evidence for specific organization
  const toggleEvidenceForOrg = (orgSlug, evId) => {
    setOrgEvidenceSelection(prev => {
      const current = prev[orgSlug] || [];
      const updated = current.includes(evId)
        ? current.filter(id => id !== evId)
        : [...current, evId];
      return { ...prev, [orgSlug]: updated };
    });
  };

  // Move from Plan to Drafts review
  const proceedToDrafts = () => {
    setCurrentScreen('drafts');
  };

  // Approve & Dispatch at Consent Gate
  const approveAndDispatch = () => {
    setIsDispatching(true);
    setShowHandoverModal(true);

    setTimeout(() => {
      setIsDispatching(false);
      setShowHandoverModal(false);

      // Create dispatch events
      const nowTime = `Today • ${getTimeString()}`;
      const newEvents = [
        {
          id: `evt-consent-${Date.now()}`,
          timestamp: nowTime,
          type: "consent_gate",
          title: "Consent Gate Approval Executed",
          desc: `User approved filing across ${organizations.length} organizations. Selective disclosure rules sealed in hash chain.`,
          hash: generateHash(),
          author: `${activeCase.user.name} (Digital Authorization)`
        },
        ...organizations.map(org => ({
          id: `evt-disp-${org.slug}-${Date.now()}`,
          timestamp: nowTime,
          type: "dispatched",
          title: `Ticket Filed: ${org.name} (${org.ticketRef})`,
          desc: `Dispatched via ${org.channel}. Included ${orgEvidenceSelection[org.slug]?.length || 0} approved documents.`,
          hash: generateHash(),
          author: "Passage Dispatch Engine"
        }))
      ];

      // If case 1, show reference passing
      if (caseKey === 'case1') {
        newEvents.push({
          id: `evt-ref-pass-${Date.now()}`,
          timestamp: nowTime,
          type: "reference_passed",
          title: "Cross-Reference Injected",
          desc: "Sahyadri claim ref #SHG-CLM-8821 automatically bound into SwiftRoute inspection ticket #SR-INSP-4019.",
          hash: generateHash(),
          author: "Passage Dependency Resolver"
        });
      }

      setTimelineEvents(prev => [...prev, ...newEvents]);
      setCurrentScreen('tracker');
    }, 1500);
  };

  // Answer a question from receiving organization
  const answerQuestion = (selectedOption) => {
    if (!pendingQuestion) return;

    const answered = {
      ...pendingQuestion,
      selectedAnswer: selectedOption,
      answeredAt: `Today • ${getTimeString()}`
    };

    setAnsweredQuestions(prev => [...prev, answered]);
    setPendingQuestion(null);

    // Add relay event to timeline
    setTimelineEvents(prev => [
      ...prev,
      {
        id: `evt-answer-${Date.now()}`,
        timestamp: `Today • ${getTimeString()}`,
        type: "question_answered",
        title: `Question Answered & Relayed to ${answered.orgName}`,
        desc: `Response: "${selectedOption}". Relayed without exposing unconsented profile data.`,
        hash: generateHash(),
        author: `${activeCase.user.name} (Direct Single-Submission)`
      }
    ]);

    // Return to tracker
    setCurrentScreen('tracker');
  };

  // Trigger or fast forward SLA escalation
  const triggerEscalation = () => {
    setIsEscalated(true);
    setTimelineEvents(prev => [
      ...prev,
      {
        id: `evt-esc-${Date.now()}`,
        timestamp: `Today • ${getTimeString()}`,
        type: "sla_escalation",
        title: `SLA Fast-Forward: Escalation Drafted to ${activeCase.escalation.targetOrg}`,
        desc: `Triggered by SLA timer expiry. Case dossier packaged under ${activeCase.escalation.statute}.`,
        hash: generateHash(),
        author: "Passage SLA Monitor"
      }
    ]);
  };

  // Authorize Escalation
  const authorizeEscalationFiling = () => {
    setTimelineEvents(prev => [
      ...prev,
      {
        id: `evt-esc-filed-${Date.now()}`,
        timestamp: `Today • ${getTimeString()}`,
        type: "escalation_filed",
        title: `Formal Grievance Filed with ${activeCase.escalation.targetOrg}`,
        desc: `Authorization confirmed by ${activeCase.user.name}. Digital docket forwarded with full audit trail.`,
        hash: generateHash(),
        author: "Passage Escalation Engine"
      }
    ]);
    setCurrentScreen('tracker');
  };

  // Step simulation forward
  const simulateNextStep = () => {
    if (pendingQuestion) {
      setCurrentScreen('inbox');
      return;
    }

    if (!isResolved) {
      // Resolve case
      setIsResolved(true);
      const res = activeCase.resolvedOutcome;
      setTimelineEvents(prev => [
        ...prev,
        {
          id: `evt-insp-${Date.now()}`,
          timestamp: `Today • ${getTimeString()}`,
          type: "inspection_cleared",
          title: "Field Clearance / Inspection Verified",
          desc: res.courierClearance,
          hash: generateHash(),
          author: "Carrier Field System"
        },
        {
          id: `evt-relay-out-${Date.now()}`,
          timestamp: `Today • ${getTimeString()}`,
          type: "outcome_relayed",
          title: "Outcome Relayed to Counterparty",
          desc: "Field inspection clearance forwarded automatically to seller under user consent rule.",
          hash: generateHash(),
          author: "Passage Cross-Org Relay"
        },
        {
          id: `evt-resolved-${Date.now()}`,
          timestamp: `Today • ${getTimeString()}`,
          type: "resolved",
          title: "Problem Resolved & Final Docket Sealed",
          desc: res.summary,
          hash: generateHash(),
          author: "Passage Resolution Authority"
        }
      ]);
      setCurrentScreen('resolved');
    }
  };

  // Sandbox Console status updates
  const updateSandboxStatus = (orgSlug, newStatus, memo) => {
    setOrganizations(prev => prev.map(org => {
      if (org.slug === orgSlug) {
        return { ...org, status: newStatus };
      }
      return org;
    }));

    const orgObj = organizations.find(o => o.slug === orgSlug);
    setTimelineEvents(prev => [
      ...prev,
      {
        id: `evt-sb-${Date.now()}`,
        timestamp: `Today • ${getTimeString()}`,
        type: "status_update",
        title: `${orgObj?.name || orgSlug} Updated Status: ${newStatus.toUpperCase()}`,
        desc: memo || `Remote console marked state as ${newStatus}.`,
        hash: generateHash(),
        author: `${orgObj?.name || orgSlug} Portal`
      }
    ]);
  };

  return (
    <PassageContext.Provider
      value={{
        caseKey,
        activeCase,
        switchCase,
        currentScreen,
        setCurrentScreen,
        activeRole,
        setActiveRole,
        narrative,
        setNarrative,
        organizations,
        drafts,
        evidenceList,
        addEvidence,
        removeEvidence,
        orgEvidenceSelection,
        toggleEvidenceForOrg,
        relayConsent,
        setRelayConsent,
        timelineEvents,
        pendingQuestion,
        answeredQuestions,
        isEscalated,
        isResolved,
        isCompiling,
        isDispatching,
        showHandoverModal,
        compilePassage,
        proceedToDrafts,
        approveAndDispatch,
        answerQuestion,
        triggerEscalation,
        authorizeEscalationFiling,
        simulateNextStep,
        updateSandboxStatus
      }}
    >
      {children}
    </PassageContext.Provider>
  );
};

export const usePassage = () => {
  const context = useContext(PassageContext);
  if (!context) {
    throw new Error('usePassage must be used within a PassageProvider');
  }
  return context;
};
