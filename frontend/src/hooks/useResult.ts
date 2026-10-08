import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAssessment, fetchReport, forgetSession, hasSession } from '../services/assessments';
import { ApiError } from '../services/http';
import type { Report, Stop } from '../types/api';

export type ResultView =
  | { kind: 'loading' }
  | { kind: 'writing' }
  | { kind: 'error'; error: Error }
  | { kind: 'stopped'; stop: Stop }
  | { kind: 'ready'; report: Report };

const WRITING_POLL_MS = 1000;

/** Loads the outcome: the red-flag stop, or the report (asking again while it is "writing"). */
export function useResult(): { view: ResultView; retry: () => void } {
  const navigate = useNavigate();
  const [view, setView] = useState<ResultView>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!hasSession()) {
      navigate('/', { replace: true });
      return;
    }
    let cancelled = false;
    let timer: number | undefined;
    setView({ kind: 'loading' });

    const pollReport = async () => {
      const report = await fetchReport();
      if (cancelled) return;
      if (report.state === 'ready') {
        setView({ kind: 'ready', report });
        return;
      }
      setView({ kind: 'writing' });
      timer = window.setTimeout(() => void run(pollReport), WRITING_POLL_MS);
    };

    const run = async (step: () => Promise<void>) => {
      try {
        await step();
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          forgetSession();
          navigate('/', { replace: true });
          return;
        }
        setView({ kind: 'error', error: error instanceof Error ? error : new Error('Error') });
      }
    };

    void run(async () => {
      const assessment = await fetchAssessment();
      if (cancelled) return;
      if (assessment.state === 'in_progress') {
        navigate('/evaluacion', { replace: true });
      } else if (assessment.state === 'stopped' && assessment.stop) {
        setView({ kind: 'stopped', stop: assessment.stop });
      } else {
        await pollReport();
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [attempt, navigate]);

  return { view, retry: useCallback(() => setAttempt((n) => n + 1), []) };
}
