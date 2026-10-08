interface JourneyProps {
  totalQuestions: number | null;
}

export function Journey({ totalQuestions }: JourneyProps) {
  const steps = [
    { title: 'Entender', text: 'Cuentas qué te preocupa, con tus palabras.' },
    {
      title: 'Evaluar',
      text: `${totalQuestions ?? 'Varias'} preguntas ordenadas, como en consulta.`,
    },
    { title: 'Orientar', text: 'Tu mapa, tus factores y tu ruta de atención.' },
    { title: 'Conectar', text: 'Un profesional de salud, si corresponde.' },
    { title: 'Tratar', text: 'El profesional decide el manejo. Siempre él.' },
    { title: 'Acompañar', text: 'Programa de 21 días y remedición.' },
  ];

  return (
    <section className="sec" id="como">
      <div className="wrap">
        <div className="head-rule">
          <span className="eyebrow">El recorrido</span>
          <h2>
            De no saber qué te pasa,
            <br />a saber qué hacer
          </h2>
        </div>
        <div className="steps">
          {steps.map((step, i) => (
            <div className="step" key={step.title}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <strong>{step.title}</strong>
              <span className="t">{step.text}</span>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 26, maxWidth: '70ch' }}>
          ALFA+ organiza y ordena información para que llegues preparado. No emite diagnósticos, no
          indica medicamentos y no reemplaza la consulta médica.
        </p>
      </div>
    </section>
  );
}
