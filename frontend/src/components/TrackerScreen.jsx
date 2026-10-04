import React, { useState } from 'react';
import { usePassage } from '../context/PassageContext';

export default function TrackerScreen() {
  const {
    activeCase,
    organizations,
    timelineEvents,
    pendingQuestion,
    isEscalated,
    setCurrentScreen,
    simulateNextStep,
    triggerEscalation
  } = usePassage();

  const [copiedHash, setCopiedHash] = useState(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Passage: ${activeCase.docketSerial}`,
        text: `${activeCase.title} documentation dossier attested by ${organizations.map(o => o.name).join(', ')}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedHash('share');
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Meta Line */}
      <div className="flex items-center justify-between pb-2.5 mb-5 border-b border-[#ddd5c7]">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-xs uppercase tracking-widest text-[#67625a]">
            CHRONOLOGY OF CUSTODY // DOCKET {activeCase.docketSerial}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isEscalated ? 'bg-[#d9381e]' : 'bg-[#48645c]'} animate-pulse`}></span>
          <span className={`font-label-sm text-xs uppercase tracking-wider font-semibold ${isEscalated ? 'text-[#8f1100]' : 'text-[#001511]'}`}>
            {isEscalated ? 'Status: Passaged (Escalated)' : 'Attested Live Chain'}
          </span>
        </div>
      </div>

      {/* Main Title & Stamp Row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg-mobile sm:font-headline-lg text-2xl sm:text-4xl text-[#1d1c16] tracking-tight leading-tight">
            {activeCase.title.split(':')[1] || activeCase.title}.
          </h1>
          <p className="font-body-md text-sm sm:text-base text-[#414846] mt-1.5 leading-relaxed">
            {isEscalated 
              ? `Formal dossier passaged to ${activeCase.escalation.targetOrg} under ${activeCase.escalation.statute}.`
              : `Coordinated resolution active across ${organizations.map(o => o.name).join(' & ')}.`}
          </p>
        </div>

        {/* Circular Attestation Rubber Stamp from screen_3_timeline */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[1.5px] border-[#d9381e] flex flex-col items-center justify-center p-1 bg-[#fef9f0] rotate-[-6deg] shadow-xs shrink-0 select-none">
          <span className="font-label-sm text-[8px] sm:text-[9px] uppercase tracking-wider text-[#d9381e] leading-none font-bold">
            PASSAGE
          </span>
          <span className="font-label-sm text-[10px] sm:text-[11px] uppercase tracking-tighter text-[#d9381e] leading-tight font-extrabold my-0.5">
            {isEscalated ? 'PASSAGED' : 'ACCEPTED'}
          </span>
          <span className="font-label-sm text-[7px] sm:text-[8px] tracking-tight text-[#d9381e] leading-none">
            04 OCT 2026
          </span>
          <span className="font-label-sm text-[6px] sm:text-[7px] uppercase tracking-widest text-[#d9381e] leading-tight mt-0.5">
            {isEscalated ? 'REGULATORY' : 'ATTESTED'}
          </span>
        </div>
      </div>

      {/* Dossier Exhibit Card from screen_3_timeline */}
      <section className="bg-white rounded-[20px] border border-[#ddd5c7] p-5 sm:p-6 shadow-sm mb-6 overflow-hidden">
        <div className="flex flex-col gap-3">
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[14px] overflow-hidden bg-[#ece8df] relative border border-[#ddd5c7]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFLmMrvreelpdxJDgUp7jEMwsheLQ-UuUCuol5tdMt8nVE0cl3rIAMv_OctWYVyHxD7WwxcG70MhD8tJr5JSk5OAmVHxnDfaQwuuoVB6F6O8LfiEAf1yWYf9DtvSkMYHGQo2XgJez7MChht_pnLO_Iu80TsJKYbQBRx7cn8UcJawcoP8NjTG4uM074_KjCt7lDl5uBZ3MfhipwiG_KdgWH4lYQoa7LVmSbRwlDwdVy_XJt5PbteXPM"
              alt="Parcel condition exhibit"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#1d1c16] font-semibold">
              EXHIBIT A-01: box-photo.jpg
            </span>
            <span className="font-label-sm text-[11px] text-[#414846]/80">
              3.4 MB • GEOLOC VERIFIED
            </span>
          </div>

          {/* Resolution assigned banner */}
          <div className="mt-3 pt-3 bg-[#f8f3ea] -mx-5 -mb-5 px-5 pb-5 border-t border-[#ddd5c7]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] uppercase text-[#414846] tracking-wider font-semibold">
                  RESOLUTION ASSIGNED
                </span>
                <span className="font-body-sm text-xs sm:text-sm text-[#1d1c16] font-medium mt-0.5">
                  Full transit indemnity & replacement claimed
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="font-label-sm text-[10px] uppercase text-[#414846] tracking-wider font-semibold">
                  PRIMARY CARRIER
                </span>
                <span className="font-body-sm text-xs sm:text-sm text-[#1d1c16] font-medium mt-0.5">
                  SwiftRoute Logistics
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pending Question Notification (if active) */}
      {pendingQuestion && (
        <div className="mb-6 p-4 rounded-xl bg-[#ffdad3]/50 border border-[#d9381e]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#d9381e] text-[20px] shrink-0 mt-0.5">
              notification_important
            </span>
            <div>
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#8f1100] font-bold block">
                Needs-Info Inquest from {pendingQuestion.orgName}
              </span>
              <p className="text-xs text-[#1d1c16] font-medium">
                {pendingQuestion.title}: {pendingQuestion.text}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('inbox')}
            className="px-4 py-2 rounded-full bg-[#d9381e] hover:bg-[#b51d04] text-white font-label-sm text-xs uppercase tracking-wider font-semibold shrink-0"
          >
            Answer Question
          </button>
        </div>
      )}

      {/* Attested Chain of Events (from screen_3_timeline) */}
      <section className="mb-6">
        <div className="pb-3 border-b border-[#ddd5c7] flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#414846]">
              CHRONOLOGY OF CUSTODY
            </span>
            <h2 className="font-headline-sm text-lg text-[#1d1c16] font-semibold">
              Attested Chain of Events
            </h2>
          </div>
          <span className="font-label-sm text-xs text-[#414846]">
            {timelineEvents.length} Verified Entries
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[#ddd5c7]/60">
          {timelineEvents.slice().reverse().map((evt, i) => (
            <div key={evt.id || i} className="py-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className={`font-label-md text-xs uppercase font-semibold ${
                  i === 0 ? 'text-[#d9381e]' : 'text-[#1d1c16]'
                }`}>
                  {evt.timestamp}
                </span>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#414846]/80 font-medium">
                  BY {evt.author.toUpperCase()}
                </span>
              </div>
              <p className="font-body-md text-sm text-[#1d1c16] font-medium">
                {evt.title}
              </p>
              <p className="font-body-sm text-xs text-[#414846] mt-1 leading-relaxed">
                {evt.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pickup to be arranged / Escalated Passaged status card */}
      <div className={`rounded-xl p-4 flex items-center justify-between mb-6 border ${
        isEscalated ? 'bg-[#ffdad3]/40 border-[#d9381e]/30' : 'bg-[#ece8df] border-[#ddd5c7]'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#d9381e] text-[22px]">
            {isEscalated ? 'gavel' : 'inventory_2'}
          </span>
          <span className="font-body-sm text-xs sm:text-sm text-[#1d1c16] font-medium">
            {isEscalated 
              ? `Formal dossier passaged & filed with ${activeCase.escalation.targetOrg} under ${activeCase.escalation.statute}. Awaiting regulatory order/reversal.`
              : 'Pickup & inspection to be arranged by seller/carrier'}
          </span>
        </div>
        <span className={`font-label-sm text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
          isEscalated ? 'bg-[#d9381e] text-white' : 'bg-white/60 text-[#414846]'
        }`}>
          {isEscalated ? 'PASSAGED' : 'PENDING DISPATCH'}
        </span>
      </div>

      {/* Controls & Action Buttons */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="w-full h-14 rounded-full bg-[#f2ede4] hover:bg-[#ddd5c7] text-[#1d1c16] font-body-md text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors border border-[#ddd5c7]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span>{copiedHash === 'share' ? 'Dossier Link Copied!' : 'Share with someone'}</span>
          </button>

          <button
            onClick={simulateNextStep}
            className={`w-full h-14 rounded-full text-white font-body-md text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
              isEscalated ? 'bg-[#0f2b25] hover:bg-[#1b3d35]' : 'bg-[#d9381e] hover:bg-[#b51d04]'
            }`}
            type="button"
          >
            <span>{isEscalated ? 'Check Regulatory Docket' : 'Fast-Forward Simulation Step'}</span>
            <span className="material-symbols-outlined text-[20px]">{isEscalated ? 'sync' : 'fast_forward'}</span>
          </button>
        </div>

        {!isEscalated ? (
          <button
            onClick={() => setCurrentScreen('escalation')}
            className="text-center font-label-sm text-xs text-[#8f1100] uppercase tracking-wider py-2 hover:underline"
          >
            Check SLA Timers & Fast-Forward Regulatory Escalation →
          </button>
        ) : (
          <div className="text-center font-label-sm text-xs text-[#d9381e] uppercase tracking-wider py-2 font-semibold">
            ● Case Passaged: Awaiting Statutory Remedy from {activeCase.escalation.targetOrg}
          </div>
        )}
      </div>
    </div>
  );
}
