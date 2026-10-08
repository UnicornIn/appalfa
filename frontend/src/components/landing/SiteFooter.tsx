import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
            marginBottom: 30,
          }}
        >
          <Logo />
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Iniciar mi evaluación privada
          </Button>
        </div>
        <p className="legal">
          <b>Aviso.</b> ALFA+ es una plataforma de orientación en salud sexual. La evaluación
          organiza tu información y sugiere rutas de atención;{' '}
          <b>
            no constituye diagnóstico médico, no indica ni autoriza medicamentos y no sustituye la
            consulta con un profesional de la salud.
          </b>{' '}
          Las decisiones clínicas corresponden exclusivamente al profesional tratante. Si tienes
          dolor en el pecho, falta de aire con el esfuerzo, una erección dolorosa que no cede o un
          traumatismo reciente, busca atención médica inmediata.
        </p>
        <p className="legal" style={{ marginTop: 14 }}>
          Contenido educativo basado en la Guía de Práctica Clínica de Disfunción Eréctil de la
          Sociedad Colombiana de Urología (2015) e instrumentos de autoevaluación validados. Versión
          del motor de evaluación: v0.1 — documento de trabajo pendiente de validación por el médico
          responsable.
        </p>
        <p className="legal" style={{ marginTop: 14 }}>
          © 2026 ALFA+. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
