import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AsyncState } from '../../hooks/useAsyncData';
import { startAssessment } from '../../services/assessments';
import type { Questionnaire } from '../../types/api';
import { formatMoney } from '../../utils/format';
import { ErrorState, Loading, errorMessage } from '../ui/Feedback';

interface HeroProps {
  questionnaire: AsyncState<Questionnaire> & { reload: () => void };
}

/** The first question lives on the landing page; answering it opens the Ruta ALFA. */
export function Hero({ questionnaire }: HeroProps) {
  const price = questionnaire.status === 'ready' ? questionnaire.data.price : null;

  return (
    <header className="hero" id="top">
      <div className="hero-bg">
        <div className="hero-glow" />
        <div className="hero-lines" />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Salud sexual masculina · Evaluación privada</span>
            <h1>
              Algo cambió
              <br />
              y no sabes
              <br />
              por qué
            </h1>
            <p className="lede">
              No necesitas saber qué te pasa para empezar. Contesta, a tu ritmo, las mismas
              preguntas que te haría un profesional en consulta. Al final entiendes tu situación,
              sabes qué revisar y con quién hablar.
            </p>
            <div className="trust">
              <span className="chip">Sin registro para empezar</span>
              <span className="chip">6–8 minutos</span>
              <span className="chip">Nadie más lo ve</span>
              {price && <span className="chip">{formatMoney(price)} · pago único</span>}
            </div>
            <p className="small" style={{ marginTop: 26, maxWidth: '46ch' }}>
              Preguntas construidas sobre la Guía de Disfunción Eréctil de la Sociedad Colombiana de
              Urología y sobre instrumentos validados de autoevaluación.
            </p>
          </div>

          <FirstQuestion questionnaire={questionnaire} />
        </div>
      </div>
    </header>
  );
}

function FirstQuestion({ questionnaire }: HeroProps) {
  const navigate = useNavigate();
  const [chosen, setChosen] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function begin(value: string | number) {
    setChosen(value);
    setError(null);
    try {
      await startAssessment({ value, ms_on_screen: 0 });
      navigate('/evaluacion');
    } catch (cause) {
      setChosen(null);
      setError(errorMessage(cause instanceof Error ? cause : new Error()));
    }
  }

  const first = questionnaire.status === 'ready' ? questionnaire.data.questions[0] : undefined;
  const price = questionnaire.status === 'ready' ? questionnaire.data.price : null;

  return (
    <div className="q0">
      <span className="eyebrow" style={{ marginBottom: 12 }}>
        Empecemos aquí
      </span>
      <p className="ask">{first?.text ?? '¿Qué te trae hoy?'}</p>
      <p className="small" style={{ margin: 0 }}>
        Sin juicios. Sin preguntas incómodas. Elige lo que más se parezca.
      </p>

      {questionnaire.status === 'loading' && (
        <div style={{ marginTop: 22 }}>
          <Loading label="Preparando tu evaluación…" />
        </div>
      )}
      {questionnaire.status === 'error' && (
        <div style={{ marginTop: 22 }}>
          <ErrorState
            error={questionnaire.error}
            title="No pudimos cargar las preguntas"
            onRetry={questionnaire.reload}
          />
        </div>
      )}
      {first?.options && (
        <div className="opts">
          {first.options.map((o) => (
            <button
              type="button"
              key={String(o.value)}
              className="opt"
              aria-pressed={chosen === o.value}
              disabled={chosen !== null}
              onClick={() => begin(o.value)}
            >
              <span className="mark" />
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="small" role="alert" style={{ marginTop: 14, color: 'var(--plata)' }}>
          {error}
        </p>
      )}

      {price && (
        <p className="small" style={{ margin: '18px 0 0' }}>
          Tu respuesta abre la Ruta ALFA: pago único de {formatMoney(price)} antes de empezar. Si
          durante la evaluación aparece una señal que exige atención médica, el proceso se detiene,
          esa información es gratuita y se devuelve el 100 %.
        </p>
      )}
    </div>
  );
}
