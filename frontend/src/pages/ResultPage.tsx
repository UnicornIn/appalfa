import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentModal } from '../components/appointments/AppointmentModal';
import { ReportView } from '../components/report/ReportView';
import { StopNotice } from '../components/report/StopNotice';
import { Button } from '../components/ui/Button';
import { ErrorState, Loading } from '../components/ui/Feedback';
import { useResult } from '../hooks/useResult';
import { downloadReportPdf, forgetSession } from '../services/assessments';
import { saveBlob } from '../utils/download';

export function ResultPage() {
  const navigate = useNavigate();
  const { view, retry } = useResult();
  const [scheduling, setScheduling] = useState(false);
  const [pdf, setPdf] = useState<'idle' | 'working' | 'error'>('idle');

  const restart = () => {
    forgetSession();
    navigate('/');
  };

  async function savePdf() {
    setPdf('working');
    try {
      saveBlob(await downloadReportPdf(), 'ruta-alfa-lectura.pdf');
      setPdf('idle');
    } catch {
      setPdf('error');
    }
  }

  if (view.kind === 'loading' || view.kind === 'writing') {
    return (
      <div className="wrap" style={{ maxWidth: 760 }}>
        <Loading
          center
          label={
            view.kind === 'writing' ? 'Estamos escribiendo tu lectura…' : 'Preparando tu lectura…'
          }
        />
      </div>
    );
  }
  if (view.kind === 'error') {
    return (
      <div className="wrap" style={{ maxWidth: 760 }}>
        <ErrorState
          center
          error={view.error}
          title="No pudimos cargar tu lectura"
          onRetry={retry}
        />
      </div>
    );
  }

  return (
    <>
      {view.kind === 'stopped' ? (
        <StopNotice
          stop={view.stop}
          actions={
            <>
              <Button variant="solid" onClick={() => setScheduling(true)}>
                Agendar valoración médica
              </Button>
              <Button variant="ghost" onClick={restart}>
                Volver al inicio
              </Button>
            </>
          }
        />
      ) : (
        <ReportView
          report={view.report}
          metaLabel={`Evaluación ${view.report.engine_version}`}
          actions={
            <>
              <Button variant="solid" onClick={() => setScheduling(true)}>
                {view.report.next_step.cta_label}
              </Button>
              <Button onClick={savePdf} disabled={pdf === 'working'}>
                {pdf === 'working' ? 'Preparando PDF…' : 'Guardar mi lectura'}
              </Button>
              <Button variant="ghost" onClick={restart}>
                Volver al inicio
              </Button>
              {pdf === 'error' && (
                <p className="small" role="alert" style={{ width: '100%', margin: 0 }}>
                  No pudimos generar el PDF. Inténtalo de nuevo.
                </p>
              )}
            </>
          }
        />
      )}
      {scheduling && <AppointmentModal onClose={() => setScheduling(false)} />}
    </>
  );
}
