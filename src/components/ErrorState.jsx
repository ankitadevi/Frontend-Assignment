import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function ErrorState({ error, onRetry, onUseSample }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!error) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl shadow-sm transition-all duration-200 animate-fadeIn">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl text-red-600 dark:text-red-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-red-900 dark:text-red-200">
              {error.title || 'Error Processing AI Output'}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
              {error.type || 'RECOVERY_TRIGGERED'}
            </span>
          </div>

          <p className="mt-1.5 text-sm text-red-700 dark:text-red-300 leading-relaxed">
            {error.message}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Request
              </button>
            )}

            {onUseSample && (
              <button
                onClick={onUseSample}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4 text-brand-500" />
                Load Verified Sample Deck
              </button>
            )}

            {error.details && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-medium ml-auto"
              >
                {showDetails ? 'Hide diagnostics' : 'Show technical details'}
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {showDetails && error.details && (
            <div className="mt-3 p-3 bg-red-100/60 dark:bg-red-950/50 rounded-xl font-mono text-xs text-red-800 dark:text-red-300 overflow-x-auto border border-red-200/50 dark:border-red-900/40">
              <pre className="whitespace-pre-wrap break-all">
                {typeof error.details === 'string' ? error.details : JSON.stringify(error.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
