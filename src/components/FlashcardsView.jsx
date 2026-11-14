import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Lightbulb,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export default function FlashcardsView({ flashcards = [], topic = 'Study Deck' }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // Track mastery status by card ID: 'mastered' | 'learning' | undefined
  const [masteryStatus, setMasteryStatus] = useState({});
  const [filterUnmastered, setFilterUnmastered] = useState(false);

  // Initialize and synchronize cards
  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setCards(flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
    }
  }, [flashcards]);

  const displayedCards = filterUnmastered
    ? cards.filter((c) => masteryStatus[c.id] !== 'mastered')
    : cards;

  // Active card safe accessor
  const activeCard = displayedCards[currentIndex] || displayedCards[0] || null;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (displayedCards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % displayedCards.length);
  }, [displayedCards.length]);

  const handlePrev = useCallback(() => {
    if (displayedCards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + displayedCards.length) % displayedCards.length);
  }, [displayedCards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    setIsFlipped(false);
    setShowHint(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleMarkMastery = (status) => {
    if (!activeCard) return;
    setMasteryStatus((prev) => ({
      ...prev,
      [activeCard.id]: status,
    }));
    // Auto advance to next card on mastery rating
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const resetMastery = () => {
    setMasteryStatus({});
    setFilterUnmastered(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowHint((prev) => !prev);
      } else if (e.key === '1') {
        e.preventDefault();
        handleMarkMastery('learning');
      } else if (e.key === '2') {
        e.preventDefault();
        handleMarkMastery('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, activeCard]);

  // Mastery statistics
  const masteredCount = cards.filter((c) => masteryStatus[c.id] === 'mastered').length;
  const learningCount = cards.filter((c) => masteryStatus[c.id] === 'learning').length;
  const percentMastered = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        No flashcards generated for this topic yet.
      </div>
    );
  }

  if (displayedCards.length === 0 && filterUnmastered) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
          All Cards Mastered! 🎉
        </h3>
        <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
          You have achieved 100% mastery on this deck.
        </p>
        <button
          onClick={resetMastery}
          className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          Reset and Practice Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-6 flex flex-col items-center">
      {/* Top Deck Stats & Controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Card {currentIndex + 1} of {displayedCards.length}
          </span>
          {activeCard?.category && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
              {activeCard.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterUnmastered(!filterUnmastered)}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
              filterUnmastered
                ? 'bg-amber-100 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {filterUnmastered ? 'Showing Needs Practice Only' : 'Filter Unmastered'}
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6 px-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span>Mastery Progress: {percentMastered}%</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ {masteredCount} Mastered</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">● {learningCount} Learning</span>
          </div>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(masteredCount / cards.length) * 100}%` }}
          />
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${(learningCount / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div className="w-full perspective-1000 min-h-[320px] md:min-h-[360px]">
        <div
          onClick={handleFlip}
          className={`w-full h-full min-h-[320px] md:min-h-[360px] relative rounded-3xl cursor-pointer transition-transform duration-500 transform-style-3d shadow-xl shadow-slate-200/50 dark:shadow-none select-none border border-slate-200 dark:border-slate-800 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Question) */}
          <div className="absolute inset-0 w-full h-full backface-hidden p-8 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full">
                <BookOpen className="w-3.5 h-3.5" />
                Question / Prompt
              </span>
              {activeCard?.hint && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    showHint
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-600'
                  }`}
                  title="Toggle hint (Press H)"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHint ? 'Hide Hint' : 'Hint'}
                </button>
              )}
            </div>

            {/* Question Text */}
            <div className="my-auto py-6 text-center">
              <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {activeCard?.front}
              </p>

              {showHint && activeCard?.hint && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs text-amber-800 dark:text-amber-300 max-w-md mx-auto text-center animate-fadeIn"
                >
                  💡 <strong>Hint:</strong> {activeCard.hint}
                </div>
              )}
            </div>

            <div className="text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              Click or press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px]">Space</kbd> to reveal answer
            </div>
          </div>

          {/* Card Back (Answer) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-8 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-800/40">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                <CheckCircle className="w-3.5 h-3.5" />
                Answer &amp; Explanation
              </span>
              <span className="text-xs text-slate-400">
                Click to flip back
              </span>
            </div>

            {/* Answer Text */}
            <div className="my-auto py-6 text-center">
              <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed max-w-lg mx-auto">
                {activeCard?.back}
              </p>
            </div>

            {/* Rating Buttons */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-3 pt-2"
            >
              <button
                type="button"
                onClick={() => handleMarkMastery('learning')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                title="Press 1"
              >
                <XCircle className="w-4 h-4 text-amber-400" />
                Needs Practice (1)
              </button>
              <button
                type="button"
                onClick={() => handleMarkMastery('mastered')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                title="Press 2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Mastered (2)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex items-center justify-between w-full max-w-sm">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-colors"
          title="Previous card (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
        >
          <RotateCw className="w-4 h-4" />
          Flip Card
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-colors"
          title="Next card (Right Arrow)"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Space</kbd> Flip</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">← / →</kbd> Navigate</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">H</kbd> Hint</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">1 / 2</kbd> Rate Card</span>
      </div>
    </div>
  );
}
