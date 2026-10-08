import { useState } from 'react';
import type { Submission } from '../../hooks/useAssessmentFlow';
import type { AnswerValue, BodyMetrics, Question, StoredAnswer } from '../../types/api';
import { Button } from '../ui/Button';
import { EhsChoice, MultiChoice, ScaleChoice, SingleChoice } from './ChoiceInputs';
import { BodyMetricsInput, NumberInput, TextAnswerInput } from './FormInputs';

interface QuestionViewProps {
  question: Question;
  position: number;
  total: number;
  stored: StoredAnswer | undefined;
  busy: boolean;
  error: string | null;
  canGoBack: boolean;
  onSubmit: (submission: Submission) => void;
  onBack: () => void;
}

const NEEDS_CONFIRM = new Set(['multi_choice', 'number', 'body_metrics', 'text']);

function initialDraft(
  question: Question,
  stored: StoredAnswer | undefined,
): AnswerValue | undefined {
  const value = stored && !stored.skipped ? stored.value : undefined;
  if (value !== undefined && value !== null) return value;
  return question.type === 'text' ? '' : undefined;
}

export function QuestionView({
  question,
  position,
  total,
  stored,
  busy,
  error,
  canGoBack,
  onSubmit,
  onBack,
}: QuestionViewProps) {
  const [draft, setDraft] = useState<AnswerValue | undefined>(() => initialDraft(question, stored));
  const current = stored && !stored.skipped ? stored.value : undefined;
  const options = question.options ?? [];
  const pick = (value: string | number) => onSubmit({ value });

  const canContinue =
    draft !== undefined && !(question.type === 'multi_choice' && (draft as string[]).length === 0);

  return (
    <>
      <div className="qnum">
        Pregunta {position} de {total}
      </div>
      <p className="qtext">{question.text}</p>
      {question.help && <p className="qhelp">{question.help}</p>}

      {question.type === 'single_choice' && (
        <SingleChoice
          options={options}
          current={current as string | number | undefined}
          disabled={busy}
          onPick={pick}
        />
      )}
      {question.type === 'ehs' && (
        <EhsChoice
          options={options}
          current={current as string | number | undefined}
          disabled={busy}
          onPick={pick}
        />
      )}
      {question.type === 'scale' && (
        <ScaleChoice
          labels={question.labels ?? []}
          current={current as number | undefined}
          disabled={busy}
          onPick={pick}
        />
      )}
      {question.type === 'multi_choice' && (
        <MultiChoice
          options={options}
          value={(draft as string[] | undefined) ?? []}
          disabled={busy}
          onChange={setDraft}
        />
      )}
      {question.type === 'number' && (
        <NumberInput
          label={question.unit ?? ''}
          min={question.min ?? 0}
          max={question.max ?? 999}
          initial={draft as number | undefined}
          onChange={setDraft}
        />
      )}
      {question.type === 'body_metrics' && (
        <BodyMetricsInput initial={draft as BodyMetrics | undefined} onChange={setDraft} />
      )}
      {question.type === 'text' && (
        <TextAnswerInput initial={(draft as string | undefined) ?? ''} onChange={setDraft} />
      )}

      <details className="why">
        <summary>Por qué te pregunto esto</summary>
        <p>{question.why}</p>
      </details>

      <div className="flow-nav">
        <Button variant="ghost" disabled={!canGoBack || busy} onClick={onBack}>
          Atrás
        </Button>
        <div className="right">
          {question.skippable && (
            <Button variant="ghost" disabled={busy} onClick={() => onSubmit({ skipped: true })}>
              Prefiero no responder
            </Button>
          )}
          {NEEDS_CONFIRM.has(question.type) && (
            <Button
              variant="solid"
              disabled={busy || !canContinue}
              onClick={() => draft !== undefined && onSubmit({ value: draft })}
            >
              {busy ? 'Guardando…' : 'Continuar'}
            </Button>
          )}
        </div>
      </div>
      {error && (
        <p className="small" role="alert" style={{ marginTop: 14, color: 'var(--plata)' }}>
          {error}
        </p>
      )}
    </>
  );
}
