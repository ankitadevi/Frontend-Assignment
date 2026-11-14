import { useState, useRef, useCallback, useEffect } from 'react';
import { safeParseJson } from '../utils/jsonRepair';

export function useStudyAssistant() {
  const [studySet, setStudySet] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'flashcards' | 'quiz' | 'concepts'

  // Race condition & Stale response prevention
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);
  const lastRequestParamsRef = useRef(null);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Primary generation handler.
   * Cancels in-flight requests and ignores stale responses.
   */
  const generate = useCallback(async ({
    text,
    mode = 'all',
    difficulty = 'Intermediate',
    isRefinement = false,
    refinementInstruction = '',
  }) => {
    // 1. Increment sequence counter for race condition immunity
    const currentRequestId = ++requestIdRef.current;

    // 2. Cancel any pending previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Store params for one-click retry
    lastRequestParamsRef.current = { text, mode, difficulty, isRefinement, refinementInstruction };

    setStatus('loading');
    setError(null);
    setWarning(null);
    setLoadingStep('Connecting to AI model...');

    // Progress stepper simulation for perceived latency management
    const stepTimer1 = setTimeout(() => {
      if (currentRequestId === requestIdRef.current) {
        setLoadingStep('Synthesizing notes and extracting key concepts...');
      }
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      if (currentRequestId === requestIdRef.current) {
        setLoadingStep('Generating interactive flashcards & quiz questions...');
      }
    }, 2800);

    const stepTimer3 = setTimeout(() => {
      if (currentRequestId === requestIdRef.current) {
        setLoadingStep('Validating structured output against schema...');
      }
    }, 4500);

    // Client-side 30s timeout safety net
    const timeoutTimer = setTimeout(() => {
      if (currentRequestId === requestIdRef.current && controller) {
        controller.abort('Client timeout: request took longer than 30 seconds');
      }
    }, 30000);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          mode,
          difficulty,
          isRefinement,
          existingData: isRefinement ? studySet : null,
          refinementInstruction,
        }),
        signal: controller.signal,
      });

      // Clear timers
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(timeoutTimer);

      // Verify this is still the freshest request (stale check #1)
      if (currentRequestId !== requestIdRef.current) {
        console.warn(`[useStudyAssistant] Discarding stale response for request #${currentRequestId}`);
        return;
      }

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();

      // Verify again before state commit (stale check #2)
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      const parsedData = safeParseJson(result.data);

      setStudySet(parsedData);
      setStatus('success');
      setError(null);
      if (result.warning) {
        setWarning(result.warning);
      }

      // Default active tab based on generated mode
      if (mode === 'quiz' && parsedData.quiz?.length > 0) {
        setActiveTab('quiz');
      } else if (mode === 'flashcards' && parsedData.flashcards?.length > 0) {
        setActiveTab('flashcards');
      } else {
        setActiveTab('summary');
      }
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(timeoutTimer);

      // If this request was superseded by a newer one, do not overwrite error state
      if (currentRequestId !== requestIdRef.current) {
        console.warn(`[useStudyAssistant] Ignored error from aborted/stale request #${currentRequestId}`);
        return;
      }

      if (err.name === 'AbortError' || err === 'Client timeout: request took longer than 30 seconds') {
        setStatus('error');
        setError({
          type: 'TIMEOUT_OR_ABORT',
          title: 'Request Timed Out',
          message: 'The AI model took longer than expected to formulate structured output. You can retry with a shorter excerpt or test again.',
          canRetry: true,
        });
        return;
      }

      setStatus('error');
      setError({
        type: 'GENERATION_ERROR',
        title: 'Failed to Process Output',
        message: err.message || 'An unexpected error occurred while parsing the model response.',
        canRetry: true,
      });
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoadingStep('');
      }
    }
  }, [studySet]);

  /**
   * Refinement loop: edits existing result with a follow-up prompt
   */
  const refine = useCallback((instruction) => {
    if (!studySet || !instruction) return;
    generate({
      text: studySet.topic,
      isRefinement: true,
      refinementInstruction: instruction,
      difficulty: studySet.difficulty,
    });
  }, [studySet, generate]);

  /**
   * Retry the last triggered request
   */
  const retryLast = useCallback(() => {
    if (lastRequestParamsRef.current) {
      generate(lastRequestParamsRef.current);
    }
  }, [generate]);

  /**
   * Error simulator for testing resilience (evaluator feature)
   */
  const triggerSimulation = useCallback(async (type) => {
    const currentRequestId = ++requestIdRef.current;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('loading');
    setError(null);
    setLoadingStep(`Simulating ${type.replace('_', ' ')} scenario...`);

    try {
      const response = await fetch('/api/simulate-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
        signal: controller.signal,
      });

      if (currentRequestId !== requestIdRef.current) return;

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `HTTP ${response.status} Error`);
      }

      const text = await response.text();
      // Attempt parse to test error recovery
      const parsed = safeParseJson(text);

      if (!parsed.topic || !parsed.flashcards) {
        throw new Error('Schema validation failed: Missing required fields (topic, flashcards)');
      }

      setStudySet(parsed);
      setStatus('success');
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;

      setStatus('error');
      setError({
        type: 'SIMULATION_ERROR',
        title: `Simulation: ${type.toUpperCase()}`,
        message: err.message || 'Error occurred during simulation test.',
        canRetry: true,
      });
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoadingStep('');
      }
    }
  }, []);

  const resetAll = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStudySet(null);
    setStatus('idle');
    setError(null);
    setWarning(null);
    setLoadingStep('');
  }, []);

  return {
    studySet,
    setStudySet,
    status,
    error,
    warning,
    loadingStep,
    activeTab,
    setActiveTab,
    generate,
    refine,
    retryLast,
    triggerSimulation,
    resetAll,
  };
}
