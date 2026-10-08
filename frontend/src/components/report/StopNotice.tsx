import type { ReactNode } from 'react';
import type { Stop } from '../../types/api';
import { Logo } from '../ui/Logo';

interface StopNoticeProps {
  stop: Stop;
  actions: ReactNode;
}

/** Shown when a red flag ends the assessment: no report, no plan, no sale. */
export function StopNotice({ stop, actions }: StopNoticeProps) {
  const refundPending = stop.refund === 'refund_pending';
  return (
    <div className="wrap stop-page">
      <Logo />
      <div className="alert">
        <span className="eyebrow">Tu evaluación se detiene aquí</span>
        <h2>
          Esto merece un médico,
          <br />
          no un informe
        </h2>
        <p className="lede" style={{ marginBottom: 6 }}>
          Por lo que respondiste, hay algo que conviene revisar con un profesional antes de seguir
          con cualquier evaluación, plan o tratamiento. Te lo decimos sin cobrarte nada y sin vender
          nada.
        </p>
        <div className="alert-item">
          <h3>{stop.title}</h3>
          <p>{stop.message}</p>
        </div>
        {refundPending && (
          <div className="note">
            <strong>Tu pago se devuelve</strong>
            <p>
              No cobramos una evaluación que termina aquí. La devolución del 100 % se procesa
              automáticamente sobre el mismo medio de pago.
            </p>
          </div>
        )}
        <div className="actions" style={{ marginTop: 28 }}>
          {actions}
        </div>
      </div>
      <p className="legal" style={{ marginTop: 34 }}>
        <b>Importante.</b> Esto no es un diagnóstico. Es una señal de que tu caso debe ser valorado
        por un profesional de la salud. Si tienes dolor en el pecho, falta de aire intenso o dolor
        agudo en este momento, acude a urgencias o llama a tu línea de emergencias.
      </p>
    </div>
  );
}
