import { FeedbackForm } from '../components/explainer/FeedbackForm';
import { Stations } from '../components/explainer/Stations';
import { Logo } from '../components/ui/Logo';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchQuestionnaire } from '../services/assessments';
import { formatMoney } from '../utils/format';

const SECONDS_PER_QUESTION = 11.5;

/** "La Ruta ALFA — cómo funciona": the whole journey, start to finish. */
export function HowItWorksPage() {
  const questionnaire = useAsyncData(fetchQuestionnaire);
  const data = questionnaire.status === 'ready' ? questionnaire.data : null;
  const price = data?.price ?? null;
  const total = data?.questions.length ?? null;
  const minutes = total ? Math.round((total * SECONDS_PER_QUESTION) / 60) : null;

  return (
    <div className="page-explainer">
      <header className="ex-header">
        <div className="wrap">
          <div className="ex-top">
            <Logo to="/" />
            <span className="badge">Cómo funciona · 2 minutos de lectura</span>
          </div>
          <span className="eyebrow">La Ruta ALFA</span>
          <h1>
            De no saber
            <br />
            qué te pasa,
            <br />a saber qué hacer
          </h1>
          <p className="lede" style={{ marginTop: 26 }}>
            Esto es todo el recorrido, de principio a fin. Sin letra pequeña: lo que se te pregunta,
            lo que cuesta, lo que recibes y qué pasa después.
          </p>

          <div className="glance">
            {[
              ['01', 'Cuentas', 'Qué te trae hoy'],
              ['02', 'Pagas', price ? `${formatMoney(price)}, una vez` : 'Una sola vez'],
              [
                '03',
                'Respondes',
                total ? `${total} preguntas, ${minutes} minutos` : 'Pregunta a pregunta',
              ],
              ['04', 'Entiendes', 'Tu lectura completa'],
              ['05', 'Sabes', 'Con quién hablar'],
              ['06', 'Haces', '21 días de plan'],
              ['07', 'Mides', 'Comparas contigo mismo'],
            ].map(([n, title, text]) => (
              <div className="g" key={n}>
                <i>{n}</i>
                <b>{title}</b>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <Stations price={price} totalQuestions={total} />
      <FeedbackForm priceLabel={price ? formatMoney(price) : 'pesos'} />

      <footer className="ex-footer">
        <div className="wrap">
          <p className="legal">
            <b>Aviso.</b> La Ruta ALFA es una herramienta de orientación en salud sexual.{' '}
            <b>
              No es un diagnóstico médico, no indica ni autoriza medicamentos y no reemplaza la
              consulta con un profesional de la salud.
            </b>{' '}
            Las decisiones clínicas corresponden al profesional tratante. Si tienes dolor en el
            pecho, falta de aire con el esfuerzo, una erección dolorosa que no cede o un golpe
            reciente en la pelvis, busca atención médica de inmediato.
          </p>
          <p className="legal" style={{ marginTop: 12 }}>
            Contenido apoyado en la Guía de Disfunción Eréctil de la Sociedad Colombiana de Urología
            e instrumentos de autoevaluación validados. Documento de trabajo pendiente de validación
            por el médico responsable.
          </p>
        </div>
      </footer>
    </div>
  );
}
