import React, { useState } from 'react';
import { usePassage } from '../context/PassageContext';

export default function InboxScreen() {
  const {
    activeCase,
    pendingQuestion,
    answeredQuestions,
    answerQuestion,
    setCurrentScreen
  } = usePassage();

  const [selectedOption, setSelectedOption] = useState(pendingQuestion?.options?.[0] || '');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Docket / Meta Line */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#ddd5c7]">
        <span className="font-label-sm text-xs text-[#67625a] uppercase tracking-widest">
          Discrepancy Inquest // {activeCase.docketSerial}
        </span>
        <span className="font-label-sm text-xs text-[#d9381e] flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#d9381e] animate-pulse"></span>
          {pendingQuestion ? '1 Action Required' : 'All Inquiries Resolved'}
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

      {/* Pending Question Card */}
      {pendingQuestion ? (
        <div className="bg-white rounded-[20px] border border-[#ddd5c7] shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ddd5c7]">
              <div>
                <span className="font-label-sm text-[10px] text-[#67625a] uppercase tracking-widest">
                  Inquiring Counterparty
                </span>
                <h3 className="font-semibold text-lg text-[#14181a]">
                  {pendingQuestion.orgName}
                </h3>
              </div>
              <span className="font-label-sm text-[11px] px-2.5 py-1 rounded-full bg-[#ffdad3] text-[#8f1100] font-semibold uppercase">
                Pending Response
              </span>
            </div>

            <h4 className="font-headline-sm text-xl text-[#14181a] mb-2">
              {pendingQuestion.title}
            </h4>
            <p className="text-sm text-[#67625a] leading-relaxed mb-6">
              {pendingQuestion.text}
            </p>

            {/* Options Selection */}
            <div className="space-y-3 mb-6">
              {pendingQuestion.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedOption(option)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#f8f3ea] border-[#0f2b25] shadow-xs'
                        : 'bg-white border-[#ddd5c7] hover:bg-[#f8f3ea]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#0f2b25]' : 'border-[#c1c8c5]'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#0f2b25]" />}
                      </div>
                      <span className="text-sm font-medium text-[#14181a]">{option}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Relay Notice */}
            <div className="p-3.5 rounded-xl bg-[#f2ede4] border border-[#ddd5c7] mb-6 flex items-start gap-2.5 text-xs text-[#67625a]">
              <span className="material-symbols-outlined text-[18px] text-[#0f2b25] shrink-0 mt-0.5">
                sync_alt
              </span>
              <span>{pendingQuestion.relayNotice}</span>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => answerQuestion(selectedOption)}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0f2b25] hover:bg-[#1b3d35] text-white font-label-sm text-xs uppercase tracking-wider transition-all shadow-md font-semibold flex items-center justify-center gap-2"
              >
                <span>Relay Answer to {pendingQuestion.orgName}</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ddd5c7] p-8 text-center shadow-sm mb-8">
          <div className="w-12 h-12 rounded-full bg-[#cbd6c6]/40 text-[#0f2b25] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
          </div>
          <h3 className="font-headline-sm text-xl text-[#14181a] mb-1">Your Inbox is Clear</h3>
          <p className="text-sm text-[#67625a] max-w-md mx-auto mb-4">
            Organizations are progressing autonomously on your record. You will be notified only if external confirmation is required.
          </p>
          <button
            onClick={() => setCurrentScreen('tracker')}
            className="px-5 py-2.5 rounded-full bg-[#0f2b25] text-white font-label-sm text-xs uppercase tracking-wider font-medium"
          >
            Return to Tracker
          </button>
        </div>
      )}

      {/* Answered Questions History */}
      {answeredQuestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-label-sm text-xs uppercase tracking-wider text-[#67625a] font-medium">
            Resolved Inquiries
          </h4>
          {answeredQuestions.map((q, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#f8f3ea] border border-[#ddd5c7] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#14181a]">{q.title}</span>
                <span className="font-label-sm text-[#67625a]">{q.answeredAt}</span>
              </div>
              <span className="text-xs text-[#0f2b25] font-medium">
                Answered: "{q.selectedAnswer}"
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
