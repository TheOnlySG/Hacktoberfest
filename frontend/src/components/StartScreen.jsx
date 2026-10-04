import React, { useRef } from 'react';
import { usePassage } from '../context/PassageContext';

export default function StartScreen() {
  const {
    activeCase,
    narrative,
    setNarrative,
    evidenceList,
    addEvidence,
    removeEvidence,
    compilePassage,
    isCompiling
  } = usePassage();

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addEvidence(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Archival Docket Stamp / Classification */}
      <div className="flex items-center justify-between pt-2 pb-2.5 border-b border-[#ddd5c7]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d9381e]"></span>
          <span className="font-label-sm text-xs uppercase tracking-widest text-[#414846]">
            Intake Dossier / Serial {activeCase.docketSerial}
          </span>
        </div>
        <span className="font-label-sm text-xs text-[#414846]/80 uppercase tracking-widest">
          Local Session
        </span>
      </div>

      {/* Editorial Masthead Headline */}
      <div className="pt-6 pb-5">
        <h1 className="font-headline-xl-mobile sm:font-headline-xl text-3xl sm:text-5xl text-[#1d1c16] tracking-tight leading-tight">
          Tell it <span className="italic font-headline-xl-mobile sm:font-headline-xl font-normal text-[#d9381e]">once</span>.
        </h1>
        <p className="font-body-md text-base sm:text-lg text-[#414846] mt-2 leading-relaxed max-w-prose">
          Describe what happened. Add your receipts and photos. Passage turns it into one verified record you can hand to anyone.
        </p>
      </div>

      {/* Primary Narrative Input Card (Passport Leaf Motif) */}
      <section className="bg-white rounded-[20px] shadow-sm border border-[#ddd5c7] p-5 sm:p-6 mb-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="font-label-sm text-xs uppercase tracking-wider text-[#414846] font-semibold" htmlFor="narrative-statement">
            First-Party Statement
          </label>
          <span className="font-label-sm text-[11px] text-[#414846]/70 tracking-widest uppercase">
            Verified Entry
          </span>
        </div>

        {/* Statement Textarea */}
        <div className="relative bg-[#f8f3ea] rounded-xl p-3 border border-[#ddd5c7]">
          <textarea
            id="narrative-statement"
            rows={5}
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            className="w-full bg-transparent font-body-md text-sm sm:text-base text-[#1d1c16] focus:outline-none resize-none leading-relaxed placeholder:text-[#414846]/50"
            placeholder="What happened? Write it the way you would tell a friend."
          />
        </div>

        {/* Evidentiary Attachments Section */}
        <div className="pt-1 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#414846] font-semibold">
              Attached Exhibits
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-label-sm text-xs uppercase tracking-wider text-[#1d1c16] underline underline-offset-4 decoration-[#c1c8c5] hover:text-[#d9381e] transition-colors inline-flex items-center cursor-pointer"
            >
              + Add files
            </button>
          </div>

          {/* Exhibits list */}
          {evidenceList.map((ev, i) => (
            <div
              key={ev.id}
              className="flex items-center justify-between py-2 px-3 bg-[#f8f3ea] rounded-xl border border-[#ddd5c7]/60"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-label-sm text-[10px] text-[#414846] uppercase font-bold bg-[#e7e2d9] px-1.5 py-0.5 rounded">
                  {ev.type === 'invoice' ? 'DOC' : ev.type === 'photo' ? 'IMG' : 'SMS'}
                </span>
                <span className="font-label-md text-xs sm:text-sm text-[#1d1c16] truncate font-medium">
                  {ev.name}
                </span>
                <span className="font-label-sm text-[10px] text-[#414846]/60 uppercase shrink-0">
                  {ev.size}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeEvidence(ev.id)}
                className="font-label-sm text-[11px] uppercase tracking-wider text-[#d9381e] underline underline-offset-2 ml-2 shrink-0 hover:opacity-80 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence Preview Card */}
      {(() => {
        const uploadedImg = evidenceList.slice().reverse().find(e => e.previewUrl);
        const defaultImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuBw3aFZ6gMOWHGkS844SjvfP65zybGcIK95vPzNeveuzNyuJ0lIUjbnydp4GpcTrGAGjY93n_EHMLGYD5hLZpL-Zd_XL2tK5wKzFSgk9Bz1sGAQiWg0eOQAnus0g_vyXkuaaVG5vdKi0XEFcws5aI1FZpK36Dtvwd_Z11pJFyHpA0AL6CW-zyTSjwsxWuqLQUMeUyM4ysifMStA0PPkbs80flpatBZTUp6L5urtOYZ0ZDDuqvRqo7oO";
        const imgSrc = uploadedImg ? uploadedImg.previewUrl : defaultImg;
        const imgName = uploadedImg ? uploadedImg.name : "Visual Damage Verification";

        return (
          <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[#ddd5c7] mb-5">
            <div className="flex items-center justify-between pb-3">
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#414846] font-semibold">
                Exhibit Preview // 01
              </span>
              <span className="font-label-sm text-xs text-[#414846] truncate max-w-[200px]">
                {imgName}
              </span>
            </div>
            <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-[#ece8df] border border-[#ddd5c7] flex items-center justify-center">
              <img
                src={imgSrc}
                alt="Exhibit evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 px-3 py-1 bg-[#001511]/80 backdrop-blur-sm rounded-full">
                <span className="font-label-sm text-[10px] text-white tracking-widest uppercase font-semibold">
                  Verified Ingestion
                </span>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Local Compilation Pipeline Card (from screen_1_start) */}
      <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[#ddd5c7] mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#414846]">
              Assembly Engine
            </span>
            <span className="font-headline-sm text-lg text-[#1d1c16] font-semibold">
              Compilation Pipeline
            </span>
          </div>
          <span className="font-label-sm text-xs text-[#d9381e] tracking-widest uppercase font-semibold">
            Stage 2 of 3
          </span>
        </div>

        {/* Stepper Block with Pure Editorial Framing */}
        <div className="flex flex-col gap-2">
          {/* Step 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-label-sm text-xs text-[#414846]">01</span>
              <span className="font-body-sm text-xs sm:text-sm text-[#1d1c16] font-medium truncate">
                Reading your files
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#cae9df] text-[#03201a] font-label-sm text-[10px] tracking-wider uppercase rounded-full shrink-0 font-bold">
              COMPLETED
            </span>
          </div>

          {/* Step 2 (Active Highlight) */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffdad3]/40 border border-[#d9381e]/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-label-sm text-xs text-[#d9381e] font-bold">02</span>
              <span className="font-body-sm text-xs sm:text-sm text-[#1d1c16] font-medium truncate">
                Finding the timeline & counterparties
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#ffdad3] text-[#8f1100] font-label-sm text-[10px] tracking-wider uppercase rounded-full shrink-0 font-bold">
              IN PROGRESS
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-label-sm text-xs text-[#414846]/60">03</span>
              <span className="font-body-sm text-xs sm:text-sm text-[#414846]/80 truncate">
                Writing the draft tickets
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#e7e2d9] text-[#414846] font-label-sm text-[10px] tracking-wider uppercase rounded-full shrink-0 font-medium">
              QUEUED
            </span>
          </div>
        </div>

        {/* Solid Archival Meter (No Gradients) */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="w-full h-1.5 bg-[#e7e2d9] rounded-full overflow-hidden">
            <div className="h-full bg-[#001511] w-2/3 transition-all duration-300" />
          </div>
          <div className="flex justify-between items-center text-[#414846]">
            <span className="font-label-sm text-[10px] tracking-widest uppercase">
              Fast LPU AI Engine (Groq)
            </span>
            <span className="font-label-sm text-[10px] tracking-widest font-semibold">
              68%
            </span>
          </div>
        </div>
      </section>

      {/* Primary Action Dispatch Button (56px Pill from screen_1_start) */}
      <div className="flex flex-col gap-2">
        <button
          id="build-passage-btn"
          type="button"
          disabled={isCompiling}
          onClick={compilePassage}
          className="w-full h-14 bg-[#001511] hover:bg-[#0f2b25] text-white rounded-full font-body-md text-base font-semibold tracking-wide flex items-center justify-center transition-transform active:scale-[0.99] shadow-sm disabled:opacity-75"
        >
          {isCompiling ? (
            <span className="font-label-md text-xs tracking-widest uppercase text-white flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Indexing Dossier with Groq...</span>
            </span>
          ) : (
            <span>Build my Passage</span>
          )}
        </button>

        {/* Bottom Assurance Note */}
        <div className="flex items-center justify-center gap-2 py-1 text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#48645c]" />
          <p className="font-label-sm text-xs text-[#414846] tracking-normal">
            Your files are read on this device. Zero proprietary LLM API in the loop.
          </p>
        </div>
      </div>
    </div>
  );
}
