import React, { useState } from 'react';
import { usePassage } from '../context/PassageContext';

export default function DraftsScreen() {
  const {
    activeCase,
    organizations,
    drafts,
    evidenceList,
    relayConsent,
    setRelayConsent,
    approveAndDispatch,
    isDispatching
  } = usePassage();

  // Selected recipient organization
  const [selectedOrgSlug, setSelectedOrgSlug] = useState(organizations[0]?.slug || 'swiftroute');

  // Granular permissions per organization
  const [permissions, setPermissions] = useState({
    swiftroute: {
      problemSummary: true,
      orderDetails: true,
      invoice: false, // Redacted for courier!
      boxPhoto: true,
      innerPhotos: true,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: false // Redacted for courier!
    },
    shopmart: {
      problemSummary: true,
      orderDetails: true,
      invoice: true,
      boxPhoto: true,
      innerPhotos: true,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: true
    },
    cardissuer: {
      problemSummary: true,
      orderDetails: true,
      invoice: true,
      boxPhoto: false,
      innerPhotos: false,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: true
    },
    payeasy: {
      problemSummary: true,
      orderDetails: true,
      invoice: false,
      boxPhoto: false,
      innerPhotos: false,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: true
    },
    northfield: {
      problemSummary: true,
      orderDetails: true,
      invoice: true,
      boxPhoto: false,
      innerPhotos: false,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: true
    },
    open311: {
      problemSummary: true,
      orderDetails: false,
      invoice: false,
      boxPhoto: true,
      innerPhotos: true,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: false
    },
    powerutility: {
      problemSummary: true,
      orderDetails: false,
      invoice: false,
      boxPhoto: true,
      innerPhotos: false,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: false
    },
    shieldmotor: {
      problemSummary: true,
      orderDetails: true,
      invoice: true,
      boxPhoto: true,
      innerPhotos: true,
      deliveryTimestamp: true,
      phoneNumber: true,
      paymentDetails: true
    }
  });

  const selectedOrg = organizations.find(o => o.slug === selectedOrgSlug) || organizations[0];
  const orgPerms = permissions[selectedOrg.slug] || {
    problemSummary: true,
    orderDetails: true,
    invoice: false,
    boxPhoto: true,
    innerPhotos: true,
    deliveryTimestamp: true,
    phoneNumber: true,
    paymentDetails: false
  };

  const handleToggle = (key, val) => {
    setPermissions(prev => ({
      ...prev,
      [selectedOrg.slug]: {
        ...(prev[selectedOrg.slug] || orgPerms),
        [key]: val
      }
    }));
  };

  const activeDraft = drafts[selectedOrg.slug] || drafts[Object.keys(drafts)[0]];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Folio Header Line */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-xs uppercase tracking-widest text-[#67625a]">
            FOLIO Nº {activeCase.docketSerial} // {selectedOrg.name.toUpperCase()}
          </span>
          <span className="font-label-sm text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ece8df] text-[#414846] font-medium">
            STAGE 04/04
          </span>
        </div>
        <h1 className="font-headline-lg-mobile sm:font-headline-lg text-2xl sm:text-4xl text-[#1d1c16] tracking-tight mt-1 font-normal">
          Who is this <span className="italic font-headline-lg-mobile sm:font-headline-lg">going to</span>?
        </h1>
      </div>

      {/* Recipient Selector / Input */}
      <section className="flex flex-col gap-1.5 mb-6">
        <label className="font-label-sm text-xs uppercase tracking-widest text-[#414846] font-medium" htmlFor="recipient-select">
          01 // ORGANIZATION OR PERSON
        </label>
        <div className="relative w-full">
          <select
            id="recipient-select"
            value={selectedOrgSlug}
            onChange={(e) => setSelectedOrgSlug(e.target.value)}
            className="w-full bg-white text-[#1d1c16] font-body-md text-base px-4 py-3.5 rounded-[14px] shadow-sm border border-[#ddd5c7] focus:outline-none focus:bg-[#f8f3ea] transition-colors appearance-none cursor-pointer font-medium"
          >
            {organizations.map(org => (
              <option key={org.slug} value={org.slug}>
                {org.name} — {org.category}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#414846]">
            <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
          </div>
        </div>
      </section>

      {/* 02 // WHAT THEY CAN SEE · PERMISSIONS ENCLOSED (The Segmented On/Off Buttons) */}
      <section className="flex flex-col mb-8">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-label-sm text-xs uppercase tracking-widest text-[#414846] font-medium">
            02 // WHAT THEY CAN SEE · PERMISSIONS ENCLOSED
          </span>
          <span className="font-label-sm text-[11px] text-[#0f2b25] bg-[#cbd6c6]/50 px-2 py-0.5 rounded font-semibold uppercase">
            {Object.values(orgPerms).filter(Boolean).length} of 8 Enclosed
          </span>
        </div>

        {/* Toggles Container */}
        <div className="flex flex-col bg-white rounded-[16px] shadow-sm border border-[#ddd5c7] overflow-hidden p-1.5 divide-y divide-[#f2ede4]">
          {/* Toggle 1: Problem summary */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#48645c] text-[20px]">description</span>
              <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Problem summary</span>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('problemSummary', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.problemSummary
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('problemSummary', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.problemSummary
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Toggle 2: Order details */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#48645c] text-[20px]">inventory_2</span>
              <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Order details</span>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('orderDetails', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.orderDetails
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('orderDetails', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.orderDetails
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Toggle 3: Invoice */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#48645c] text-[20px]">receipt_long</span>
              <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Invoice & Price</span>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('invoice', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.invoice
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('invoice', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.invoice
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Toggle 4: Box photo */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#48645c] text-[20px]">photo_camera</span>
              <div className="flex items-center gap-2">
                <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Box exterior photo</span>
                <span className="font-label-sm text-[10px] text-[#b51d04] bg-[#ffdad6]/60 px-1.5 py-0.2 rounded font-semibold">
                  1 Attached
                </span>
              </div>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('boxPhoto', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.boxPhoto
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('boxPhoto', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.boxPhoto
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Toggle 5: Inner damaged items */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#48645c] text-[20px]">broken_image</span>
              <div className="flex items-center gap-2">
                <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Inner damaged goods photos</span>
                <span className="font-label-sm text-[10px] text-[#48645c] bg-[#cbd6c6]/50 px-1.5 py-0.2 rounded font-semibold">
                  Exhibit 02
                </span>
              </div>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('innerPhotos', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.innerPhotos
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('innerPhotos', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.innerPhotos
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Toggle 6: Delivery timestamp */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#48645c] text-[20px]">schedule</span>
              <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Delivery timestamp & carrier log</span>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('deliveryTimestamp', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.deliveryTimestamp
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('deliveryTimestamp', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.deliveryTimestamp
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Toggle 7: Your phone number */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#414846]/60 text-[20px]">call</span>
              <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Your phone number</span>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('phoneNumber', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.phoneNumber
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('phoneNumber', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.phoneNumber
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Toggle 8: Payment details */}
          <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#f8f3ea]/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#414846]/60 text-[20px]">credit_card</span>
              <span className="font-body-sm text-sm text-[#1d1c16] font-medium">Payment & bank details</span>
            </div>
            <div className="flex bg-[#f2ede4] rounded-full p-0.5 shrink-0" role="group">
              <button
                type="button"
                onClick={() => handleToggle('paymentDetails', true)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  orgPerms.paymentDetails
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => handleToggle('paymentDetails', false)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs transition-all ${
                  !orgPerms.paymentDetails
                    ? 'bg-[#001511] text-white font-medium shadow-xs'
                    : 'text-[#414846]/70 hover:text-[#1d1c16]'
                }`}
              >
                Off
              </button>
            </div>
          </div>
        </div>

        {/* Assurance text */}
        <div className="flex items-center gap-2 mt-3 px-1 text-xs text-[#414846]">
          <span className="material-symbols-outlined text-[#48645c] text-[18px]">verified_user</span>
          <p className="font-label-sm text-xs">
            They will not see anything you leave Off. Encrypted projection generated per recipient schema.
          </p>
        </div>
      </section>

      {/* 03 // BRIEF FOR THEM (PASSAGE CARD EXCERPT - The Notched Card Motif) */}
      <section className="flex flex-col mb-8">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-label-sm text-xs uppercase tracking-widest text-[#414846] font-medium">
            03 // BRIEF FOR THEM (PASSAGE CARD EXCERPT)
          </span>
          <span className="font-label-sm text-xs text-[#b51d04] uppercase tracking-wider font-semibold">
            {selectedOrg.ticketType}
          </span>
        </div>

        {/* The Notched Card Container */}
        <div className="relative bg-white rounded-[20px] shadow-sm border border-[#ddd5c7] p-6 sm:p-8 overflow-hidden">
          {/* Semicircular ticket punch notches */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fef9f0] border-r border-[#ddd5c7]" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fef9f0] border-l border-[#ddd5c7]" />

          <div className="flex flex-col relative z-10">
            {/* Notched card header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ddd5c7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b51d04] text-[20px]">verified</span>
                <span className="font-label-sm text-xs uppercase tracking-wider text-[#1d1c16] font-semibold">
                  {selectedOrg.name} Manifest Dossier
                </span>
              </div>
              <span className="font-label-sm text-xs text-[#414846] font-mono">
                #{selectedOrg.ticketRef}
              </span>
            </div>

            {/* Brief Narrative */}
            <p className="font-body-md text-sm sm:text-base text-[#1d1c16] leading-relaxed pr-4 mb-4">
              {selectedOrg.slug === 'swiftroute' ? (
                <>SwiftRoute needs to inspect a damaged parcel delivered on {orgPerms.deliveryTimestamp ? '2 October at 6:42 pm (AWB: SR-882190)' : '[Timestamp log withheld]'}. {orgPerms.boxPhoto ? 'The box photo shows severe crushing on one corner.' : '[Box exterior photo withheld]'} {orgPerms.innerPhotos ? 'Four ceramic plates fractured in transit.' : '[Inner damage photos withheld]'} {orgPerms.invoice ? 'Invoice attached.' : 'Invoice and price details withheld.'} {orgPerms.phoneNumber ? 'Phone: +91 98201 44812.' : '[Phone number withheld]'}</>
              ) : selectedOrg.slug === 'shopmart' ? (
                <>Sahyadri Home Goods order {orgPerms.orderDetails ? 'SHG-20418' : '[Order ID withheld]'} delivered damaged via SwiftRoute. {orgPerms.problemSummary ? 'Requesting direct replacement of damaged dinner set.' : '[Problem summary withheld]'} {orgPerms.invoice ? 'Invoice & price ₹4,299 attached.' : 'Invoice withheld.'} {orgPerms.boxPhoto || orgPerms.innerPhotos ? 'Transit damage verified with photographic exhibits.' : '[Photographic proof withheld]'}</>
              ) : (
                <>{activeDraft?.title}: {orgPerms.problemSummary ? activeCase.narrative : '[Problem summary withheld]'}</>
              )}
            </p>

            {/* Photographic exhibit attachment inside brief */}
            {(orgPerms.boxPhoto || orgPerms.innerPhotos) && (
              <div className="p-3 bg-[#f8f3ea] rounded-xl border border-[#ddd5c7] flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#e7e2d9] border border-[#ddd5c7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-[#48645c]">image</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-xs text-[#1d1c16] font-semibold truncate">
                    {orgPerms.boxPhoto ? 'IMG_0842_DAMAGE.JPG' : 'EXHIBIT_02_INNER_DAMAGE.JPG'}
                  </span>
                  <span className="font-label-sm text-[11px] text-[#414846]">
                    Photographic proof attached • {orgPerms.boxPhoto && orgPerms.innerPhotos ? '2 Exhibits Enclosed' : '1 Exhibit Enclosed'}
                  </span>
                </div>
              </div>
            )}

            {/* Custody Transfer & The DISPATCH READY Stamp */}
            <div className="mt-4 pt-4 border-t border-[#ddd5c7] flex items-end justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] uppercase text-[#414846] tracking-wider font-semibold">
                  CUSTODY TRANSFER
                </span>
                <span className="font-label-md text-sm text-[#1d1c16] font-semibold tracking-normal">
                  Direct Escrow Notification
                </span>
                <span className="text-[11px] text-[#414846]">
                  Channel: {selectedOrg.channel}
                </span>
              </div>

              {/* Rotated Archival Rubber Stamp */}
              <div className="shrink-0 rotate-6 select-none pointer-events-none">
                <div className="rounded-full px-3.5 py-2 border-2 border-[#b51d04] bg-[#ffdad3]/20 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="font-label-sm text-[10px] text-[#b51d04] font-bold tracking-widest leading-none uppercase">
                    DISPATCH READY
                  </span>
                  <span className="font-label-sm text-[9px] text-[#b51d04] font-mono tracking-tighter leading-tight mt-0.5">
                    OCT 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Org Outcome Relay Consent Box */}
      <section className="bg-[#cbd6c6]/40 rounded-2xl border border-[#cbd6c6] p-4 sm:p-5 mb-8">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="relay-checkbox"
            checked={relayConsent}
            onChange={(e) => setRelayConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[#0f2b25] text-[#0f2b25] focus:ring-0 cursor-pointer"
          />
          <label htmlFor="relay-checkbox" className="cursor-pointer text-xs text-[#1d1c16] leading-relaxed">
            <span className="font-semibold block mb-0.5">Automated Evidence Relay</span>
            Allow Passage to forward the courier's inspection result directly to the seller when completed, without asking me to manually download and email it.
          </label>
        </div>
      </section>

      {/* Primary Action Button: 56px Pill "Send Passage" */}
      <div className="w-full flex flex-col items-center">
        <button
          id="send-passage-btn"
          type="button"
          disabled={isDispatching}
          onClick={approveAndDispatch}
          className="w-full h-14 bg-[#d9381e] hover:bg-[#b51d04] text-white font-body-md text-base font-semibold rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-75"
        >
          {isDispatching ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              <span>Sealing Folio & Dispatching...</span>
            </>
          ) : (
            <>
              <span>Send Passage</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </>
          )}
        </button>

        <span className="font-label-sm text-xs text-[#414846] uppercase tracking-widest mt-3 text-center">
          Cryptographically signed folio transmission • Local SHA-256 Provenance
        </span>
      </div>
    </div>
  );
}
