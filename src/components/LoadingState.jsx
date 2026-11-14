import React from 'react';
import { Loader2, XCircle, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoadingState({ step, onCancel }) {
  const steps = [
    'Connecting to AI model...',
    'Synthesizing notes and extracting key concepts...',
    'Generating interactive flashcards & quiz questions...',
    'Validating structured output against schema...',
  ];

  const currentStepIndex = steps.findIndex((s) => s === step);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg shadow-slate-100 dark:shadow-none transition-all text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 animate-ping"></div>
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
          <Brain className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Formulating Interactive Study Tools
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Transforming raw text into structured 3D flashcards, quiz questions, and concept maps.
      </p>

      {/* Progress Stepper */}
      <div className="mt-8 space-y-3 max-w-md mx-auto text-left">
        {steps.map((s, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={s}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800'
                  : 'opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-brand-600 dark:text-brand-400 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 shrink-0" />
              )}
              <span
                className={`text-xs md:text-sm font-medium ${
                  isCurrent
                    ? 'text-brand-900 dark:text-brand-200 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>

      {onCancel && (
        <div className="mt-8">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Cancel Generation
          </button>
        </div>
      )}
    </div>
  );
}
