import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, HelpCircle, ChevronRight, RotateCcw, Flame } from 'lucide-react';
import { SAMPLE_TOPICS, DIFFICULTY_LEVELS, STUDY_MODES } from '../utils/constants';

export default function InputSection({ onGenerate, isLoading, onClear, currentStudySet }) {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onGenerate({
      text: inputText.trim(),
      mode: selectedMode,
      difficulty: selectedDifficulty,
    });
  };

  const handleSelectSample = (sample) => {
    setInputText(sample.prompt);
    onGenerate({
      text: sample.prompt,
      mode: selectedMode,
      difficulty: selectedDifficulty,
    });
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-200">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Study Deck & Quiz
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste lecture notes, study guide, or type any subject
            </p>
          </div>
        </div>

        {currentStudySet && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline px-2 py-1"
          >
            {isExpanded ? 'Collapse Input' : 'New Topic'}
          </button>
        )}
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Free-form Textarea */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Paste course notes, chapter summaries, or type a topic (e.g., 'Photosynthesis & light reactions', 'Neural network backpropagation', 'Git rebase vs merge')..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y min-h-[110px]"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Clear text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center justify-between mt-1.5 px-1 text-xs text-slate-400">
              <span>{inputText.length} characters</span>
              <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[10px]">Ctrl+Enter</kbd> to submit</span>
            </div>
          </div>

          {/* Configuration Controls (Mode & Difficulty) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Mode selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STUDY_MODES.map((mode) => {
                  const isSelected = selectedMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {mode.id === 'all' && <Layers className="w-4 h-4" />}
                      {mode.id === 'flashcards' && <BookOpen className="w-4 h-4" />}
                      {mode.id === 'quiz' && <HelpCircle className="w-4 h-4" />}
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Depth & Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTY_LEVELS.map((diff) => {
                  const isSelected = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Flame className={`w-4 h-4 ${diff.id === 'Advanced' ? 'text-amber-500' : diff.id === 'Intermediate' ? 'text-blue-500' : 'text-emerald-500'}`} />
                      <span>{diff.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Presets / Evaluator shortcuts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1-Click Sample Topics
              </span>
              <span className="text-[11px] text-slate-400">Instant test cases</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TOPICS.map((sample) => (
                <button
                  key={sample.title}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:from-brand-700 active:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Generating Materials...' : 'Generate Study Set'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
