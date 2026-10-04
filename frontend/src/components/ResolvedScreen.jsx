import React, { useEffect } from 'react';
import { usePassage } from '../context/PassageContext';
import confetti from 'canvas-confetti';

export default function ResolvedScreen() {
  const {
    activeCase,
    timelineEvents,
    switchCase,
    caseKey,
    isEscalated
  } = usePassage();

  const outcome = activeCase.resolvedOutcome;

  useEffect(() => {
    if (isEscalated) return;
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0f2b25', '#d9381e', '#cbd6c6', '#f1dc9a']
      });
    } catch (e) {
      // safe fallback
    }
  }, [isEscalated]);

  const handleDownloadDocket = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      docket: activeCase.docketSerial,
      user: activeCase.user,
      case: activeCase.title,
      outcome: activeCase.resolvedOutcome,
      chain: timelineEvents
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PASSAGE_DOCKET_${activeCase.docketSerial}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="pt-2 pb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isEscalated ? 'bg-[#d9381e]' : 'bg-[#48645c]'}`}></span>
          <span className="font-label-sm text-xs uppercase tracking-widest text-[#67625a]">
            {isEscalated ? 'Regulatory Escalation Docket' : 'Passaged Docket'} • #{activeCase.docketSerial}
          </span>
        </div>
        <h1 className="font-headline-xl text-4xl sm:text-6xl text-[#14181a] tracking-tight">
          Passaged.
        </h1>
        <p className="font-body-lg text-[#67625a] text-base sm:text-lg leading-relaxed max-w-2xl">
          {isEscalated 
            ? `Case passaged and formally submitted to ${activeCase.escalation.targetOrg} under ${activeCase.escalation.statute}. Awaiting regulatory adjudication.`
            : outcome.summary}
        </p>
      </div>

      {/* Hero Stat Block: The Contrast Box */}
      <section className="mb-8">
        <div className="bg-[#f2ede4] rounded-[24px] p-6 sm:p-10 border border-[#ddd5c7] relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Metric 1 */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-headline-xl text-4xl sm:text-5xl text-[#14181a] tracking-tighter font-semibold">
                  {outcome.retellingsAvoided}
                </span>
                <span className="font-headline-sm text-lg text-[#67625a] italic">to</span>
                <span className="font-headline-xl text-4xl sm:text-5xl text-[#d9381e] tracking-tighter font-bold">
                  0
                </span>
              </div>
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#14181a] font-semibold">
                Retellings Avoided
              </span>
              <span className="text-xs text-[#67625a] mt-0.5">
                Zero repetitive phone calls or chats
              </span>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#ddd5c7] pt-4 sm:pt-0 sm:pl-8">
              <span className="font-headline-xl text-4xl sm:text-5xl text-[#0f2b25] tracking-tighter font-semibold mb-1">
                {outcome.hoursSaved}h
              </span>
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#14181a] font-semibold">
                Time Recovered
              </span>
              <span className="text-xs text-[#67625a] mt-0.5">
                Automated multi-party alignment
              </span>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#ddd5c7] pt-4 sm:pt-0 sm:pl-8">
              <span className="font-headline-xl text-4xl sm:text-5xl text-[#14181a] tracking-tighter font-semibold mb-1">
                {outcome.organizationsCoordinated}
              </span>
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#14181a] font-semibold">
                Orgs Reconciled
              </span>
              <span className="text-xs text-[#67625a] mt-0.5">
                Single submission fan-out
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Resolution Docket Card */}
      <section className="bg-white rounded-2xl border border-[#ddd5c7] p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ddd5c7]">
          <div>
            <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-widest">
              Execution Integrity Fingerprint
            </span>
            <h3 className="font-semibold text-base text-[#14181a]">
              {isEscalated ? 'Passaged Regulatory Dossier' : 'Sealed Passaged Package'}
            </h3>
          </div>
          <span className="font-label-sm text-[11px] px-3 py-1 rounded-full font-bold uppercase bg-[#cbd6c6] text-[#0f2b25]">
            PASSAGED
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-label-sm text-[#67625a]">Replacement / Settlement Ref:</span>
            <span className="font-mono font-medium text-[#14181a]">{outcome.replacementOrder}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-label-sm text-[#67625a]">Third-Party Carrier Clearance:</span>
            <span className="font-medium text-[#0f2b25]">{outcome.courierClearance}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-label-sm text-[#67625a]">SHA-256 Merkle Root:</span>
            <span className="font-mono text-[11px] text-[#67625a] truncate max-w-xs">
              {timelineEvents[timelineEvents.length - 1]?.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ddd5c7]">
          <button
            onClick={handleDownloadDocket}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider transition-all shadow-sm font-semibold flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Certified Docket (JSON)</span>
          </button>

          <button
            onClick={() => {
              const nextCase = caseKey === 'case1' ? 'case2' : caseKey === 'case2' ? 'case3' : 'case1';
              switchCase(nextCase);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#f2ede4] hover:bg-[#ddd5c7] text-[#14181a] font-label-sm text-xs uppercase tracking-wider transition-all font-semibold flex items-center justify-center gap-2"
          >
            <span>Next Demo Scenario</span>
            <span className="material-symbols-outlined text-[18px]">skip_next</span>
          </button>
        </div>
      </section>
    </div>
  );
}
