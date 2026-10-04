import React from 'react';
import { usePassage } from '../context/PassageContext';
import { DEMO_CASES } from '../data/cases';

export default function Header() {
  const {
    caseKey,
    switchCase,
    currentScreen,
    setCurrentScreen,
    activeRole,
    setActiveRole,
    activeCase,
    pendingQuestion,
    organizations,
    backendConnected,
    isEscalated,
    startNewDispute
  } = usePassage();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#fef9f0]/90 backdrop-blur-xl border-b border-[#ddd5c7] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Brand, Case Selector, Role Profile */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveRole('user'); setCurrentScreen('start'); }}>
            <div className="w-8 h-8 rounded-lg bg-[#0f2b25] flex items-center justify-center text-[#fef9f0] shadow-sm">
              <span className="font-headline-sm italic text-lg font-bold">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-xl text-[#14181a] tracking-tight italic font-semibold">Passage</span>
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#67625a]">Resolution Protocol</span>
            </div>
          </div>

          {/* Center: Case Switcher */}
          <div className="hidden md:flex items-center bg-[#f2ede4] p-1 rounded-full border border-[#ddd5c7] gap-1">
            <button
              onClick={() => startNewDispute()}
              className={`px-3 py-1 text-xs font-label-sm uppercase tracking-wider rounded-full transition-all flex items-center gap-1 ${
                caseKey === 'custom'
                  ? 'bg-[#d9381e] text-white shadow-sm font-semibold'
                  : 'text-[#d9381e] hover:bg-[#ffdad3]/50 font-semibold'
              }`}
            >
              <span>+ Custom Query</span>
            </button>
            {Object.keys(DEMO_CASES).map(key => {
              const c = DEMO_CASES[key];
              const isSelected = caseKey === key;
              return (
                <button
                  key={key}
                  onClick={() => switchCase(key)}
                  className={`px-3 py-1 text-xs font-label-sm uppercase tracking-wider rounded-full transition-all ${
                    isSelected
                      ? 'bg-[#0f2b25] text-white shadow-sm'
                      : 'text-[#67625a] hover:text-[#14181a]'
                  }`}
                >
                  {c.title.split(':')[0]}
                </button>
              );
            })}
          </div>

          {/* Right: Engine Badge & User Avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f8f3ea] border border-[#ddd5c7]">
              <span className={`w-1.5 h-1.5 rounded-full ${backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-[#cbd6c6]'}`}></span>
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#67625a]">
                {backendConnected ? 'FastAPI Live' : 'Protocol Engine • Ready'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0f2b25] text-white flex items-center justify-center text-xs font-label-sm font-medium">
                {activeRole === 'user' ? (activeCase.user?.name || 'U').split(' ').map(n => n[0]).join('') : 'ORG'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-medium text-[#14181a] leading-tight">
                  {activeRole === 'user' ? (activeCase.user?.name || 'User') : organizations.find(o => o.slug === activeRole)?.name || activeRole}
                </span>
                <span className="font-label-sm text-[10px] text-[#67625a]">
                  {activeRole === 'user' ? 'First-Party User' : 'Receiver Portal'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Header: Screen Navigation & Role Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-t border-[#ddd5c7]/60 gap-2">
          {/* Workflow Steps Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'start', label: '1. Intake' },
              { id: 'plan', label: '2. Plan' },
              { id: 'drafts', label: '3. Drafts & Consent' },
              { id: 'tracker', label: '4. Tracker' },
              { id: 'inbox', label: '5. Inbox', badge: pendingQuestion ? '1' : null },
              { id: 'escalation', label: '6. Escalation' },
              { id: 'resolved', label: '7. Passaged' }
            ].map(tab => {
              const active = currentScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveRole('user'); setCurrentScreen(tab.id); }}
                  className={`px-2.5 py-1 rounded-md text-xs font-label-sm uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'bg-[#14181a] text-[#fef9f0] font-medium'
                      : 'text-[#67625a] hover:text-[#14181a] hover:bg-[#f2ede4]'
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#d9381e] text-white text-[9px] font-bold animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Role Switcher: "View as" */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#67625a]">View as:</span>
            <div className="flex items-center gap-1 bg-[#f2ede4] p-0.5 rounded-md border border-[#ddd5c7] overflow-x-auto max-w-[280px] sm:max-w-none scrollbar-none">
              <button
                onClick={() => setActiveRole('user')}
                className={`px-2.5 py-0.5 text-[11px] font-label-sm uppercase tracking-wider rounded transition-all whitespace-nowrap cursor-pointer ${
                  activeRole === 'user'
                    ? 'bg-[#0f2b25] text-white font-medium shadow-xs'
                    : 'text-[#67625a] hover:text-[#14181a]'
                }`}
              >
                You
              </button>
              {(() => {
                const seenSlugs = new Set();
                const uniqueOrgs = [];
                for (const org of organizations) {
                  const norm = (org.slug || '').replace(/[-_]/g, '').toLowerCase();
                  if (norm && !seenSlugs.has(norm)) {
                    seenSlugs.add(norm);
                    uniqueOrgs.push(org);
                  }
                }
                return uniqueOrgs.map(org => {
                  const cleanLabel = org.shortName || org.name.replace(/^(The|M\/s)\s+/i, '').split(' ')[0];
                  return (
                    <button
                      key={org.slug}
                      onClick={() => setActiveRole(org.slug)}
                      className={`px-2.5 py-0.5 text-[11px] font-label-sm uppercase tracking-wider rounded transition-all whitespace-nowrap cursor-pointer ${
                        activeRole === org.slug
                          ? 'bg-[#0f2b25] text-white font-medium shadow-xs'
                          : 'text-[#67625a] hover:text-[#14181a]'
                      }`}
                    >
                      {cleanLabel}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
