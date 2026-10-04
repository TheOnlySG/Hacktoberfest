import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_CASES } from '../data/cases';
import * as api from '../services/api';

const PassageContext = createContext(null);

const CUSTOM_TEMPLATE = {
  id: "custom",
  title: "Custom Dispute Intake",
  domain: "Direct Dispute Resolution",
  docketSerial: "PASS-2026-CUSTOM",
  user: {
    name: "Complainant",
    email: "user@passage.local",
    phone: "+91 98200 00000",
    address: "India"
  },
  narrative: "",
  rawAmount: "Open Claim",
  evidenceList: [],
  organizations: [],
  drafts: {},
  initialEvents: [
    {
      id: "evt-c-0",
      timestamp: "Today • Just now",
      type: "docket_created",
      title: "Intake Dossier Opened",
      desc: "Ready for custom query entry, receipt/image upload, and Groq-powered multi-organization routing.",
      hash: "8f4a19b3c4e098df2411aa784bcf65103a890123ef65a4bc0192348574109abc",
      author: "Passage Groq Engine"
    }
  ]
};

export const PassageProvider = ({ children }) => {
  const [caseKey, setCaseKey] = useState('case1');
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'plan' | 'drafts' | 'tracker' | 'inbox' | 'escalation' | 'resolved'
  const [activeRole, setActiveRole] = useState('user'); // 'user' | org slug

  // Current case base config
  const activeCase = DEMO_CASES[caseKey] || CUSTOM_TEMPLATE;

  // Dynamic state
  const [narrative, setNarrative] = useState(activeCase.narrative || "");
  const [organizations, setOrganizations] = useState(activeCase.organizations || []);
  const [drafts, setDrafts] = useState(activeCase.drafts || {});
  const [evidenceList, setEvidenceList] = useState(activeCase.evidenceList || []);
  
  // Backend integration state
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendPassageId, setBackendPassageId] = useState(null);
  const [backendCompiled, setBackendCompiled] = useState(null);

  // Disclosure toggles: orgSlug -> [evId, ...]
  const [orgEvidenceSelection, setOrgEvidenceSelection] = useState(() => {
    const initial = {};
    (activeCase.organizations || []).forEach(org => {
      initial[org.slug] = [...(org.allowedEvidence || [])];
    });
    return initial;
  });

  const [relayConsent, setRelayConsent] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState(activeCase.initialEvents || []);
  const [pendingQuestion, setPendingQuestion] = useState(activeCase.question || null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isEscalated, setIsEscalated] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    let isMounted = true;
    api.fetchHealth().then(res => {
      if (isMounted) {
        setBackendConnected(!!res && res.status === 'ok');
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Sync state whenever caseKey changes
  useEffect(() => {
    const c = DEMO_CASES[caseKey] || CUSTOM_TEMPLATE;
    setNarrative(c.narrative || "");
    setOrganizations(c.organizations || []);
    setDrafts(c.drafts || {});
    setEvidenceList(c.evidenceList || []);
    
    const initial = {};
    (c.organizations || []).forEach(org => {
      initial[org.slug] = [...(org.allowedEvidence || [])];
    });
    setOrgEvidenceSelection(initial);

    setTimelineEvents(c.initialEvents || []);
    setPendingQuestion(c.question || null);
    setAnsweredQuestions([]);
    setIsEscalated(false);
    setIsResolved(false);
    setBackendPassageId(null);
    setBackendCompiled(null);
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

  // Add file evidence with object URLs for instant visual preview
  const addEvidence = (files) => {
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map((file, idx) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
      const isInvoice = ['pdf', 'doc', 'docx', 'txt', 'csv'].includes(ext);
      const type = isImg ? 'photo' : isInvoice ? 'invoice' : 'chat';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = sizeMb === '0.0' ? `${(file.size / 1024).toFixed(0)} KB` : `${sizeMb} MB`;
      const blobUrl = isImg ? URL.createObjectURL(file) : null;
      return {
        id: `ev-uploaded-${Date.now()}-${idx}`,
        name: file.name,
        type: type,
        size: sizeStr,
        url: blobUrl,
        tag: isImg ? 'Photographic Proof' : 'Financial / Order Doc',
        preview: `${file.name} • ${sizeStr} • Verified locally`
      };
    });

    setEvidenceList(prev => [...prev, ...newItems]);

    // Also include in active organization permissions
    setOrgEvidenceSelection(prev => {
      const updated = { ...prev };
      const newIds = newItems.map(i => i.id);
      Object.keys(updated).forEach(slug => {
        updated[slug] = Array.from(new Set([...(updated[slug] || []), ...newIds]));
      });
      return updated;
    });
  };

  // Remove file evidence
  const removeEvidence = (evId) => {
    setEvidenceList(prev => prev.filter(e => e.id !== evId));
    setOrgEvidenceSelection(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(slug => {
        updated[slug] = (updated[slug] || []).filter(id => id !== evId);
      });
      return updated;
    });
  };

  // Clear and start a fresh custom dispute
  const startNewDispute = () => {
    setCaseKey('custom');
    setNarrative('');
    setEvidenceList([]);
    setOrganizations([]);
    setDrafts({});
    setOrgEvidenceSelection({});
    setTimelineEvents([
      {
        id: `evt-init-${Date.now()}`,
        timestamp: `Today • ${getTimeString()}`,
        type: "docket_created",
        title: "New Intake Dossier Opened",
        desc: "Ready for user dispute narrative and evidentiary uploads.",
        hash: generateHash(),
        author: "Passage Groq Engine"
      }
    ]);
    setBackendPassageId(null);
    setBackendCompiled(null);
    setIsEscalated(false);
    setIsResolved(false);
    setCurrentScreen('start');
  };

  // Switch demo case template
  const switchCase = (newKey) => {
    if (DEMO_CASES[newKey]) {
      setCaseKey(newKey);
    }
  };

  // Compile narrative into structured Passage (with real Groq AI backend!)
  const compilePassage = async () => {
    setIsCompiling(true);
    let passageId = backendPassageId;

    try {
      // 1. Create passage on FastAPI backend
      const created = await api.createPassage(narrative, evidenceList);
      if (created?.id) {
        passageId = created.id;
        setBackendPassageId(passageId);

        // 2. Trigger Case Compiler on backend (Groq AI)
        const compiled = await api.compilePassage(passageId);
        if (compiled) {
          setBackendCompiled(compiled);
        }

        // 3. Trigger Org Router on backend (Groq AI)
        const plan = await api.getPlan(passageId);
        if (plan?.orgs?.length) {
          console.log('[Passage API] Router Plan received from backend:', plan);
          const dynamicOrgs = plan.orgs.map((o, idx) => {
            const orgName = o.name || o.slug.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            return {
              slug: o.slug,
              name: orgName,
              category: o.category || (idx === 0 ? 'Primary Counterparty' : 'Oversight / Regulatory Authority'),
              role: idx === 0 ? 'primary' : 'oversight',
              domain: o.domain || 'general',
              ticketType: `${o.slug}.resolution.v1`,
              status: 'acknowledged',
              ticketRef: `${o.slug.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              channel: 'Direct Dispatch (REST & Webhook)',
              sla: '24h Response • 72h Resolution',
              rationale: o.reason || 'Party identified by Groq Org Router as responsible for resolution.',
              requires: ['Dispute Narrative', 'Reference Identifiers', 'Attached Exhibits'],
              withholds: ['Unconsented banking credentials', 'Third-party private logs'],
              allowedEvidence: evidenceList.map(e => e.id)
            };
          });

          setOrganizations(dynamicOrgs);

          const newEvSelection = {};
          dynamicOrgs.forEach(org => {
            newEvSelection[org.slug] = evidenceList.map(e => e.id);
          });
          setOrgEvidenceSelection(newEvSelection);
        }
      }
    } catch (err) {
      console.warn('[Passage] Backend compilation call error, falling back locally:', err);
    } finally {
      setIsCompiling(false);
      
      // Add event to chain
      setTimelineEvents(prev => [
        ...prev,
        {
          id: `evt-${Date.now()}`,
          timestamp: `Today • ${getTimeString()}`,
          type: "compiled",
          title: "AI Compilation Completed (Groq AI / Backend API)",
          desc: `Extracted entities and mapped dynamic resolution plan for ${organizations.length || 2} counterparties.`,
          hash: generateHash(),
          author: "Passage Compiler (Groq API)"
        }
      ]);
      setCurrentScreen('plan');
    }
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

  // Move from Plan to Drafts review (fetch drafts from Groq backend)
  const proceedToDrafts = async () => {
    if (backendPassageId) {
      try {
        const backendDrafts = await api.getDrafts(backendPassageId);
        if (backendDrafts && backendDrafts.length > 0) {
          console.log('[Passage API] Ticket drafts loaded from backend:', backendDrafts);
          const draftsMap = {};
          backendDrafts.forEach(d => {
            draftsMap[d.org_slug] = {
              draftId: d.draft_id,
              title: `${(d.org_slug || '').replace('_', ' ').toUpperCase()} Resolution Ticket`,
              fields: d.fields || {},
              evidenceIncluded: Object.keys(d.evidence_selection || {}).filter(k => d.evidence_selection[k]),
              delegationStatement: `Passage is authorized by user to initiate this petition with ${d.org_slug.replace('_', ' ')}.`
            };
          });
          setDrafts(prev => ({ ...prev, ...draftsMap }));
        }
      } catch (e) {
        console.warn('[Passage API] getDrafts fallback:', e);
      }
    }
    setCurrentScreen('drafts');
  };

  // Approve & Dispatch at Consent Gate (with real FastAPI dispatch!)
  const approveAndDispatch = async () => {
    setIsDispatching(true);
    setShowHandoverModal(true);

    let dispatchedTickets = null;
    if (backendPassageId) {
      try {
        dispatchedTickets = await api.dispatchPassage(backendPassageId, [], { relay_outcomes: relayConsent });
        console.log('[Passage API] Dispatched tickets from backend:', dispatchedTickets);
      } catch (err) {
        console.warn('[Passage API] Dispatch error, fallback to local simulation:', err);
      }
    }

    setTimeout(() => {
      setIsDispatching(false);
      setShowHandoverModal(false);

      const nowTime = `Today • ${getTimeString()}`;
      
      // Update ticket references if backend returned them
      if (dispatchedTickets && Array.isArray(dispatchedTickets)) {
        setOrganizations(prev => prev.map(org => {
          const match = dispatchedTickets.find(t => 
            t.org_slug === org.slug ||
            (t.org_slug === 'swiftcourier' && org.slug === 'swiftroute') ||
            (t.org_slug === 'swiftroute' && org.slug === 'swiftcourier') ||
            (t.org_slug === 'northfield_bank' && org.slug === 'northfield') ||
            (t.org_slug === 'municipal_water' && org.slug === 'open311') ||
            (t.org_slug === 'power_utility' && org.slug === 'powerutility') ||
            (t.org_slug === 'shield_insurance' && org.slug === 'shieldmotor')
          );
          if (match) {
            return {
              ...org,
              ticketRef: match.ticket_ref || org.ticketRef,
              status: match.normalized_status || 'submitted'
            };
          }
          return org;
        }));
      }

      // Create dispatch events
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
          author: "Passage Dispatch Engine (FastAPI)"
        }))
      ];

      // Show reference passing
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

    // Call backend API to relay answer
    if (backendPassageId || pendingQuestion.id) {
      api.answerQuestion(pendingQuestion.id || 'q-default', {
        ticket_id: pendingQuestion.ticketRef || 'SR-INSP-4019',
        org_slug: pendingQuestion.orgSlug || 'swiftcourier',
        answer_text: selectedOption,
        attachments: []
      }).catch(err => console.warn('[API] Relay error:', err));
    }

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
  const triggerEscalation = async () => {
    setIsEscalated(true);
    if (backendPassageId) {
      try {
        await api.fastForward(backendPassageId);
      } catch (e) {
        // fallback
      }
    }
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
    setIsEscalated(true);
    setOrganizations(prev => prev.map(org => ({
      ...org,
      status: 'escalated'
    })));

    // Call backend escalation approval API
    api.approveEscalation(activeCase.id || 'esc-default', {
      approved: true,
      edited_text: activeCase.escalation.draftSummary
    }).catch(err => console.warn('[API] Escalation approval error:', err));

    setTimelineEvents(prev => [
      ...prev,
      {
        id: `evt-esc-filed-${Date.now()}`,
        timestamp: `Today • ${getTimeString()}`,
        type: "escalation_filed",
        title: `Formal Grievance Passaged to ${activeCase.escalation.targetOrg}`,
        desc: `Authorization confirmed by ${activeCase.user.name}. Digital docket passaged with full audit trail under ${activeCase.escalation.statute}.`,
        hash: generateHash(),
        author: "Passage Escalation Engine"
      }
    ]);
    setCurrentScreen('tracker');
  };

  // Step simulation forward
  const simulateNextStep = async () => {
    if (pendingQuestion) {
      setCurrentScreen('inbox');
      return;
    }

    // If case has been escalated, do NOT resolve directly — maintain Passaged state
    if (isEscalated) {
      setTimelineEvents(prev => [
        ...prev,
        {
          id: `evt-reg-docket-${Date.now()}`,
          timestamp: `Today • ${getTimeString()}`,
          type: "regulatory_acknowledgement",
          title: `Docket Acknowledged by ${activeCase.escalation.targetOrg}`,
          desc: `Statutory investigation active under ${activeCase.escalation.statute}. Case status is Passaged (Escalated to Regulatory Authority).`,
          hash: generateHash(),
          author: `${activeCase.escalation.targetOrg} Registry`
        }
      ]);
      return;
    }

    if (!isResolved) {
      if (backendPassageId) {
        try {
          await api.fastForward(backendPassageId);
        } catch (e) {
          // safe fallback
        }
      }

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
          title: "Problem Passaged & Final Docket Sealed",
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

    // Call backend sandbox status endpoint
    if (orgObj?.ticketRef) {
      api.updateSandboxStatus(orgSlug, orgObj.ticketRef, newStatus).catch(e => console.warn(e));
    }

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
        backendConnected,
        backendPassageId,
        backendCompiled,
        compilePassage,
        proceedToDrafts,
        approveAndDispatch,
        answerQuestion,
        triggerEscalation,
        authorizeEscalationFiling,
        simulateNextStep,
        updateSandboxStatus,
        startNewDispute
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
