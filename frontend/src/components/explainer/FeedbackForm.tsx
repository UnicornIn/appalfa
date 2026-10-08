import { useState } from 'react';
import { submitFeedback } from '../../services/contact';
import type {
  FeedbackClarity,
  FeedbackConfidence,
  FeedbackLostAt,
  FeedbackPayload,
} from '../../types/api';
import { Button } from '../ui/Button';

type Status = 'idle' | 'sending' | 'sent' | 'error';

function Choices<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly (readonly [T, string])[];
  value: T | undefined;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="choices" role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button
          type="button"
          className="choice"
          key={key}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

const CLARITY = [
  ['si', 'Sí, claro'],
  ['masomenos', 'Más o menos'],
  ['no', 'No'],
] as const satisfies readonly (readonly [FeedbackClarity, string])[];

const LOST_AT = [
  ['ninguna', 'En ninguna'],
  ['pago', 'En el pago'],
  ['preguntas', 'En las preguntas'],
  ['resultado', 'En lo que recibo al final'],
  ['rutas', 'En con quién voy a hablar'],
] as const satisfies readonly (readonly [FeedbackLostAt, string])[];

const CONFIDENCE = [
  ['si', 'Sí'],
  ['duda', 'Lo pensaría'],
  ['no', 'No'],
] as const satisfies readonly (readonly [FeedbackConfidence, string])[];

export function FeedbackForm({ priceLabel }: { priceLabel: string }) {
  const [answers, setAnswers] = useState<Omit<FeedbackPayload, 'comment'>>({});
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function send() {
    const text = comment.trim();
    if (!answers.clarity && !answers.lost_at && !answers.confidence && !text) {
      setStatus('error');
      setMessage('Marca al menos una respuesta.');
      return;
    }
    setStatus('sending');
    setMessage('Enviando…');
    try {
      await submitFeedback({ ...answers, comment: text });
      setStatus('sent');
      setMessage('Gracias. Quedó registrado.');
    } catch {
      setStatus('error');
      setMessage('No pudimos enviar tus respuestas. Inténtalo de nuevo.');
    }
  }

  return (
    <section className="fb wrap" id="fb">
      <span className="eyebrow">Antes de irte</span>
      <h2>¿Quedó claro?</h2>
      <p className="small" style={{ margin: '10px 0 28px', maxWidth: '52ch' }}>
        Tres preguntas rápidas. Nos sirven para arreglar lo que no se entendió.
      </p>

      <div className="fb-q">
        <p>1 · ¿Entendiste qué recibes por los {priceLabel}?</p>
        <Choices
          label="Claridad"
          options={CLARITY}
          value={answers.clarity}
          onChange={(clarity) => setAnswers((a) => ({ ...a, clarity }))}
        />
      </div>
      <div className="fb-q">
        <p>2 · ¿En qué parte te perdiste?</p>
        <Choices
          label="Dónde te perdiste"
          options={LOST_AT}
          value={answers.lost_at}
          onChange={(lost_at) => setAnswers((a) => ({ ...a, lost_at }))}
        />
      </div>
      <div className="fb-q">
        <p>3 · ¿Lo harías?</p>
        <Choices
          label="Confianza"
          options={CONFIDENCE}
          value={answers.confidence}
          onChange={(confidence) => setAnswers((a) => ({ ...a, confidence }))}
        />
      </div>
      <div className="fb-q">
        <p>
          4 · ¿Qué te generó dudas? <span className="small">(opcional)</span>
        </p>
        <label className="visually-hidden" htmlFor="fb-txt">
          Qué te generó dudas
        </label>
        <textarea
          id="fb-txt"
          rows={3}
          maxLength={1000}
          value={comment}
          placeholder="Lo que sea: una palabra que no entendiste, algo que te dio desconfianza…"
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button variant="solid" onClick={send} disabled={status === 'sending' || status === 'sent'}>
        Enviar
      </Button>
      <p className="small" role="status" style={{ marginTop: 14, minHeight: '1.2em' }}>
        {message}
      </p>
    </section>
  );
}
