import React from 'react';
import { usePassage } from '../context/PassageContext';

export default function HandoverModal() {
  const { showHandoverModal, organizations } = usePassage();

  if (!showHandoverModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fef9f0] rounded-[24px] border-2 border-[#14181a] p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#ddd5c7]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d9381e] animate-ping"></span>
            <span className="font-label-sm text-xs uppercase tracking-widest text-[#67625a]">
              Handover Protocol Active
            </span>
          </div>
          <span className="font-mono text-xs text-[#0f2b25] bg-[#cbd6c6]/50 px-2 py-0.5 rounded">
            CRYPTOGRAPHIC SEAL
          </span>
        </div>

        {/* Center Stamp Graphic */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#0f2b25] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="material-symbols-outlined text-[32px] animate-pulse">lock_person</span>
          </div>
          <h3 className="font-headline-sm text-2xl text-[#14181a]">
            Sealing Tripartite Filing
          </h3>
          <p className="text-xs text-[#67625a] mt-1 max-w-sm mx-auto">
            Applying digital authorization seal, binding cross-references, and fanning out to receiving systems...
          </p>
        </div>

        {/* Dynamic Stamped Cards */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-xl bg-white border border-[#ddd5c7] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#0f2b25]">tag</span>
              <span className="text-xs font-semibold text-[#14181a]">SHA-256 Consent Merkle Root</span>
            </div>
            <span className="font-label-sm text-[10px] text-[#0f2b25] bg-[#cbd6c6] px-2 py-0.5 rounded font-bold uppercase">
              SEALED
            </span>
          </div>

          {organizations.map((org, i) => (
            <div key={org.slug} className="p-3.5 rounded-xl bg-white border border-[#ddd5c7] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#d9381e]">verified</span>
                <span className="text-xs font-semibold text-[#14181a]">{org.name}</span>
              </div>
              <span className="font-label-sm text-[10px] text-[#8f1100] bg-[#ffdad3] px-2 py-0.5 rounded font-bold uppercase">
                DISPATCHED
              </span>
            </div>
          ))}
        </div>

        <div className="w-full bg-[#ddd5c7] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#0f2b25] h-full w-full animate-pulse transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
}
