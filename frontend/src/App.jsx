import React from 'react';
import { PassageProvider, usePassage } from './context/PassageContext';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import PlanScreen from './components/PlanScreen';
import DraftsScreen from './components/DraftsScreen';
import TrackerScreen from './components/TrackerScreen';
import InboxScreen from './components/InboxScreen';
import EscalationScreen from './components/EscalationScreen';
import ResolvedScreen from './components/ResolvedScreen';
import SandboxConsole from './components/SandboxConsole';
import HandoverModal from './components/HandoverModal';

function MainContent() {
  const { currentScreen, activeRole } = usePassage();

  return (
    <main className="pt-28 pb-16 min-h-screen bg-[#fef9f0] text-[#14181a]">
      {/* If looking through receiver portal */}
      {activeRole !== 'user' ? (
        <SandboxConsole orgSlug={activeRole} />
      ) : (
        <>
          {currentScreen === 'start' && <StartScreen />}
          {currentScreen === 'plan' && <PlanScreen />}
          {currentScreen === 'drafts' && <DraftsScreen />}
          {currentScreen === 'tracker' && <TrackerScreen />}
          {currentScreen === 'inbox' && <InboxScreen />}
          {currentScreen === 'escalation' && <EscalationScreen />}
          {currentScreen === 'resolved' && <ResolvedScreen />}
        </>
      )}

      <HandoverModal />

      {/* Editorial Footer */}
      <footer className="mt-16 border-t border-[#ddd5c7] py-8 text-center text-xs text-[#67625a]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm italic text-sm text-[#14181a] font-semibold">Passage</span>
            <span>— Tell it once. We file it everywhere.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-label-sm uppercase tracking-wider">
            <span>Apache-2.0 License</span>
            <span>•</span>
            <span>Passage Resolution Engine</span>
            <span>•</span>
            <span>Open Org Registry</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <PassageProvider>
      <Header />
      <MainContent />
    </PassageProvider>
  );
}
