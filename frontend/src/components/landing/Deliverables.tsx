import type { Money } from '../../types/api';
import { formatMoney } from '../../utils/format';
import { Button } from '../ui/Button';

const ICONS: Record<string, React.ReactNode> = {
  map: (
    <>
      <circle cx="23" cy="23" r="18" stroke="#8a8b8d" strokeWidth="1" />
      <path d="M23 5v36M5 23h36" stroke="#3c3d3f" strokeWidth="1" />
      <path
        d="M23 9l11 8-4 13H16l-4-13z"
        stroke="#c5c6c8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </>
  ),
  factors: (
    <>
      <rect x="7" y="9" width="32" height="28" stroke="#8a8b8d" strokeWidth="1" />
      <path d="M13 19h20M13 25h14M13 31h9" stroke="#c5c6c8" strokeWidth="1.2" />
      <path d="M31 9v-4M31 41v-4" stroke="#3c3d3f" strokeWidth="1" />
    </>
  ),
  route: (
    <>
      <path d="M6 34c6-2 10-14 17-14s8 8 17 2" stroke="#c5c6c8" strokeWidth="1.2" />
      <path d="M6 40h34" stroke="#3c3d3f" strokeWidth="1" />
      <circle cx="23" cy="20" r="3" fill="#c5c6c8" />
    </>
  ),
  days: (
    <>
      <rect x="8" y="8" width="30" height="30" stroke="#8a8b8d" strokeWidth="1" />
      <path d="M8 18h30" stroke="#8a8b8d" strokeWidth="1" />
      <path d="M15 26h4v4h-4zM21 26h4v4h-4zM27 26h4v4h-4z" fill="#c5c6c8" />
    </>
  ),
  questions: (
    <>
      <path d="M23 6v34M12 12v22M34 12v22" stroke="#3c3d3f" strokeWidth="1" />
      <circle cx="23" cy="16" r="6" stroke="#c5c6c8" strokeWidth="1.2" />
      <path d="M13 38c2-7 5-10 10-10s8 3 10 10" stroke="#c5c6c8" strokeWidth="1.2" />
    </>
  ),
  baseline: (
    <>
      <path d="M8 30L18 20l7 7 13-13" stroke="#c5c6c8" strokeWidth="1.2" />
      <path d="M8 38h30" stroke="#3c3d3f" strokeWidth="1" />
      <path d="M31 14h7v7" stroke="#c5c6c8" strokeWidth="1.2" />
    </>
  ),
};

const CARDS = [
  {
    icon: 'map',
    title: 'Tu mapa',
    text: 'Siete dimensiones de tu salud sexual dibujadas con tus propias respuestas: mecanismo, función, deseo, eyaculación, cuerpo, cabeza y hábitos. Ves de un vistazo dónde está el peso.',
  },
  {
    icon: 'factors',
    title: 'Tus factores',
    text: 'Qué de lo que contaste puede estar pesando: sueño, presión, glicemia, tabaco, estrés, ánimo, ansiedad de desempeño. Nombrados uno por uno, con lo que tú mismo respondiste.',
  },
  {
    icon: 'route',
    title: 'Tu ruta',
    text: 'Una sola conclusión clara: hábitos, apoyo psicológico o sexológico, valoración médica o atención pronta. Con el motivo escrito, para que sepas por qué.',
  },
  {
    icon: 'days',
    title: '21 días',
    text: 'Un programa diario corto y medible, con lo que sí tiene evidencia: suelo pélvico, sueño, movimiento, alcohol, manejo de la ansiedad. Al día 21 vuelves a medirte con la misma escala.',
  },
  {
    icon: 'questions',
    title: 'Tus 7 preguntas',
    text: 'Lo que vale la pena preguntarle al profesional en tu caso, y los exámenes que la guía colombiana recomienda considerar. Llegas con material, no con vergüenza.',
  },
  {
    icon: 'baseline',
    title: 'Tu punto cero',
    text: 'Tu medición de hoy queda guardada. Es contra ese número que vas a comparar dentro de un mes, y es lo que el médico recibe cuando decidas consultar.',
  },
];

export function Deliverables({ price }: { price: Money | null }) {
  return (
    <section className="sec" id="recibes">
      <div className="wrap">
        <div className="head-rule">
          <span className="eyebrow">Lo que te queda en la mano</span>
          <h2>Conciencia, no un susto</h2>
        </div>
        <div className="cards">
          {CARDS.map((card) => (
            <div className="card" key={card.title}>
              <svg
                className="ico"
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                aria-hidden="true"
              >
                {ICONS[card.icon]}
              </svg>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
        <div className="price-cta">
          <div>
            <span className="eyebrow" style={{ marginBottom: 8 }}>
              Ruta ALFA
            </span>
            <div className="price" style={{ margin: 0 }}>
              <b>{price ? formatMoney(price) : '—'}</b>
              <span>{price?.currency ?? 'COP'} · pago único</span>
            </div>
            <p className="small" style={{ margin: '8px 0 0', maxWidth: '46ch' }}>
              Todo lo anterior, sin suscripción. Se paga al empezar y la lectura completa se entrega
              al terminar la evaluación.
            </p>
          </div>
          <Button variant="solid" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Empezar mi Ruta ALFA
          </Button>
        </div>
      </div>
    </section>
  );
}
