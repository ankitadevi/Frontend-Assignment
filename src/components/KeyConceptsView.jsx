import React, { useState } from 'react';
import { CheckSquare, Square, Layers, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

export default function KeyConceptsView({ keyConcepts = [], topic = 'Study Guide' }) {
  // Map of conceptId -> boolean (checked off / understood)
  const [understoodConcepts, setUnderstoodConcepts] = useState({});

  const toggleConcept = (id) => {
    setUnderstoodConcepts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markAll = () => {
    const all = {};
    keyConcepts.forEach((c) => {
      all[c.id] = true;
    });
    setUnderstoodConcepts(all);
  };

  const resetAll = () => {
    setUnderstoodConcepts({});
  };

  const understoodCount = keyConcepts.filter((c) => understoodConcepts[c.id]).length;
  const progressPercent = keyConcepts.length > 0
    ? Math.round((understoodCount / keyConcepts.length) * 100)
    : 0;

  if (!keyConcepts || keyConcepts.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        No key concepts extracted for this topic.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-6 animate-fadeIn">
      {/* Header & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Interactive Checklist ({understoodCount} of {keyConcepts.length} Reviewed)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {understoodCount < keyConcepts.length ? (
            <button
              onClick={markAll}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Mark All Understood
            </button>
          ) : (
            <button
              onClick={resetAll}
              className="text-xs font-semibold text-slate-500 hover:underline"
            >
              Reset Checklist
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Concepts List */}
      <div className="space-y-3">
        {keyConcepts.map((item, idx) => {
          const isUnderstood = Boolean(understoodConcepts[item.id]);

          let importanceBadge = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900';
          if (item.importance === 'Essential') {
            importanceBadge = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900';
          } else if (item.importance === 'Helpful') {
            importanceBadge = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
          }

          return (
            <div
              key={item.id || idx}
              onClick={() => toggleConcept(item.id)}
              className={`p-5 rounded-2xl border cursor-pointer select-none transition-all duration-150 flex items-start gap-4 ${
                isUnderstood
                  ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 shadow-sm'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors shrink-0"
              >
                {isUnderstood ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h4
                    className={`font-bold text-base transition-colors ${
                      isUnderstood
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.concept}
                  </h4>
                  {item.importance && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${importanceBadge}`}>
                      {item.importance}
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm leading-relaxed transition-colors ${
                    isUnderstood
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.definition}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
