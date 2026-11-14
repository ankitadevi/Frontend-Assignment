import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Trophy,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function QuizView({ quiz = [], topic = 'Study Quiz' }) {
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Map of questionId -> selectedOptionIndex
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Set of question IDs for which answer has been submitted and feedback is revealed
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRetestingWrong, setIsRetestingWrong] = useState(false);
  // Keep original full list of questions to allow resetting
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    if (quiz && quiz.length > 0) {
      setAllQuestions(quiz);
      setActiveQuestions(quiz);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setSubmittedQuestions({});
      setIsCompleted(false);
      setIsRetestingWrong(false);
    }
  }, [quiz]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  const handleSelectOption = (optionIndex) => {
    if (!currentQ || submittedQuestions[currentQ.id]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));

    // Reveal feedback immediately
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: true,
    }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Calculate score
  const correctCount = activeQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  const wrongQuestions = activeQuestions.filter(
    (q) => selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== q.correctIndex
  );

  const scorePercentage = activeQuestions.length > 0
    ? Math.round((correctCount / activeQuestions.length) * 100)
    : 0;

  // Handle re-testing wrong answers (Key prompt requirement)
  const handleRetestWrong = () => {
    if (wrongQuestions.length === 0) return;

    // Filter only wrong questions
    setActiveQuestions(wrongQuestions);
    // Clear submitted state for those questions
    const newSelected = { ...selectedAnswers };
    const newSubmitted = { ...submittedQuestions };
    wrongQuestions.forEach((q) => {
      delete newSelected[q.id];
      delete newSubmitted[q.id];
    });

    setSelectedAnswers(newSelected);
    setSubmittedQuestions(newSubmitted);
    setCurrentIndex(0);
    setIsCompleted(false);
    setIsRetestingWrong(true);
  };

  // Full quiz restart
  const handleRestartFull = () => {
    setActiveQuestions(allQuestions);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setIsRetestingWrong(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (!isCompleted && currentQ) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          if (currentQ.options && optIdx < currentQ.options.length) {
            handleSelectOption(optIdx);
          }
        } else if (e.key === 'Enter' && submittedQuestions[currentQ.id]) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isCompleted, currentQ, submittedQuestions]);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        No quiz questions generated for this topic yet.
      </div>
    );
  }

  // Summary screen after quiz completion
  if (isCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto my-8 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none animate-fadeIn">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/25">
            {scorePercentage >= 80 ? (
              <Trophy className="w-8 h-8" />
            ) : scorePercentage >= 50 ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full">
            {isRetestingWrong ? 'Wrong Answers Retest Results' : 'Quiz Completed'}
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {scorePercentage}% Score
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            You answered {correctCount} out of {activeQuestions.length} questions correctly.
          </p>
        </div>

        {/* Detailed Breakdown List */}
        <div className="mt-8 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Question Performance Breakdown
          </h4>
          {activeQuestions.map((q, idx) => {
            const isCorrect = selectedAnswers[q.id] === q.correctIndex;
            return (
              <div
                key={q.id || idx}
                className={`p-4 rounded-2xl border text-sm flex items-start gap-3 transition-colors ${
                  isCorrect
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {idx + 1}. {q.question}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    <strong>Correct:</strong> {q.options[q.correctIndex]}
                  </p>
                  {!isCorrect && selectedAnswers[q.id] !== undefined && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      <strong>Your answer:</strong> {q.options[selectedAnswers[q.id]]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3">
          {wrongQuestions.length > 0 && (
            <button
              onClick={handleRetestWrong}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Re-Test Wrong Answers ({wrongQuestions.length})
            </button>
          )}

          <button
            onClick={handleRestartFull}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Full Quiz
          </button>
        </div>
      </div>
    );
  }

  const isSubmitted = submittedQuestions[currentQ?.id];
  const selectedOption = selectedAnswers[currentQ?.id];

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      {/* Header & Progress Indicator */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          {isRetestingWrong && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
              Targeted Wrong Answers Review
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Score: {correctCount} / {activeQuestions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-brand-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            Multiple Choice
          </span>
        </div>

        {/* Question Heading */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentQ?.question}
        </h3>

        {/* Option Choices */}
        <div className="space-y-3">
          {currentQ?.options?.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;

            let optionStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80';
            let badgeStyle = 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

            if (isSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-sm';
                badgeStyle = 'bg-emerald-500 text-white';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 font-semibold';
                badgeStyle = 'bg-red-500 text-white';
              } else {
                optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                disabled={isSubmitted}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-150 ${optionStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm md:text-base leading-snug">
                    {option}
                  </span>
                </div>

                {isSubmitted && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Feedback */}
        {isSubmitted && currentQ?.explanation && (
          <div className="mt-6 p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/70 dark:border-brand-900/50 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-brand-900 dark:text-brand-200 uppercase tracking-wider mb-1">
                  Explanation
                </p>
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Stepper */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Shortcut: Press 1-4 to select
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isSubmitted}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs md:text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            {currentIndex === activeQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
