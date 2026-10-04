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
    isCompiling,
    startNewDispute
  } = usePassage();

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addEvidence(e.target.files);
      e.target.value = '';
    }
  };

  // Find most relevant exhibit for the preview docket
  const activePhoto = evidenceList.find(e => e.type === 'photo' && e.url) || evidenceList.find(e => e.url) || null;
  const activeDoc = evidenceList.find(e => e.type === 'invoice' || e.type === 'document' || e.type === 'sms') || evidenceList[0];

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={startNewDispute}
            className="font-label-sm text-[11px] text-[#d9381e] hover:underline uppercase tracking-wider font-semibold cursor-pointer"
          >
            + New Blank Query
          </button>
          <span className="font-label-sm text-xs text-[#414846]/80 uppercase tracking-widest hidden sm:inline">
            Local Session
          </span>
        </div>
      </div>

      {/* Editorial Masthead Headline */}
      <div className="pt-6 pb-5">
        <h1 className="font-headline-xl-mobile sm:font-headline-xl text-3xl sm:text-5xl text-[#1d1c16] tracking-tight leading-tight">
          Tell it <span className="italic font-headline-xl-mobile sm:font-headline-xl font-normal text-[#d9381e]">once</span>.
        </h1>
        <p className="font-body-md text-base sm:text-lg text-[#414846] mt-2 leading-relaxed max-w-prose">
          Enter any dispute or customer service issue. Attach receipts, invoices, and photos. Passage extracts the timeline, resolves counterparties, and generates tailored schemas.
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
            placeholder="What happened? Describe any airline delay, broken delivery, incorrect charge, or service grievance in your own words..."
          />
        </div>

        {/* Evidentiary Attachments Section */}
        <div className="pt-1 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#414846] font-semibold">
              Attached Exhibits ({evidenceList.length})
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-label-sm text-xs uppercase tracking-wider text-[#1d1c16] underline underline-offset-4 decoration-[#c1c8c5] hover:text-[#d9381e] transition-colors inline-flex items-center cursor-pointer font-medium"
            >
              + Upload Documents / Photos
            </button>
          </div>

          {/* Exhibits list */}
          {evidenceList.length === 0 ? (
            <div className="py-4 px-3 rounded-xl border border-dashed border-[#ddd5c7] text-center bg-[#faf7f0]">
              <span className="font-label-sm text-xs text-[#414846]">No attachments yet. Upload photos, invoices, or tickets to substantiate your case.</span>
            </div>
          ) : (
            evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between py-2 px-3 bg-[#f8f3ea] rounded-xl border border-[#ddd5c7]/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {ev.url ? (
                    <img
                      src={ev.url}
                      alt={ev.name}
                      className="w-9 h-9 rounded-md object-cover border border-[#ddd5c7] shrink-0"
                    />
                  ) : (
                    <span className="font-label-sm text-[10px] text-[#414846] uppercase font-bold bg-[#e7e2d9] px-2 py-1 rounded shrink-0">
                      {ev.type === 'invoice' ? 'DOC' : ev.type === 'photo' ? 'IMG' : 'SMS'}
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-xs sm:text-sm text-[#1d1c16] truncate font-medium">
                      {ev.name}
                    </span>
                    <span className="font-label-sm text-[10px] text-[#414846]/70 uppercase">
                      {ev.size} • {ev.tag || 'Substantiation Document'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEvidence(ev.id)}
                  className="font-label-sm text-[11px] uppercase tracking-wider text-[#d9381e] underline underline-offset-2 ml-2 shrink-0 hover:opacity-80 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Evidence Preview Card */}
      <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[#ddd5c7] mb-5">
        <div className="flex items-center justify-between pb-3">
          <span className="font-label-sm text-xs uppercase tracking-wider text-[#414846] font-semibold">
            Exhibit Preview // {activePhoto ? 'Visual Proof' : 'Docket Document'}
          </span>
          <span className="font-label-sm text-xs text-[#414846]">
            {activePhoto ? activePhoto.name : activeDoc ? activeDoc.name : 'Waiting for exhibits'}
          </span>
        </div>
        
        {activePhoto?.url ? (
          <div className="relative w-full h-48 sm:h-60 rounded-xl overflow-hidden bg-[#ece8df] border border-[#ddd5c7] flex items-center justify-center">
            <img
              src={activePhoto.url}
              alt={activePhoto.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2.5 left-2.5 px-3 py-1 bg-[#001511]/80 backdrop-blur-sm rounded-full">
              <span className="font-label-sm text-[10px] text-white tracking-widest uppercase font-semibold">
                Uploaded Ingestion: {activePhoto.name}
              </span>
            </div>
          </div>
        ) : activeDoc ? (
          <div className="w-full py-8 px-6 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] flex flex-col items-center justify-center text-center gap-2">
            <span className="w-12 h-12 rounded-full bg-[#e7e2d9] flex items-center justify-center text-xl font-bold text-[#48645c]">
              📄
            </span>
            <span className="font-body-md text-sm font-semibold text-[#1d1c16]">{activeDoc.name}</span>
            <span className="font-label-sm text-xs text-[#414846]">{activeDoc.preview || activeDoc.tag || 'Attached document ready for verification'}</span>
          </div>
        ) : (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#ece8df] border border-[#ddd5c7] flex flex-col items-center justify-center text-center p-4">
            <span className="font-body-md text-sm text-[#414846]">Upload photos or receipts to render live verification thumbnails in this docket.</span>
          </div>
        )}
      </section>

      {/* AI Compilation Pipeline Card */}
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
                Reading your query & uploaded files
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
                {isCompiling ? 'Extracting entities & resolving Indian authorities...' : 'Entity extraction & multi-organization routing'}
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#ffdad3] text-[#8f1100] font-label-sm text-[10px] tracking-wider uppercase rounded-full shrink-0 font-bold">
              {isCompiling ? 'ACTIVE' : 'READY'}
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7]/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-label-sm text-xs text-[#414846]/60">03</span>
              <span className="font-body-sm text-xs sm:text-sm text-[#414846]/80 truncate">
                Synthesizing schema-constrained drafts
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
              Passage Resolution Engine
            </span>
            <span className="font-label-sm text-[10px] tracking-widest font-semibold">
              Ready
            </span>
          </div>
        </div>
      </section>

      {/* Primary Action Dispatch Button */}
      <div className="flex flex-col gap-2">
        <button
          id="build-passage-btn"
          type="button"
          disabled={isCompiling || !narrative.trim()}
          onClick={compilePassage}
          className="w-full h-14 bg-[#001511] hover:bg-[#0f2b25] text-white rounded-full font-body-md text-base font-semibold tracking-wide flex items-center justify-center transition-transform active:scale-[0.99] shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isCompiling ? (
            <span className="font-label-md text-xs tracking-widest uppercase text-white flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Indexing Dossier...</span>
            </span>
          ) : (
            <span>Build my Message</span>
          )}
        </button>

        {/* Bottom Assurance Note */}
        <div className="flex items-center justify-center gap-2 py-1 text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#48645c]" />
          <p className="font-label-sm text-xs text-[#414846] tracking-normal">
            Your statement and evidence are cryptographically hashed into an unalterable dossier.
          </p>
        </div>
      </div>
    </div>
  );
}
