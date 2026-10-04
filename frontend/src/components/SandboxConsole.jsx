import React from 'react';
import { usePassage } from '../context/PassageContext';

export default function SandboxConsole({ orgSlug }) {
  const {
    activeCase,
    organizations,
    drafts,
    updateSandboxStatus,
    setActiveRole,
    setCurrentScreen
  } = usePassage();

  const org = organizations.find(o => o.slug === orgSlug) || organizations[0];
  const draft = drafts[orgSlug];

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
              className="px-4 py-2 rounded-full bg-[#d9381e] hover:bg-[#b51d04] text-white font-label-sm text-xs uppercase tracking-wider transition-all font-semibold"
            >
              Back to User View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">TICKET REFERENCE</span>
            <span className="font-mono text-sm font-semibold">{org.ticketRef}</span>
          </div>
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">CURRENT STATUS</span>
            <span className="font-label-sm uppercase font-semibold text-[#cbd6c6]">
              {org.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">REPORTER</span>
            <span className="font-medium">{activeCase.user.name}</span>
          </div>
          <div>
            <span className="text-[#a9b9b2] block font-label-sm text-[10px]">SLA REMAINING</span>
            <span className="font-medium text-[#f1dc9a]">{org.sla}</span>
          </div>
        </div>
      </div>

      {/* Main Ticket Inspection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ddd5c7] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#ddd5c7]">
            <h3 className="font-semibold text-base text-[#14181a]">
              Incoming Ingestion Packet
            </h3>
            <span className="font-label-sm text-[11px] text-[#67625a]">
              Schema: {org.ticketType}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {draft?.fields ? (
              Object.entries(draft.fields).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]/60 text-xs">
                  <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-wider block mb-1">
                    {k}
                  </span>
                  <span className="font-medium text-[#14181a] leading-relaxed block">{v}</span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-[#f8f3ea] text-xs text-[#67625a]">
                Ticket payload synchronized from Passage Canonical Record.
              </div>
            )}
          </div>

          {/* Receiver Actions */}
          <div className="pt-4 border-t border-[#ddd5c7]">
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#67625a] font-semibold block mb-3">
              Operator Actions (Simulate Receiver Response)
            </span>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => updateSandboxStatus(org.slug, 'in_progress', `${org.name} operator verified intake and initiated processing.`)}
                className="px-4 py-2 rounded-xl bg-[#f2ede4] hover:bg-[#ddd5c7] text-[#14181a] font-label-sm text-xs uppercase tracking-wider transition-colors font-medium"
              >
                Mark In Progress
              </button>

              <button
                onClick={() => updateSandboxStatus(org.slug, 'visit_scheduled', `${org.name} field crew dispatch confirmed.`)}
                className="px-4 py-2 rounded-xl bg-[#f2ede4] hover:bg-[#ddd5c7] text-[#14181a] font-label-sm text-xs uppercase tracking-wider transition-colors font-medium"
              >
                Schedule Field Visit
              </button>

              <button
                onClick={() => updateSandboxStatus(org.slug, 'resolved', `${org.name} approved claim settlement and closed ticket.`)}
                className="px-4 py-2 rounded-xl bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider transition-colors font-medium"
              >
                Approve & Resolve Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Box: Passage Guardrails */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#ddd5c7] p-6 shadow-sm">
            <h4 className="font-semibold text-sm text-[#14181a] mb-2">
              Passage Boundary Protocol
            </h4>
            <p className="text-xs text-[#67625a] leading-relaxed mb-4">
              Passage does not replace your CRM or helpdesk. It filed this ticket directly into your system with complete data and verified attachments.
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
