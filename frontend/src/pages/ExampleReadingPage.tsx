import { useState } from 'react';
import { AppointmentModal } from '../components/appointments/AppointmentModal';
import { ReportView } from '../components/report/ReportView';
import { Button } from '../components/ui/Button';
import { EmptyState, ErrorState, Loading } from '../components/ui/Feedback';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchExampleReport, fetchExampleReports } from '../services/contact';

function ExampleReport({ reportKey }: { reportKey: string }) {
  const [scheduling, setScheduling] = useState(false);
  const report = useAsyncData(() => fetchExampleReport(reportKey));

  if (report.status === 'loading') {
    return (
      <div className="wrap">
        <Loading center label="Cargando lectura…" />
      </div>
    );
  }
  if (report.status === 'error') {
    return (
      <div className="wrap" style={{ paddingTop: 40 }}>
        <ErrorState error={report.error} onRetry={report.reload} />
      </div>
    );
  }
  return (
    <>
      <ReportView
        report={report.data}
        metaLabel="Ruta ALFA"
        actions={
          <>
            <Button variant="solid" onClick={() => setScheduling(true)}>
              {report.data.next_step.cta_label}
            </Button>
            <Button onClick={() => window.print()}>Guardar mi lectura</Button>
          </>
        }
      />
      {scheduling && (
        <AppointmentModal canShareAssessment={false} onClose={() => setScheduling(false)} />
      )}
    </>
  );
}

/** Internal review page: the deliverable, as it looks for three worked cases. */
export function ExampleReadingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const cases = useAsyncData(fetchExampleReports);
  const activeKey = selected ?? (cases.status === 'ready' ? cases.data[0]?.key : undefined);

  return (
    <div className="page-reading">
      <div className="demo">
        <div className="wrap">
          <span className="t">Ejemplo de entregable · vista interna</span>
          <div className="tabs">
            {cases.status === 'ready' &&
              cases.data.map((c) => (
                <button
                  type="button"
                  className="tab"
                  key={c.key}
                  aria-pressed={c.key === activeKey}
                  onClick={() => setSelected(c.key)}
                >
                  {c.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {cases.status === 'loading' && (
        <div className="wrap">
          <Loading center label="Cargando ejemplos…" />
        </div>
      )}
      {cases.status === 'error' && (
        <div className="wrap" style={{ paddingTop: 40 }}>
          <ErrorState error={cases.error} onRetry={cases.reload} />
        </div>
      )}
      {cases.status === 'ready' && !activeKey && (
        <div className="wrap" style={{ paddingTop: 40 }}>
          <EmptyState
            title="Sin ejemplos"
            text="Todavía no hay lecturas de ejemplo para mostrar."
          />
        </div>
      )}
      {activeKey && <ExampleReport key={activeKey} reportKey={activeKey} />}
    </div>
  );
}
