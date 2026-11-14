import React, { useState } from 'react';
import { Brain, Sparkles, BookOpen, HelpCircle, RefreshCw, AlertCircle } from 'lucide-react';
import FlashcardsView from './components/FlashcardsView';
import QuizView from './components/QuizView';

const SAMPLE_TOPIC = "Photosynthesis: Process where plants use sunlight, water, and CO2 to create oxygen and energy in the form of sugar (glucose). Light-dependent reactions happen in thylakoid membranes releasing oxygen, while the Calvin cycle happens in the stroma synthesizing glucose.";

export default function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [activeTab, setActiveTab] = useState('flashcards');

  // Generate study materials from AI backend
  const handleGenerate = async (textToUse) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error generating study set');
      }

      const result = await response.json();
      setStudyData(result.data);
      setActiveTab('flashcards');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseSample = () => {
    setInputText(SAMPLE_TOPIC);
    handleGenerate(SAMPLE_TOPIC);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Simple Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-800">
              StudyCraft AI
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            AI Study Assistant
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Simple Input Form */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-1">
            Generate Flashcards &amp; Quiz
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Paste your lecture notes, article, or topic below:
          </p>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            rows={4}
            placeholder="e.g. Paste notes on Photosynthesis, World War II, or Git version control..."
            className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleUseSample}
              disabled={loading}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try sample notes (Photosynthesis)
            </button>

            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={loading || !inputText.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              {loading ? 'Generating...' : 'Create Study Set'}
            </button>
          </div>
        </section>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">
              AI is formulating your flashcards and quiz...
            </p>
            <p className="text-xs text-slate-400 mt-1">Parsing structured JSON</p>
          </div>
        )}

        {/* Error Banner with Retry */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 my-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900">Generation Failed</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
              <button
                onClick={() => handleGenerate()}
                className="mt-2 text-xs font-semibold text-red-800 underline hover:text-red-950"
              >
                Click here to retry
              </button>
            </div>
          </div>
        )}

        {/* Interactive Workspace */}
        {!loading && studyData && (
          <section className="mt-4">
            {/* Topic Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full">
                {studyData.difficulty || 'Study Set'}
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-2">
                {studyData.topic}
              </h1>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {studyData.summary}
              </p>
            </div>

            {/* Simple Tab Switcher: Flashcards vs Quiz */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === 'flashcards'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Flashcards ({studyData.flashcards?.length || 0})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === 'quiz'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Quiz ({studyData.quiz?.length || 0})
              </button>
            </div>

            {/* Flashcards View */}
            {activeTab === 'flashcards' && studyData.flashcards && (
              <FlashcardsView
                flashcards={studyData.flashcards}
                topic={studyData.topic}
              />
            )}

            {/* Quiz View with Re-test Wrong Answers */}
            {activeTab === 'quiz' && studyData.quiz && (
              <QuizView
                quiz={studyData.quiz}
                topic={studyData.topic}
              />
            )}
          </section>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 bg-white">
        StudyCraft AI &bull; Built by Ankita Devi
      </footer>
    </div>
  );
}
