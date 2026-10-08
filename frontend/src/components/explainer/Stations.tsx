import type { Money } from '../../types/api';
import { formatMoney } from '../../utils/format';

function Station({
  n,
  last = false,
  children,
}: {
  n: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`station${last ? ' last' : ''}`}>
      <div className="rail">
        <span className="n">{n}</span>
        <span className="line" />
      </div>
      <div className="station-body">{children}</div>
    </section>
  );
}

interface StationsProps {
  price: Money | null;
  totalQuestions: number | null;
}

const WHAT_TO_TELL = [
  'Me cuesta lograrla',
  'No me dura',
  'Perdí el deseo',
  'Termino muy rápido',
  'Siento dolor',
  'Algo cambió y no sé qué',
];

const QUESTION_GROUPS = [
  'Qué te trae',
  'Tu grado',
  'Tu patrón',
  'Al despertar',
  'Tu escala',
  'Deseo y eyaculación',
  'Tu cuerpo',
  'Tu cabeza',
  'Tus hábitos',
  'Cierre',
];

const DELIVERABLES = [
  ['Tu grado', 'El que tú mismo elegiste, en una escala de cuatro que se usa en consulta.'],
  [
    'Tu mapa',
    'Siete dimensiones dibujadas con tus respuestas: mecanismo, función, deseo, eyaculación, cuerpo, cabeza y hábitos.',
  ],
  ['Tus factores', 'Qué de lo que contaste puede estar pesando, nombrado uno por uno.'],
  ['Tu escala', 'Tu puntaje en un cuestionario validado, con lo que ese puntaje significa.'],
  [
    'Tus 7 preguntas',
    'Lo que vale la pena preguntarle al profesional en tu caso, y los exámenes que se suelen considerar.',
  ],
  ['Tu punto cero', 'Tu medición de hoy, guardada, para comparar dentro de un mes.'],
] as const;

const ROUTES = [
  [
    'Hábitos',
    'No aparecen factores que obliguen a consultar ya. El primer movimiento está en tus manos, y es medible en 21 días.',
  ],
  [
    'Médico',
    'Hay señales que conviene revisar con un profesional. La dificultad de erección puede ser un aviso temprano de algo vascular o metabólico.',
  ],
  [
    'Psicología o sexología',
    'El cuerpo parece responder y algo más está interfiriendo: ansiedad, presión, expectativa, la relación.',
  ],
  [
    'Seguimiento',
    'Ya tienes un diagnóstico. Aquí registras tu punto de hoy y preparas tu próximo control.',
  ],
] as const;

export function Stations({ price, totalQuestions }: StationsProps) {
  const cost = price ? formatMoney(price) : '—';
  return (
    <main className="wrap">
      <Station n="01">
        <h2>Cuentas qué te pasa</h2>
        <p>
          Una sola pregunta para empezar: <b>¿qué te trae hoy?</b> Nueve opciones, eliges la que más
          se parezca. No necesitas saber qué tienes. Para eso está lo que sigue.
        </p>
        <div className="tags">
          {WHAT_TO_TELL.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <p className="small" style={{ marginTop: 14 }}>
          Sin correo, sin teléfono, sin cuenta. Gratis.
        </p>
      </Station>

      <Station n="02">
        <h2>Pagas una sola vez</h2>
        <div className="price-block">
          <b>{cost}</b>
          <span>pesos · pago único</span>
        </div>
        <p>
          No es suscripción. No hay nada que comprar después. Incluye todo el recorrido: la
          evaluación, la lectura completa, el plan de 21 días y el agendamiento con un profesional.
        </p>
        <div className="alto">
          <b>Si aparece una alarma, no te cobramos</b>
          <p style={{ margin: 0, fontWeight: 200 }}>
            Si en algún momento tus respuestas muestran algo que necesita un médico pronto, la
            evaluación se detiene ahí, esa información te la damos gratis y te devolvemos los {cost}{' '}
            completos. No te vamos a vender un informe cuando lo que necesitas es una consulta.
          </p>
        </div>
      </Station>

      <Station n="03">
        <h2>Respondes {totalQuestions ?? ''} preguntas</h2>
        <p>
          Una pregunta por pantalla, con barra de progreso. Las mismas que te haría un profesional
          en consulta, en el mismo orden. Debajo de cada una puedes abrir{' '}
          <b>«por qué te pregunto esto»</b> y entender qué se está buscando.
        </p>
        <div className="tags">
          {QUESTION_GROUPS.map((group, i) => (
            <span className="tag" key={group}>
              <b>{i + 1}</b> · {group}
            </span>
          ))}
        </div>
        <div className="panel">
          <h3 style={{ marginBottom: 10 }}>Lo que pasa mientras respondes</h3>
          <p className="small" style={{ margin: 0 }}>
            Puedes saltar cualquier pregunta con «prefiero no responder», salvo tres de seguridad.
            Puedes volver atrás. Puedes salir y seguir después. Nadie más ve tus respuestas: se
            comparten con un profesional solo si tú lo autorizas.
          </p>
        </div>
      </Station>

      <Station n="04">
        <h2>Entiendes qué te pasa</h2>
        <p>Al terminar recibes tu lectura completa. Todo destapado: ya está pagado.</p>
        <div className="cells three">
          {DELIVERABLES.map(([title, text]) => (
            <div key={title}>
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 14 }}>
          Esto no es un diagnóstico. Es tu información ordenada y explicada. Quien diagnostica es un
          médico.
        </p>
      </Station>

      <Station n="05">
        <h2>Sabes con quién hablar</h2>
        <p>
          La lectura termina en una sola conclusión clara, con el motivo escrito. Hay cuatro
          posibles, y una salida de seguridad.
        </p>
        <div className="cells two">
          {ROUTES.map(([title, text]) => (
            <div key={title}>
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="alto">
          <b>Alto · atención médica</b>
          <p style={{ margin: 0, fontWeight: 200 }}>
            Si algo de lo que respondiste necesita un médico pronto, el recorrido se detiene ahí. Te
            decimos qué encontramos, por qué amerita atención y a dónde ir. Sin informe, sin plan,
            sin venta, y con tu dinero de vuelta.
          </p>
        </div>
        <p className="small" style={{ marginTop: 14 }}>
          Si prefieres saltarte todo esto y hablar de una vez con un médico, esa puerta está abierta
          desde la página de inicio.
        </p>
      </Station>

      <Station n="06">
        <h2>Haces algo, 21 días</h2>
        <p>
          Un plan diario corto con lo que sí tiene respaldo: sueño, movimiento, ejercicios de suelo
          pélvico, alcohol y manejo de la presión mental. Tres semanas, tareas de minutos, sin
          gimnasio y sin suplementos.
        </p>
        <div className="panel">
          <p className="small" style={{ margin: 0 }}>
            <b>Semana 1</b> · sueño y alcohol &nbsp;·&nbsp; <b>Semana 2</b> · movimiento y suelo
            pélvico &nbsp;·&nbsp; <b>Semana 3</b> · presión mental y pareja
          </p>
        </div>
      </Station>

      <Station n="07" last>
        <h2>Te vuelves a medir</h2>
        <p>
          El día 21 repites la misma evaluación y comparas contra tu punto cero. Si mejoró, lo ves.
          Si no cambió, ese resultado es exactamente lo que un profesional necesita ver: llegas a la
          consulta con 21 días de datos tuyos, no con un formulario en blanco.
        </p>
        <div className="loop">Y el recorrido vuelve a empezar, ahora con historia</div>
      </Station>
    </main>
  );
}
