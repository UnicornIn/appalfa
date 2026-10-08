export function ReportDisclaimer({ engineVersion }: { engineVersion: string }) {
  return (
    <p className="legal" style={{ marginTop: 40 }}>
      <b>Aviso.</b> Esta lectura organiza la información que tú entregaste y sugiere una ruta de
      atención.{' '}
      <b>
        No es un diagnóstico médico, no indica ni autoriza medicamentos y no reemplaza la consulta
        con un profesional de la salud.
      </b>{' '}
      El puntaje del IIEF-5 corresponde al instrumento y a la guía que lo usa, no a ALFA+. Si tienes
      dolor en el pecho, falta de aire con el esfuerzo, una erección dolorosa que no cede o un golpe
      reciente en la pelvis, busca atención médica de inmediato. Motor de evaluación {engineVersion}
      , pendiente de validación por el médico responsable.
    </p>
  );
}
