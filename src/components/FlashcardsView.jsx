import React, { useState } from 'react';
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FlashcardsView({ flashcards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return <div className="text-center py-8 text-slate-500">No flashcards generated.</div>;
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-xl mx-auto my-6 text-center">
      {/* Card counter */}
      <div className="text-xs text-slate-500 font-semibold mb-2">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      {/* Flashcard Box */}
      <div
        onClick={handleFlip}
        className={`w-full min-h-[260px] p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between shadow-sm select-none ${
          isFlipped
            ? 'bg-slate-900 text-white border-slate-800'
            : 'bg-white text-slate-900 border-blue-200 hover:border-blue-300'
        }`}
      >
        <span className="text-xs uppercase font-bold tracking-wider text-blue-500">
          {isFlipped ? 'Answer' : 'Question'} (Click to flip)
        </span>

        <p className="my-auto text-lg md:text-xl font-bold py-4">
          {isFlipped ? currentCard.back : currentCard.front}
        </p>

        <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
          <RotateCw className="w-3 h-3" />
          {isFlipped ? 'Click to view question' : 'Click to reveal answer'}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
        >
          Flip Card
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
