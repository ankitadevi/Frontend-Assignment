import React, { useState } from 'react';
import { Wand2, Sparkles, Send, CornerDownLeft } from 'lucide-react';

export default function RefinementBar({ onRefine, isLoading }) {
  const [instruction, setInstruction] = useState('');

  const suggestions = [
    'Add 3 more tricky quiz questions',
    'Add flashcards focused on definitions and formulas',
    'Simplify explanations for beginners',
    'Make questions more advanced',
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!instruction.trim() || isLoading) return;
    onRefine(instruction.trim());
    setInstruction('');
  };

  const handleSuggestionClick = (text) => {
    onRefine(text);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-5 bg-gradient-to-r from-brand-50/80 to-indigo-50/80 dark:from-slate-900 dark:to-slate-900 border border-brand-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-900 dark:text-brand-200">
          Refinement Loop (Follow-Up Prompts)
        </span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
        Edit or expand the current study material without losing your study context:
      </p>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSuggestionClick(s)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors disabled:opacity-50"
          >
            + {s}
          </button>
        ))}
      </div>

      {/* Custom Refinement Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isLoading}
          placeholder="Or type custom refinement (e.g. 'Add real-world engineering examples')..."
          className="w-full pl-4 pr-12 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !instruction.trim()}
          className="absolute right-1.5 p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 transition-colors"
          title="Send refinement"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
