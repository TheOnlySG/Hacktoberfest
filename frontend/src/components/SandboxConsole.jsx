import React, { useState, useEffect } from 'react';
import { usePassage } from '../context/PassageContext';
import * as api from '../services/api';

export default function SandboxConsole({ orgSlug }) {
  const {
    activeCase,
    narrative,
    organizations,
    drafts,
    evidenceList,
    orgEvidenceSelection,
    updateSandboxStatus,
    setActiveRole
  } = usePassage();

  const [sandboxTickets, setSandboxTickets] = useState([]);
  const [selectedTicketRef, setSelectedTicketRef] = useState(null);

  const org = organizations.find(o => o.slug === orgSlug) || organizations[0] || {
    slug: orgSlug,
    name: orgSlug.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    category: 'Counterparty Helpdesk',
    channel: 'Direct REST API & Webhook',
    ticketRef: `${orgSlug.slice(0, 3).toUpperCase()}-101`,
    status: 'OPEN',
    sla: '24h Response',
    ticketType: `${orgSlug}.resolution.v1`
  };

  const draft = drafts[org.slug] || drafts[orgSlug] || null;

  // Fetch real-time tickets from the backend sandbox
  useEffect(() => {
    let isMounted = true;
    api.fetchSandboxTickets(org.slug).then(res => {
      if (isMounted && Array.isArray(res)) {
        setSandboxTickets(res);
        if (res.length > 0 && !selectedTicketRef) {
          setSelectedTicketRef(res[res.length - 1].id || res[res.length - 1].ticket_ref);
        }
      }
    });
    return () => { isMounted = false; };
  }, [org.slug]);

  // Exhibits permitted for this org
  const permittedIds = orgEvidenceSelection[org.slug] || evidenceList.map(e => e.id);
  const enclosedExhibits = evidenceList.filter(e => permittedIds.includes(e.id));

  // Determine current active ticket ref
  const currentTicketRef = selectedTicketRef || org.ticketRef || 'PENDING-DISPATCH';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Console Masthead */}
      <div className="bg-[#14181a] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg text-[#cbd6c6]">
              {org.name[0]}
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-[#a9b9b2] uppercase tracking-widest block">
                Sandbox Organization Helpdesk • {org.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">{org.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-label-sm text-xs px-3 py-1 rounded-full bg-white/15 text-[#cbd6c6] font-mono">
              CHANNEL: {org.channel}
            </span>
            <button
              onClick={() => setActiveRole('user')}
              className="px-4 py-2 rounded-full bg-[#d9381e] hover:bg-[#b51d04] text-white font-label-sm text-xs uppercase tracking-wider transition-all font-semibold cursor-pointer"
            >
              Back to User View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">CURRENT TICKET REF</span>
            <span className="font-mono text-sm font-semibold">{currentTicketRef}</span>
          </div>
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">CURRENT STATUS</span>
            <span className="font-label-sm uppercase font-semibold text-[#cbd6c6]">
              {(org.status || 'OPEN').replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">REPORTER</span>
            <span className="font-medium">{activeCase.user?.name || 'Complainant'}</span>
          </div>
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">SLA TURNAROUND</span>
            <span className="font-medium text-[#f1dc9a]">{org.sla || '24h Statutory'}</span>
          </div>
        </div>
      </div>

      {/* Main Ticket Inspection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ddd5c7] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#ddd5c7]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-semibold text-base text-[#14181a]">
                Live Ingestion Packet
              </h3>
            </div>
            <span className="font-label-sm text-[11px] text-[#67625a] font-mono">
              Schema: {org.ticketType}
            </span>
          </div>

          {/* User's Original Statement */}
          <div className="mb-5 p-4 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]/70">
            <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-wider block mb-1 font-semibold">
              First-Party Dispute Statement
            </span>
            <p className="font-body-md text-sm text-[#14181a] leading-relaxed">
              {narrative || activeCase.narrative || 'No statement provided.'}
            </p>
          </div>

          {/* Structured Fields Generated for this Organization */}
          <div className="space-y-3 mb-6">
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#67625a] font-semibold block">
              Schema-Constrained Fields
            </span>
            {draft?.fields && Object.keys(draft.fields).length > 0 ? (
              Object.entries(draft.fields).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]/60 text-xs">
                  <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-wider block mb-1">
                    {k}
                  </span>
                  <span className="font-medium text-[#14181a] leading-relaxed block">{String(v)}</span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-[#f8f3ea] text-xs text-[#67625a]">
                Custom ticket payload indexed directly from user intake and cryptographically attested.
              </div>
            )}
          </div>

          {/* Attached Evidence Transmitted */}
          {enclosedExhibits.length > 0 && (
            <div className="mb-6 pt-4 border-t border-[#ddd5c7]">
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#67625a] font-semibold block mb-3">
                Transmitted Evidentiary Exhibits ({enclosedExhibits.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enclosedExhibits.map(ev => (
                  <div key={ev.id} className="p-3 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#e7e2d9] border border-[#ddd5c7] flex items-center justify-center">
                      {ev.url ? (
                        <img src={ev.url} alt={ev.name} className="w-full h-full object-cover" />
                      ) : ev.type === 'photo' ? (
                        <span className="material-symbols-outlined text-[24px] text-[#48645c]">image</span>
                      ) : (
                        <span className="text-xl">📄</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-xs text-[#1d1c16] font-semibold truncate">
                        {ev.name}
                      </span>
                      <span className="font-label-sm text-[10px] text-[#414846]/80">
                        {ev.tag || 'Official Proof'} • {ev.size}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receiver Operator Actions */}
          <div className="pt-4 border-t border-[#ddd5c7]">
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#67625a] font-semibold block mb-3">
              Operator Actions (Simulate Receiver Response)
            </span>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => updateSandboxStatus(org.slug, 'in_progress', `${org.name} operator verified intake and initiated processing.`)}
                className="px-4 py-2 rounded-xl bg-[#f2ede4] hover:bg-[#ddd5c7] text-[#14181a] font-label-sm text-xs uppercase tracking-wider transition-colors font-medium cursor-pointer"
              >
                Mark In Progress
              </button>

              <button
                onClick={() => updateSandboxStatus(org.slug, 'visit_scheduled', `${org.name} inspection scheduled.`)}
                className="px-4 py-2 rounded-xl bg-[#f2ede4] hover:bg-[#ddd5c7] text-[#14181a] font-label-sm text-xs uppercase tracking-wider transition-colors font-medium cursor-pointer"
              >
                Schedule Inspection
              </button>

              <button
                onClick={() => updateSandboxStatus(org.slug, 'resolved', `${org.name} approved resolution and closed ticket.`)}
                className="px-4 py-2 rounded-xl bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider transition-colors font-medium cursor-pointer"
              >
                Approve & Resolve Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Box: Passage Guardrails & Live Tickets Table */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Live Ingestion Queue in Sandbox */}
          {sandboxTickets.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#ddd5c7] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#14181a]">
                  Sandbox Ingestion Queue ({sandboxTickets.length})
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sandboxTickets.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    onClick={() => setSelectedTicketRef(t.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      currentTicketRef === t.id
                        ? 'bg-[#0f2b25] text-white border-[#0f2b25]'
                        : 'bg-[#f8f3ea] hover:bg-[#f2ede4] border-[#ddd5c7] text-[#14181a]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-semibold">
                      <span>{t.id}</span>
                      <span className="text-[10px] uppercase">{t.status}</span>
                    </div>
                    <span className="text-[10px] block opacity-80 mt-0.5 truncate">
                      {t.created_at ? new Date(t.created_at).toLocaleTimeString() : 'Recent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#ddd5c7] p-6 shadow-sm">
            <h4 className="font-semibold text-sm text-[#14181a] mb-2">
              Passage Boundary Protocol
            </h4>
            <p className="text-xs text-[#67625a] leading-relaxed mb-4">
              Passage integrates directly into your helpdesk or CRM. All fields and evidentiary exhibits are verified cryptographically.
            </p>
            <div className="p-3 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] text-[11px] text-[#0f2b25] font-mono leading-tight">
              DELEGATION: Verified user authorization attached.
            </div>
          </div>

          <div className="bg-[#cbd6c6]/30 rounded-2xl border border-[#cbd6c6] p-5">
            <h5 className="font-semibold text-xs text-[#0f2b25] uppercase tracking-wider mb-1">
              Live Bidirectional Sync
            </h5>
            <p className="text-xs text-[#67625a] leading-relaxed">
              Any status changes or comments you make here will instantly stream back into the user's Passage timeline via webhooks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
