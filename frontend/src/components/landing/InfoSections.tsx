import { AppointmentForm } from '../appointments/AppointmentForm';

const MATRIX_SIZE = 100;
const MATRIX_FILLED = 52;

export function StatSection() {
  return (
    <section className="sec" id="dato">
      <div className="wrap">
        <div className="dato">
          <div>
            <span className="eyebrow">Por qué importa mirarlo</span>
            <h2 style={{ marginBottom: 26 }}>
              No es raro.
              <br />
              Es frecuente
              <br />
              y casi nadie
              <br />
              lo revisa
            </h2>
            <div className="stat">
              <b>52 %</b>
              <span>
                de los hombres entre 40 y 70 años reporta algún grado de dificultad de erección
                (Massachusetts Male Aging Study).
              </span>
            </div>
            <div className="stat">
              <b>1 de cada 4</b>
              <span>
                casos nuevos ocurre en hombres menores de 40 años, donde el componente emocional
                suele pesar más.
              </span>
            </div>
            <div className="stat">
              <b>Señal temprana</b>
              <span>
                La Guía de la Sociedad Colombiana de Urología señala que la dificultad de erección
                puede ser un signo temprano de un problema vascular o metabólico.
              </span>
            </div>
            <p className="small" style={{ maxWidth: '56ch' }}>
              Cifras de literatura publicada, incluidas para contexto. No describen tu caso: tu
              evaluación sí.
            </p>
          </div>
          <div>
            <div className="matrix" aria-hidden="true">
              {Array.from({ length: MATRIX_SIZE }, (_, i) => (
                <div className={`dot${i < MATRIX_FILLED ? ' on' : ''}`} key={i} />
              ))}
            </div>
            <p className="small" style={{ marginTop: 20, maxWidth: '34ch' }}>
              Cada cuadro es un hombre de 40 a 70 años. Los llenos reportan algún grado de
              dificultad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const PRIVACY = [
  {
    title: 'Sin registro',
    text: 'Empiezas sin correo, sin teléfono y sin tarjeta. Solo pedimos datos si decides agendar.',
  },
  {
    title: 'Tú controlas',
    text: 'Toda pregunta admite “prefiero no responder”, salvo las de seguridad. Puedes borrar tu evaluación cuando quieras.',
  },
  {
    title: 'Nada de anuncios',
    text: 'Tus respuestas de salud no se usan para publicidad ni se comparten con terceros comerciales.',
  },
  {
    title: 'Solo el profesional',
    text: 'Tu evaluación se comparte únicamente con el profesional que tú elijas, y solo si tú lo autorizas.',
  },
];

export function PrivacySection() {
  return (
    <section className="sec" id="privacidad">
      <div className="wrap">
        <div className="head-rule">
          <span className="eyebrow">Privacidad</span>
          <h2>
            La razón por la que
            <br />
            sí vas a contestar
          </h2>
        </div>
        <div className="priv">
          {PRIVACY.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DoctorSection() {
  return (
    <section className="sec" id="medico">
      <div className="wrap">
        <div className="medico">
          <div>
            <span className="eyebrow">La otra puerta</span>
            <h2 style={{ marginBottom: 22 }}>
              Prefiero hablar
              <br />
              directamente con
              <br />
              un médico
            </h2>
            <p className="lede">
              Perfectamente válido. Si ya sabes que quieres consulta, o si prefieres que sea una
              persona quien te pregunte, agenda una valoración con un profesional en salud sexual
              masculina.
            </p>
            <p className="small" style={{ maxWidth: '56ch' }}>
              La consulta se realiza por telemedicina bajo el modelo sanitario que corresponda. El
              profesional es quien valora, diagnostica y define el manejo. ALFA+ coordina la
              experiencia; la responsabilidad clínica es del profesional.
            </p>
            <p className="small" style={{ maxWidth: '56ch' }}>
              Si completas antes la evaluación, el profesional recibe tu información ordenada y la
              consulta rinde más. No es obligatorio.
            </p>
          </div>
          <div>
            <AppointmentForm />
          </div>
        </div>
      </div>
    </section>
  );
}
