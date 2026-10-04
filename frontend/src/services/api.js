const API_BASE_URL = 'http://localhost:8000';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Health check failed, using local fallback:', err);
    return null;
  }
}

export async function fetchOrgs() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orgs`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] fetchOrgs failed, using local profiles:', err);
    return null;
  }
}

export async function createPassage(problemDescription, attachedEvidence = []) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_description: problemDescription,
        attached_evidence: attachedEvidence,
      }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] createPassage failed:', err);
    return null;
  }
}

export async function compilePassage(passageId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages/${passageId}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] compilePassage failed:', err);
    return null;
  }
}

export async function getPlan(passageId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages/${passageId}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] getPlan failed:', err);
    return null;
  }
}

export async function getDrafts(passageId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages/${passageId}/drafts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] getDrafts failed:', err);
    return null;
  }
}

export async function dispatchPassage(passageId, approvedDrafts = [], relayRules = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages/${passageId}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approved_drafts: approvedDrafts,
        relay_rules: relayRules,
      }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] dispatchPassage failed:', err);
    return null;
  }
}

export async function fastForward(passageId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages/${passageId}/fast_forward`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] fastForward failed:', err);
    return null;
  }
}

export async function fetchQuestions(passageId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages/${passageId}/questions`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] fetchQuestions failed:', err);
    return null;
  }
}

export async function answerQuestion(questionId, payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/questions/${questionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] answerQuestion failed:', err);
    return null;
  }
}

export async function approveEscalation(escalationId, payload = { approved: true }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/escalations/${escalationId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] approveEscalation failed:', err);
    return null;
  }
}

export async function updateSandboxStatus(orgSlug, ticketId, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/sandbox/${orgSlug}/tickets/${ticketId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] updateSandboxStatus failed:', err);
    return null;
  }
}

export async function updateDraft(draftId, payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/drafts/${draftId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] updateDraft failed:', err);
    return null;
  }
}

export async function getTickets(passageId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passages/${passageId}/tickets`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] getTickets failed:', err);
    return null;
  }
}
