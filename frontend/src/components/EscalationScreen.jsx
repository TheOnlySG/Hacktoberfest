import React from 'react';
import { usePassage } from '../context/PassageContext';

export default function EscalationScreen() {
  const {
    activeCase,
    triggerEscalation,
    authorizeEscalationFiling,
    isEscalated,
    setCurrentScreen
  } = usePassage();

  const esc = activeCase.escalation;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#ddd5c7]">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-xs uppercase tracking-widest text-[#67625a]">
            SLA Governance // Protocol RFC-9114
          </span>
          <span className="w-2 h-2 rounded-full bg-[#d9381e]"></span>
          <span className="font-label-sm text-xs uppercase tracking-wider text-[#d9381e] font-semibold">
            Escalation Threshold
          </span>
        </div>
        <span className="font-label-sm text-xs font-mono text-[#67625a]">
          REF: {activeCase.docketSerial}
        </span>
      </div>

      {/* Main Title */}
      <div className="mb-8">
        <h1 className="font-headline-xl text-3xl sm:text-5xl text-[#14181a] tracking-tight leading-none mb-3">
          SLA breach <em className="italic font-normal text-[#d9381e]">detected</em>.
        </h1>
        <p className="font-body-lg text-[#67625a] text-base sm:text-lg leading-relaxed max-w-2xl">
          When receiving organizations exceed statutory response windows, Passage prepares an authoritative escalation brief for regulatory or payment gateway enforcement.
        </p>
      </div>

      {/* Escalation Dossier Sheet */}
      <div className="bg-white rounded-[20px] border border-[#d9381e]/30 shadow-md p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Urgent stamp badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#ddd5c7] gap-2">
          <div>
            <span className="font-label-sm text-[10px] text-[#8f1100] uppercase tracking-widest font-bold block mb-1">
              Trigger Event
            </span>
            <p className="text-sm font-semibold text-[#14181a]">
              {esc.triggerReason}
            </p>
          </div>
          <span className="font-label-sm text-xs px-3 py-1 rounded-full bg-[#ffdad3] text-[#8f1100] font-bold uppercase self-start sm:self-center">
            Statutory TAT Expired
          </span>
        </div>

        {/* Auto-Drafted Brief Details */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]">
            <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-wider block mb-1">
              Escalation Destination
            </span>
            <span className="font-semibold text-sm sm:text-base text-[#14181a]">
              {esc.targetOrg}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]">
            <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-wider block mb-1">
              Governing Regulation / Statute
            </span>
            <span className="font-mono text-xs sm:text-sm text-[#0f2b25] font-medium">
              {esc.statute}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]">
            <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-wider block mb-1">
              Filing Summary
            </span>
            <p className="text-xs sm:text-sm text-[#14181a] leading-relaxed">
              {esc.draftSummary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f1dc9a]/40 border border-[#f1dc9a]">
            <span className="font-label-sm text-[10px] text-[#8f1100] uppercase font-bold tracking-wider block mb-1">
              Demanded Remedy
            </span>
            <p className="text-xs sm:text-sm text-[#14181a] font-medium leading-relaxed">
              {esc.remedyClaim}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ddd5c7]">
          <button
            onClick={() => setCurrentScreen('tracker')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-[#67625a] hover:text-[#14181a] font-label-sm text-xs uppercase tracking-wider transition-colors"
          >
            Cancel / Return to Tracker
          </button>

          <button
            onClick={authorizeEscalationFiling}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#d9381e] hover:bg-[#b51d04] text-white font-label-sm text-xs uppercase tracking-wider transition-all shadow-md font-bold flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>Authorize Regulatory Escalation</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
