import React, { useState, useEffect, useRef } from 'react';
import { usePassage } from '../context/PassageContext';

// Web Audio API synthesized notification chime
function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Harmonic chime note 1 (E5 - 659 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Harmonic chime note 2 (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.1);
    gain2.gain.setValueAtTime(0.18, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Non-blocking if audio blocked by browser policy
  }
}

// Generate dynamic inquiry tailored specifically to custom queries and demo cases
function generateDynamicInquiry({ activeCase, narrative, organizations, caseKey }) {
  const primaryOrg = organizations[0] || {
    name: 'Primary Counterparty',
    slug: 'counterparty',
    ticketRef: 'DOCK-REQ-101'
  };

  const combinedText = `${narrative || ''} ${activeCase?.narrative || ''} ${primaryOrg.name || ''}`.toLowerCase();
  const serial = activeCase?.docketSerial || 'PASS-2026-LIVE';

  // Demo Case 1: E-Commerce / Ceramic Dinner Set Transit Damage
  if (activeCase?.id === 'case1' || caseKey === 'case1' || (combinedText.includes('ceramic') && combinedText.includes('sahyadri'))) {
    return {
      id: `inq-case1-${Date.now()}`,
      orgSlug: 'swiftroute',
      orgName: 'SwiftRoute Logistics Dispatch Desk',
      ticketRef: 'SR-INSP-4019',
      title: 'Confirm Physical Inspection Window for Damaged Consignment',
      text: `Regarding AWB #SR-882190 (Docket #${serial}): Field Inspector #84 (Sunil Jadhav) is scheduled for your Pune sector. Please confirm your preferred 3-hour slot for on-site damage assessment of the 16-piece dinner set.`,
      options: [
        'Tomorrow (05 Oct) 10:00 AM – 01:00 PM IST (Consignee present at address)',
        'Tomorrow (05 Oct) 02:00 PM – 05:00 PM IST (Leave with security guard / neighbor)',
        'Expedite direct replacement without field visit (High-res transit photo verified)'
      ]
    };
  }

  // Demo Case 2: Banking / Failed UPI Transaction
  if (activeCase?.id === 'case2' || caseKey === 'case2' || combinedText.includes('upi') || combinedText.includes('northfield') || combinedText.includes('payeasy')) {
    return {
      id: `inq-case2-${Date.now()}`,
      orgSlug: 'northfield',
      orgName: 'Northfield Bank Grievance Cell',
      ticketRef: 'NOFT-REV-9021',
      title: 'Confirm Remitter Account Identifier for UPI Auto-Reversal',
      text: `Regarding UPI transaction dispute #${serial} for ₹6,850: Northfield automated core gateway requires confirmation of your remitter account branch to credit funds under NPCI UDIR protocol.`,
      options: [
        'Bellandur Outer Ring Road Branch (IFSC: NOFT0004128)',
        'Indiranagar 100ft Road Branch (IFSC: NOFT0001092)',
        'Direct credit to primary UPI VPA without manual branch routing'
      ]
    };
  }

  // Demo Case 3: Civic Water Main Burst / Submerged Vehicle
  if (activeCase?.id === 'case3' || caseKey === 'case3' || (combinedText.includes('bescom') && combinedText.includes('shield'))) {
    return {
      id: `inq-case3-${Date.now()}`,
      orgSlug: 'shieldmotor',
      orgName: 'Shield Motor Insurance Claims Desk',
      ticketRef: 'SHD-CLM-77192',
      title: 'Surveyor Hydrostatic Lock Assessment & Engine Verification',
      text: `Regarding municipal flood claim for vehicle KA-02-JH-4419 (Docket #${serial}): Surveyor #19 requires confirmation under Clause 4.2 regarding whether the ignition was cranked after water entered the exhaust pipe.`,
      options: [
        'No — Ignition remained strictly off throughout (Zero cranking attempted)',
        'Vehicle was stationary and untouched since parking before the burst',
        'Direct surveyor to authorized service center for diagnostic teardown'
      ]
    };
  }

  // Dynamic Custom Query: Flight / Airline / DGCA
  if (combinedText.includes('flight') || combinedText.includes('airline') || combinedText.includes('air') || combinedText.includes('indigo') || combinedText.includes('spicejet') || combinedText.includes('baggage') || combinedText.includes('dgca')) {
    return {
      id: `inq-custom-flight-${Date.now()}`,
      orgSlug: primaryOrg.slug || 'airline-desk',
      orgName: `${primaryOrg.name || 'Airline'} Passenger Redressal Desk`,
      ticketRef: primaryOrg.ticketRef || `AIR-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Baggage Claim & Passenger Charter Verification from ${primaryOrg.name || 'Airline'}`,
      text: `Regarding flight docket #${serial}: Our customer claims unit has ingested your statement. In accordance with DGCA Passenger Charter regulations, please confirm your preferred settlement resolution mode.`,
      options: [
        'Expedited tracing & direct courier delivery of baggage to residence address',
        'Immediate statutory financial compensation under DGCA CAR Section 3 (up to ₹20,000)',
        'Issue formal Non-Traceable Baggage Certificate for travel insurance claim settlement'
      ]
    };
  }

  // Dynamic Custom Query: Bank / Payment / Card / Loan
  if (combinedText.includes('bank') || combinedText.includes('card') || combinedText.includes('payment') || combinedText.includes('debit') || combinedText.includes('rbi') || combinedText.includes('hdfc') || combinedText.includes('sbi')) {
    return {
      id: `inq-custom-bank-${Date.now()}`,
      orgSlug: primaryOrg.slug || 'bank-desk',
      orgName: `${primaryOrg.name || 'Banking'} Dispute Redressal Cell`,
      ticketRef: primaryOrg.ticketRef || `BNK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Transaction Dispute & Reversal Inquest from ${primaryOrg.name || 'Bank'}`,
      text: `Regarding banking dispute #${serial}: Dispute reconciliation desk requires consumer verification to release escrow and execute credit reversal under RBI TAT guidelines.`,
      options: [
        'No reversal credit received; demand immediate statutory credit under RBI T+5 circular',
        'Partial debit recorded; demand full ledger reconciliation & dispute reference closure',
        'Escalate docket directly to RBI Ombudsman CMS Portal for statutory delay compensation'
      ]
    };
  }

  // Dynamic Custom Query: Civic / Municipal / Water / Electricity / Roads
  if (combinedText.includes('water') || combinedText.includes('road') || combinedText.includes('electricity') || combinedText.includes('drain') || combinedText.includes('municipal') || combinedText.includes('corporation')) {
    return {
      id: `inq-custom-civic-${Date.now()}`,
      orgSlug: primaryOrg.slug || 'civic-desk',
      orgName: `${primaryOrg.name || 'Municipal Corporation'} Ward Assistance Cell`,
      ticketRef: primaryOrg.ticketRef || `CIVIC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Field Inspection & Access Verification for Docket #${serial}`,
      text: `The municipal engineering division has registered docket #${serial}. Please confirm physical accessibility and inspection availability for our ward verification team.`,
      options: [
        'Site is accessible immediately; municipal team may inspect at any time today',
        'Schedule inspection for tomorrow morning (09:00 AM – 12:00 PM IST)',
        'Escalate directly to Municipal Commissioner & District Disaster Management Authority'
      ]
    };
  }

  // Dynamic Custom Query: E-Commerce / Merchant / Logistics
  if (combinedText.includes('order') || combinedText.includes('delivery') || combinedText.includes('courier') || combinedText.includes('amazon') || combinedText.includes('flipkart') || combinedText.includes('refund') || combinedText.includes('return')) {
    return {
      id: `inq-custom-ecom-${Date.now()}`,
      orgSlug: primaryOrg.slug || 'merchant-desk',
      orgName: `${primaryOrg.name || 'Merchant'} Claims & Resolution Desk`,
      ticketRef: primaryOrg.ticketRef || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Shipment Resolution & Return Protocol for Docket #${serial}`,
      text: `Our returns management desk has reviewed your uploaded evidence. Please confirm your preferred replacement or refund processing mode to conclude this docket.`,
      options: [
        'Immediate doorstep courier pickup with instant refund to original payment source',
        'Express direct replacement shipment with transit damage insurance coverage',
        'Full replacement plus merchant credit note for transit delay and inconvenience'
      ]
    };
  }

  // General Custom Fallback
  return {
    id: `inq-custom-gen-${Date.now()}`,
    orgSlug: primaryOrg.slug || 'counterparty-desk',
    orgName: `${primaryOrg.name || 'Organization'} Grievance Desk`,
    ticketRef: primaryOrg.ticketRef || `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `Docket Clarification & Settlement Request from ${primaryOrg.name || 'Organization'}`,
    text: `Regarding docket #${serial}: Our resolution team has ingested your statement and exhibits. To conclude settlement swiftly, please confirm your preferred remediation pathway.`,
    options: [
      'Full monetary reimbursement and statutory compensation to original payment account',
      'Immediate expedited service rectification with formal written incident report',
      'Forward complete docket directly to statutory regulatory body for binding order'
    ]
  };
}

export default function InboxScreen() {
  const {
    caseKey,
    activeCase,
    narrative,
    organizations,
    pendingQuestion,
    setPendingQuestion,
    answeredQuestions,
    answerQuestion,
    setCurrentScreen
  } = usePassage();

  const [selectedOption, setSelectedOption] = useState('');
  const [justArrived, setJustArrived] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [isWaitingForInbound, setIsWaitingForInbound] = useState(false);
  const [inboundToast, setInboundToast] = useState(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // Sync selected option when pending question changes
  useEffect(() => {
    if (pendingQuestion?.options?.length) {
      setSelectedOption(pendingQuestion.options[0]);
    }
  }, [pendingQuestion]);

  // Clean up timers
  const clearAllTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Trigger the 3-second incoming dispatch flow
  const triggerInboundDispatch = () => {
    clearAllTimers();
    setIsWaitingForInbound(true);
    setSecondsLeft(3);

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      const dynamicInq = generateDynamicInquiry({
        activeCase,
        narrative,
        organizations,
        caseKey
      });

      setPendingQuestion(dynamicInq);
      setIsWaitingForInbound(false);
      setJustArrived(true);

      // Play audio notification chime
      playNotificationChime();

      // Show toast
      setInboundToast({
        orgName: dynamicInq.orgName,
        title: dynamicInq.title,
        time: 'Just now'
      });

      setTimeout(() => setJustArrived(false), 2500);
      setTimeout(() => setInboundToast(null), 5000);
    }, 3000);
  };

  // On mount or when visiting this section:
  // If there's no pending question, or even if we just entered the section, trigger the 3-second pop-up!
  useEffect(() => {
    // If no pending question exists, start the 3-second timer
    if (!pendingQuestion) {
      triggerInboundDispatch();
    }
    return () => clearAllTimers();
  }, [caseKey, activeCase?.docketSerial]);

  // Handle user answering
  const handleAnswerSubmit = () => {
    if (!selectedOption) return;
    answerQuestion(selectedOption);
    setInboundToast({
      orgName: pendingQuestion?.orgName || 'Counterparty',
      title: 'Answer Cryptographically Relayed & Logged to Docket',
      time: 'Confirmed'
    });
    setTimeout(() => setInboundToast(null), 4000);
  };

  const primaryOrgName = organizations[0]?.name || 'Counterparty';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast Notification Banner */}
      {inboundToast && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-[#001511] text-white p-4 rounded-2xl shadow-2xl border border-[#48645c] flex items-start gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-[#d9381e] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] text-[#cae9df] font-label-sm uppercase tracking-wider">
              <span>{inboundToast.orgName}</span>
              <span>{inboundToast.time}</span>
            </div>
            <p className="text-xs font-medium text-white truncate mt-0.5">
              {inboundToast.title}
            </p>
          </div>
        </div>
      )}

      {/* Docket / Meta Header Line */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#ddd5c7]">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-xs text-[#67625a] uppercase tracking-widest">
            Discrepancy Inquest // {activeCase.docketSerial}
          </span>
          <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#cbd6c6]/60 text-[#0f2b25] font-semibold uppercase">
            {caseKey === 'case1' ? 'Demo 1' : caseKey === 'case2' ? 'Demo 2' : caseKey === 'case3' ? 'Demo 3' : 'Custom Dispute'}
          </span>
        </div>
        <span className="font-label-sm text-xs text-[#d9381e] flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#d9381e] animate-pulse"></span>
          {pendingQuestion
            ? '1 Inquest Action Required'
            : isWaitingForInbound
            ? `Inbound Transmission Syncing (${secondsLeft}s)`
            : 'Encrypted Relay Connected'}
        </span>
      </div>

      {/* Main Headline */}
      <div className="mb-8">
        <h1 className="font-headline-xl text-3xl sm:text-5xl text-[#14181a] tracking-tight leading-none mb-3">
          Questions for <em className="italic font-normal text-[#d9381e]">you</em>.
        </h1>
        <p className="font-body-lg text-[#67625a] text-base sm:text-lg leading-relaxed max-w-2xl">
          Answer only what organizations cannot resolve between themselves. Passage relays each answer directly to its counterparty under your consent rules.
        </p>
      </div>

      {/* State 1: Active Incoming Inquest Waiting Card (3-second countdown indicator) */}
      {isWaitingForInbound && !pendingQuestion && (
        <div className="bg-gradient-to-r from-[#f8f3ea] to-white rounded-[20px] border-2 border-dashed border-[#d9381e]/40 p-8 text-center shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffdad3]">
            <div
              className="h-full bg-[#d9381e] transition-all duration-1000 ease-linear"
              style={{ width: `${((3 - secondsLeft) / 3) * 100}%` }}
            />
          </div>

          <div className="w-14 h-14 rounded-full bg-[#ffdad3] text-[#d9381e] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="material-symbols-outlined text-[32px]">sync</span>
          </div>

          <span className="font-label-sm text-[11px] px-3 py-1 rounded-full bg-[#ffdad3] text-[#8f1100] font-bold uppercase tracking-wider">
            Inbound Dispatch Arriving in {secondsLeft}s
          </span>

          <h3 className="font-headline-sm text-xl text-[#14181a] mt-3 mb-1">
            Receiving Transmission from {primaryOrgName}...
          </h3>
          <p className="text-sm text-[#67625a] max-w-md mx-auto mb-5 leading-relaxed">
            Organizations are reviewing your filing. An automated inquest or clarification request will pop up here shortly.
          </p>

          <button
            onClick={() => {
              clearAllTimers();
              const dynamicInq = generateDynamicInquiry({
                activeCase,
                narrative,
                organizations,
                caseKey
              });
              setPendingQuestion(dynamicInq);
              setIsWaitingForInbound(false);
              setJustArrived(true);
              playNotificationChime();
              setTimeout(() => setJustArrived(false), 2000);
            }}
            className="px-5 py-2.5 rounded-full bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider font-semibold shadow-xs cursor-pointer inline-flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Receive Inbound Packet Now</span>
          </button>
        </div>
      )}

      {/* State 2: Interactive Pending Question Card (Pops up with animation) */}
      {pendingQuestion && (
        <div className={`bg-white rounded-[20px] border border-[#ddd5c7] shadow-md overflow-hidden mb-8 transition-all duration-500 ${
          justArrived ? 'ring-4 ring-[#d9381e] scale-[1.01] shadow-xl' : ''
        }`}>
          {/* Card Top Strip */}
          <div className="bg-[#f8f3ea] px-6 sm:px-8 py-4 border-b border-[#ddd5c7] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#001511] text-[#cae9df] flex items-center justify-center font-bold text-sm">
                {pendingQuestion.orgName ? pendingQuestion.orgName.charAt(0) : 'O'}
              </div>
              <div>
                <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-widest block">
                  Inquiring Counterparty
                </span>
                <h3 className="font-semibold text-base sm:text-lg text-[#14181a] leading-tight">
                  {pendingQuestion.orgName}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#67625a] bg-white px-2.5 py-1 rounded border border-[#ddd5c7]">
                REF: {pendingQuestion.ticketRef || activeCase.docketSerial}
              </span>
              <span className="font-label-sm text-[11px] px-3 py-1 rounded-full bg-[#ffdad3] text-[#8f1100] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9381e]"></span>
                Action Required
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h4 className="font-headline-sm text-xl text-[#14181a] mb-2 leading-snug">
              {pendingQuestion.title}
            </h4>
            <p className="text-sm text-[#414846] leading-relaxed mb-6 bg-[#f8f3ea]/60 p-4 rounded-xl border border-[#ddd5c7]/60">
              {pendingQuestion.text}
            </p>

            {/* Options Selection */}
            <div className="space-y-3 mb-6">
              <label className="font-label-sm text-xs uppercase tracking-wider text-[#67625a] font-semibold block mb-2">
                Select Your Response Directive:
              </label>
              {pendingQuestion.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedOption(option)}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#f8f3ea] border-[#0f2b25] ring-1 ring-[#0f2b25] shadow-xs'
                        : 'bg-white border-[#ddd5c7] hover:bg-[#f8f3ea]/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-[#0f2b25]' : 'border-[#c1c8c5]'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#0f2b25]" />}
                    </div>
                    <span className="font-body-sm text-sm text-[#14181a] font-medium leading-relaxed">
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ddd5c7]">
              <span className="font-label-sm text-xs text-[#67625a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#0f2b25]">lock</span>
                Relayed directly under cryptographically signed consent.
              </span>
              <button
                onClick={handleAnswerSubmit}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider transition-all shadow-md font-semibold flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Relay Answer to {pendingQuestion.orgName}</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Clear / All Inquiries Resolved Card */}
      {!pendingQuestion && !isWaitingForInbound && (
        <div className="bg-white rounded-[20px] border border-[#ddd5c7] p-8 text-center shadow-sm mb-8">
          <div className="w-14 h-14 rounded-full bg-[#cbd6c6]/50 text-[#0f2b25] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[30px]">mark_email_read</span>
          </div>
          <h3 className="font-headline-sm text-2xl text-[#14181a] mb-2">
            Your Inbox is Up to Date
          </h3>
          <p className="text-sm text-[#67625a] max-w-md mx-auto mb-6 leading-relaxed">
            All active organization questions have been answered. Counterparties are advancing autonomously on your record.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentScreen('tracker')}
              className="px-6 py-2.5 rounded-full bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all"
            >
              Return to Tracker
            </button>
            <button
              onClick={triggerInboundDispatch}
              className="px-5 py-2.5 rounded-full bg-[#f8f3ea] hover:bg-[#ede5d6] text-[#0f2b25] border border-[#ddd5c7] font-label-sm text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Simulate Counterparty Reply (3s)</span>
            </button>
          </div>
        </div>
      )}

      {/* Resolved Inquiries History */}
      {answeredQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#ddd5c7]">
            <h4 className="font-label-sm text-xs uppercase tracking-wider text-[#67625a] font-semibold">
              Resolved Inquiries ({answeredQuestions.length})
            </h4>
            <span className="font-label-sm text-[11px] text-[#0f2b25] font-medium">
              Signed & Dispatched
            </span>
          </div>

          {answeredQuestions.map((q, i) => (
            <div key={i} className="p-5 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] flex flex-col gap-2 transition-all hover:border-[#0f2b25]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-wider">
                    {q.orgName || 'Counterparty'}
                  </span>
                  <h5 className="font-semibold text-sm text-[#14181a] mt-0.5">{q.title}</h5>
                </div>
                <span className="font-label-sm text-[11px] text-[#67625a] whitespace-nowrap bg-white px-2 py-0.5 rounded border border-[#ddd5c7]">
                  {q.answeredAt || 'Today'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#ddd5c7]/60 text-xs">
                <span className="text-[#67625a] font-label-sm uppercase tracking-wider text-[10px] block mb-0.5">
                  Verified Response Relayed:
                </span>
                <span className="text-[#0f2b25] font-medium leading-relaxed">
                  "{q.selectedAnswer}"
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
