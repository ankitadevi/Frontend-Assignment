import React from 'react';
import { Brain, Sparkles, BookOpen, HelpCircle, Layers } from 'lucide-react';
import { useStudyAssistant } from './hooks/useStudyAssistant';
import InputSection from './components/InputSection';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import FlashcardsView from './components/FlashcardsView';
import QuizView from './components/QuizView';
import { SAMPLE_TOPICS } from './utils/constants';

export default function App() {
  const {
    studySet,
    status,
    error,
    warning,
    loadingStep,
    activeTab,
    setActiveTab,
    generate,
    retryLast,
    resetAll,
  } = useStudyAssistant();

  const handleUseSample = () => {
    const sample = SAMPLE_TOPICS[0];
    generate({
      text: sample.prompt,
      mode: 'all',
      difficulty: 'Intermediate',
    });
  };

  const hasFlashcards = Boolean(studySet?.flashcards?.length);
  const hasQuiz = Boolean(studySet?.quiz?.length);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
                StudyCraft AI
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                v1.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Warning Banner if using mock fallback */}
        {warning && (
          <div className="max-w-4xl mx-auto mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs rounded-xl flex items-center justify-between">
            <span>ℹ️ {warning}</span>
          </div>
        )}

        {/* Input Interface */}
        <InputSection
          onGenerate={generate}
          isLoading={status === 'loading'}
          onClear={resetAll}
          currentStudySet={studySet}
        />

        {/* Loading State */}
        {status === 'loading' && (
          <LoadingState step={loadingStep} onCancel={resetAll} />
        )}

        {/* Error State */}
        {status === 'error' && (
          <ErrorState
            error={error}
            onRetry={retryLast}
            onUseSample={handleUseSample}
          />
        )}

        {/* Interactive Workspace when studySet is present */}
        {status !== 'loading' && studySet && (
          <section className="w-full max-w-4xl mx-auto mt-6">
            {/* Topic Overview Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mb-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-3 py-1 rounded-full border border-brand-200/50 dark:border-brand-900/50">
                  {studySet.difficulty} Level Study Set
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ⏱️ ~{studySet.estimatedStudyTimeMinutes || 15} min read
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                {studySet.topic}
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {studySet.summary}
              </p>
            </div>

            {/* Interactive Workspace Tab Selector */}
            <div className="flex items-center justify-center gap-2 mb-6 p-1.5 bg-slate-200/70 dark:bg-slate-900 rounded-2xl max-w-md mx-auto">
              {hasFlashcards && (
                <button
                  type="button"
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    activeTab === 'flashcards'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Flashcards ({studySet.flashcards.length})
                </button>
              )}

              {hasQuiz && (
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Interactive Quiz ({studySet.quiz.length})
                </button>
              )}
            </div>

            {/* Active View */}
            {activeTab === 'flashcards' && hasFlashcards && (
              <FlashcardsView
                flashcards={studySet.flashcards}
                topic={studySet.topic}
              />
            )}

            {activeTab === 'quiz' && hasQuiz && (
              <QuizView
                quiz={studySet.quiz}
                topic={studySet.topic}
              />
            )}
          </section>
        )}

        {/* Empty / Welcome State when idle */}
        {status === 'idle' && !studySet && (
          <div className="max-w-2xl mx-auto text-center py-12 px-4">
            <div className="inline-flex p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 mb-4 border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Ready to create your custom study tool
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Choose one of the sample topics above or paste your course notes to see structured flashcards and quizzes rendered in real-time.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        StudyCraft AI &bull; Built with React &amp; Google Gemini by Ankita Devi
      </footer>
    </div>
  );
}
