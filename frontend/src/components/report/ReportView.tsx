import type { Report } from '../../types/api';
import { formatLongDate } from '../../utils/format';
import { Gauge } from '../charts/Gauge';
import { Radar } from '../charts/Radar';
import { Logo } from '../ui/Logo';
import { ReportDisclaimer } from './ReportDisclaimer';
import { ReportSectionBlock } from './ReportSectionBlock';

interface ReportViewProps {
  report: Report;
  /** Text after the date in the top-right corner. */
  metaLabel: string;
  /** Buttons for the "next step" card. */
  actions: React.ReactNode;
}

const COMPLEMENT_LABEL = 'con apoyo psicológico';

export function ReportView({ report, metaLabel, actions }: ReportViewProps) {
  return (
    <div className="wrap report">
      <div className="report-top">
        <Logo />
        <span className="small">
          {formatLongDate(report.generated_at)} · {metaLabel}
        </span>
      </div>

      <div className="res-hero">
        <span className="eyebrow">Ruta ALFA · tu lectura</span>
        <h1>{report.route_label}</h1>
        {report.route.complement && (
          <p className="small" style={{ marginTop: 12 }}>
            {COMPLEMENT_LABEL}
          </p>
        )}
        <div className="res-grid" style={{ marginTop: 34 }}>
          <div>
            <h3 style={{ marginBottom: 6 }}>Tu grado, como tú lo calificaste</h3>
            <div className="gauge-wrap">
              <Gauge level={report.grade.level} />
              <span>{report.grade.label}</span>
            </div>
            <p className="small" style={{ maxWidth: '48ch' }}>
              Nadie te puso ese número: lo elegiste tú en la escala de firmeza. Es la referencia
              contra la que vas a comparar dentro de un mes.
            </p>
            <h3 style={{ margin: '34px 0 10px' }}>
              Factores identificados: {report.factors.length}
            </h3>
            <div className="factors">
              {report.factors.map((factor) => (
                <span className="fchip" key={factor.code}>
                  {factor.label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: 4 }}>Tu mapa</h3>
            <p className="small" style={{ marginBottom: 6 }}>
              Construido con tus respuestas. Más lejos del centro, mejor lo que reportaste. No es un
              diagnóstico.
            </p>
            <Radar map={report.map} />
          </div>
        </div>
      </div>

      <div className="report-blocks">
        {report.sections.map((section) => (
          <ReportSectionBlock key={section.id} section={section} />
        ))}
      </div>

      <div className="next-step no-print">
        <span className="eyebrow">El siguiente paso</span>
        <h2>{report.next_step.title}</h2>
        <p className="lede">{report.next_step.text}</p>
        <div className="actions">{actions}</div>
      </div>

      <ReportDisclaimer engineVersion={report.engine_version} />
    </div>
  );
}
