import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  completeAssessment,
  fetchAssessment,
  fetchQuestionnaire,
  forgetSession,
  hasSession,
  saveAnswer,
} from '../services/assessments';
import { ApiError } from '../services/http';
import type {
  AnswerPayload,
  AnswerValue,
  Chapter,
  Question,
  Questionnaire,
  StoredAnswer,
} from '../types/api';
import {
  answeredCount,
  buildFlowItems,
  chapterAt,
  indexOfPayment,
  indexOfQuestion,
  type FlowItem,
} from '../utils/flow';

export type Submission = { value: AnswerValue } | { skipped: true };

interface Loaded {
  questionnaire: Questionnaire;
  items: FlowItem[];
}

/**
 * Drives the assessment screens.
 *
 * Answers are saved one at a time in the background so every screen appears instantly. The one
 * exception is a red-flag question: there the flow waits for the server's reply, because the
 * server may answer with `stop` and the assessment must end at once.
 */
export function useAssessmentFlow() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StoredAnswer>>({});
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState(false);

  const queue = useRef<Promise<void>>(Promise.resolve());
  const failed = useRef(new Map<string, AnswerPayload>());
  const shownAt = useRef(Date.now());
  const itemsRef = useRef<FlowItem[]>([]);

  // ---- initial load / resume --------------------------------------------------------------
  useEffect(() => {
    if (!hasSession()) {
      navigate('/', { replace: true });
      return;
    }
    let cancelled = false;
    setLoadError(null);
    Promise.all([fetchQuestionnaire(), fetchAssessment()])
      .then(([questionnaire, assessment]) => {
        if (cancelled) return;
        if (assessment.state !== 'in_progress') {
          navigate('/resultado', { replace: true });
          return;
        }
        const items = buildFlowItems(questionnaire);
        const isPaid = assessment.payment === 'paid';
        const lastQuestion = questionnaire.questions[questionnaire.questions.length - 1];
        const target = assessment.current_question_id ?? lastQuestion?.id ?? '';
        setAnswers(assessment.answers);
        setPaid(isPaid);
        const resumeAt = isPaid
          ? Math.max(0, indexOfQuestion(items, target))
          : indexOfPayment(items);
        // Land on the chapter introduction when resuming at the first question of a chapter.
        setIndex(items[resumeAt - 1]?.kind === 'interstitial' ? resumeAt - 1 : resumeAt);
        itemsRef.current = items;
        setLoaded({ questionnaire, items });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
          forgetSession();
          navigate('/', { replace: true });
          return;
        }
        setLoadError(error instanceof Error ? error : new Error('Error'));
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, navigate]);

  useEffect(() => {
    shownAt.current = Date.now();
    window.scrollTo(0, 0);
  }, [index]);

  // ---- saving -----------------------------------------------------------------------------
  const handleSaveError = useCallback(
    (error: unknown, questionId: string, body: AnswerPayload) => {
      if (error instanceof ApiError) {
        if (error.code === 'payment_required') {
          setPaid(false);
          setIndex(indexOfPayment(itemsRef.current));
          return;
        }
        if (error.code === 'already_finished') {
          navigate('/resultado', { replace: true });
          return;
        }
        if (error.status === 401) {
          forgetSession();
          navigate('/', { replace: true });
          return;
        }
      }
      failed.current.set(questionId, body);
      setSyncError(true);
    },
    [navigate],
  );

  const enqueue = useCallback(
    (questionId: string, body: AnswerPayload) => {
      queue.current = queue.current.then(async () => {
        try {
          await saveAnswer(questionId, body);
          failed.current.delete(questionId);
        } catch (error) {
          handleSaveError(error, questionId, body);
        }
      });
    },
    [handleSaveError],
  );

  /** Waits for background saves and retries any that failed. Throws if one still fails. */
  const flush = useCallback(async () => {
    await queue.current;
    for (const [questionId, body] of [...failed.current]) {
      await saveAnswer(questionId, body);
      failed.current.delete(questionId);
    }
    setSyncError(false);
  }, []);

  const retrySync = useCallback(() => {
    setSyncError(false);
    for (const [questionId, body] of [...failed.current]) enqueue(questionId, body);
  }, [enqueue]);

  // ---- navigation -------------------------------------------------------------------------
  const finish = useCallback(async () => {
    setBusy(true);
    setActionError(null);
    try {
      await flush();
      await completeAssessment();
      navigate('/resultado');
    } catch (error) {
      setActionError(
        error instanceof ApiError && error.code === 'invalid_answer'
          ? 'Falta responder alguna pregunta de seguridad. Vuelve atrás y revísalas.'
          : 'No pudimos cerrar tu evaluación. Inténtalo de nuevo.',
      );
    } finally {
      setBusy(false);
    }
  }, [flush, navigate]);

  const goForward = useCallback(() => {
    if (!loaded) return;
    if (index >= loaded.items.length - 1) {
      void finish();
      return;
    }
    setIndex(index + 1);
  }, [loaded, index, finish]);

  const goBack = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  const submit = useCallback(
    async (question: Question, submission: Submission) => {
      const ms = Math.min(Date.now() - shownAt.current, 3_600_000);
      const body: AnswerPayload =
        'skipped' in submission
          ? { skipped: true, ms_on_screen: ms }
          : { value: submission.value, ms_on_screen: ms };
      setAnswers((current) => ({
        ...current,
        [question.id]:
          'skipped' in submission
            ? { skipped: true, value: null }
            : { skipped: false, value: submission.value },
      }));

      if (!question.checks_red_flag) {
        enqueue(question.id, body);
        goForward();
        return;
      }

      setBusy(true);
      setActionError(null);
      try {
        await flush();
        const reply = await saveAnswer(question.id, body);
        if (reply.stop) {
          navigate('/resultado', { replace: true });
          return;
        }
        goForward();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          forgetSession();
          navigate('/', { replace: true });
          return;
        }
        setActionError('No pudimos guardar tu respuesta. Inténtalo de nuevo.');
      } finally {
        setBusy(false);
      }
    },
    [enqueue, flush, goForward, navigate],
  );

  const exit = useCallback(() => {
    const count = Object.keys(answers).length;
    if (
      count > 1 &&
      !window.confirm(
        'Tus respuestas quedan guardadas en este dispositivo. ¿Salir de la evaluación?',
      )
    ) {
      return;
    }
    navigate('/');
  }, [answers, navigate]);

  // ---- derived ----------------------------------------------------------------------------
  const derived = useMemo(() => {
    if (!loaded) return null;
    const total = loaded.questionnaire.questions.length;
    const answered = answeredCount(loaded.questionnaire, answers);
    const chapter: Chapter | undefined = chapterAt(loaded.items, index, loaded.questionnaire);
    return {
      total,
      answered,
      chapter,
      percent: Math.round((answered / total) * 100),
      counter: `${Math.min(answered + 1, total)} / ${total}`,
    };
  }, [loaded, answers, index]);

  return {
    loaded,
    derived,
    loadError,
    retryLoad: () => setAttempt((n) => n + 1),
    index,
    item: loaded?.items[index],
    answers,
    paid,
    busy,
    actionError,
    syncError,
    retrySync,
    goForward,
    goBack,
    submit,
    exit,
  };
}
