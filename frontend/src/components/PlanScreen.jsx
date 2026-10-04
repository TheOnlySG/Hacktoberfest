import React from 'react';
import { usePassage } from '../context/PassageContext';

export default function PlanScreen() {
  const {
    activeCase,
    organizations,
    proceedToDrafts
  } = usePassage();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#ddd5c7] gap-2">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-xs text-[#67625a] uppercase tracking-widest">
            Phase 02 // Resolution Architecture
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d9381e]"></span>
          <span className="font-label-sm text-xs text-[#d9381e] uppercase tracking-wider">
            Docket Synced
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-md text-xs text-[#14181a] font-medium">CHAIN INTEGRITY</span>
          <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#cbd6c6] text-[#0f2b25] font-semibold uppercase">
            TRIPARTITE
          </span>
          <span className="font-label-sm text-[11px] text-[#67625a]">REF: {activeCase.docketSerial}</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-8">
        <h1 className="font-headline-xl text-3xl sm:text-5xl text-[#14181a] tracking-tight leading-none mb-3">
          These organizations need to <em className="italic font-normal text-[#0f2b25]">act</em>.
        </h1>
        <p className="font-body-lg text-[#67625a] text-base sm:text-lg max-w-2xl">
          Passage identified {organizations.length} organizations involved in this issue from your verified identifiers and open Org Profiles.
        </p>
      </div>

      {/* Sequence Header Shelf */}
      <div className="w-full bg-[#cbd6c6]/50 rounded-2xl p-4 sm:p-6 mb-8 border border-[#ddd5c7]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10">
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-xs text-[#0f2b25] uppercase tracking-wider font-semibold">
              TICKETING SEQUENCE & DEPENDENCY GRAPH
            </span>
            <span className="text-[#0f2b25]/40 font-label-sm text-xs">/</span>
            <span className="font-label-sm text-xs text-[#0f2b25]/80">
              {organizations.length} Routing Stubs Staged
            </span>
          </div>
          <span className="hidden sm:inline font-label-sm text-[11px] text-[#0f2b25]/80 uppercase">
            Dependency Order Computed
          </span>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org, index) => (
            <div
              key={org.slug}
              className="bg-white rounded-xl p-5 border border-[#ddd5c7] shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Org header badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-widest">
                      Counterparty 0{index + 1}
                    </span>
                    <h3 className="font-semibold text-base text-[#14181a] leading-snug">{org.name}</h3>
                  </div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f2ede4] text-[#0f2b25] font-medium shrink-0">
                    {org.category}
                  </span>
                </div>

                {/* Rationale */}
                <p className="text-xs text-[#67625a] mb-4 leading-relaxed">
                  {org.rationale}
                </p>

                {/* Specifications List */}
                <div className="space-y-2 pt-3 border-t border-[#ddd5c7]/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] text-[#67625a]">Schema</span>
                    <span className="font-label-sm text-[11px] text-[#14181a] font-medium truncate max-w-[140px]">
                      {org.ticketType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] text-[#67625a]">Intake Channel</span>
                    <span className="font-label-sm text-[11px] text-[#0f2b25] font-medium">
                      {org.channel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] text-[#67625a]">Target SLA</span>
                    <span className="font-label-sm text-[11px] text-[#67625a]">
                      {org.sla}
                    </span>
                  </div>
                  {org.dependsOn && (
                    <div className="flex items-center justify-between p-1.5 rounded bg-[#f1dc9a]/40 border border-[#f1dc9a]">
                      <span className="font-label-sm text-[10px] text-[#8f1100] font-semibold">DEPENDENCY</span>
                      <span className="font-label-sm text-[10px] text-[#8f1100]">
                        Requires {org.dependsOn.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Evidence policy pill */}
              <div className="mt-4 pt-3 border-t border-[#ddd5c7]/60 flex items-center justify-between text-[11px] text-[#67625a]">
                <span>Evidence Allowed:</span>
                <span className="font-label-sm text-[#0f2b25] font-semibold">
                  {org.allowedEvidence?.length || 0} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#ddd5c7] shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#f2ede4] border border-[#ddd5c7] flex items-center justify-center shrink-0 text-[#0f2b25]">
            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          </div>
          <div>
            <h4 className="font-medium text-sm text-[#14181a]">
              Stage 03: Ticket Composition & Schema Validation
            </h4>
            <p className="text-xs text-[#67625a]">
              Passage will structure an individual ticket for each organization according to its exact JSON Schema.
            </p>
          </div>
        </div>

        <button
          onClick={proceedToDrafts}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
        >
          <span>Compose Tickets & Review Drafts</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
