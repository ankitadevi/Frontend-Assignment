import React, { useState, useEffect } from 'react';

export default function QuizView({ quiz = [] }) {
  const [questions, setQuestions] = useState(quiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setQuestions(quiz);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestions([]);
    setIsCompleted(false);
  }, [quiz]);

  if (!questions || questions.length === 0) {
    return <div className="text-center py-6 text-slate-500">No quiz questions generated.</div>;
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, currentQ]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  // Re-test wrong questions
  const handleRetestWrong = () => {
    setQuestions(wrongQuestions);
    setWrongQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  // Restart entire quiz
  const handleRestartFull = () => {
    setQuestions(quiz);
    setWrongQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  // Results screen
  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto my-6 p-6 bg-white rounded-xl border border-slate-200 text-center">
        <h3 className="text-xl font-bold text-slate-900">Quiz Completed</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your Score: <span className="font-bold text-blue-600">{score}</span> / {questions.length}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          {wrongQuestions.length > 0 && (
            <button
              onClick={handleRetestWrong}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
            >
              Re-Test Wrong Answers ({wrongQuestions.length})
            </button>
          )}

          <button
            onClick={handleRestartFull}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
          >
            Restart Full Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-6">
      <div className="text-xs text-slate-500 font-medium mb-2">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          {currentQ.question}
        </h3>

        <div className="space-y-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
            if (isAnswered) {
              if (isCorrect) {
                style = 'bg-green-50 border-green-500 text-green-900 font-medium';
              } else if (isSelected && !isCorrect) {
                style = 'bg-red-50 border-red-500 text-red-900 font-medium';
              } else {
                style = 'opacity-50 border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-3 rounded-lg border text-left text-sm transition-colors ${style}`}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && currentQ.explanation && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900">
            <span className="font-semibold">Explanation: </span>
            {currentQ.explanation}
          </div>
        )}

        {isAnswered && (
          <div className="mt-5 text-right">
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
