import React, { useRef } from 'react';
import { History, X, Download, Upload, Trash2, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history = [],
  onSelectSession,
  onDeleteSession,
  onExportCurrent,
  onImportSession,
  currentSessionId,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onImportSession(json);
        onClose();
      } catch (err) {
        alert('Invalid JSON file. Please ensure it is a valid StudyCraft study set.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Study Sessions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {history.length} saved topic{history.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sessions List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No past sessions saved yet. Generated decks are automatically saved here!
              </div>
            ) : (
              history.map((session) => {
                const isCurrent = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isCurrent
                        ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {session.data?.topic || 'Untitled Study Set'}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {session.data?.flashcards?.length || 0} cards
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> {session.data?.quiz?.length || 0} Qs
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Import / Export Footer Actions */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Upload className="w-4 h-4 text-brand-500" />
              Import Study Set from JSON
            </button>

            {onExportCurrent && (
              <button
                onClick={onExportCurrent}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                Export Current Set as JSON
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
