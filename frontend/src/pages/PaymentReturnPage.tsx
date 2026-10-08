import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Feedback';
import { Logo } from '../components/ui/Logo';
import { fetchOrder } from '../services/assessments';
import { ApiError } from '../services/http';

const POLL_MS = 2000;
const MAX_POLLS = 30;

type View = 'checking' | 'failed' | 'waiting' | 'error';

/** Where the gateway sends him back. Asks the server for the order until it is settled. */
export function PaymentReturnPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get('order');
  const [view, setView] = useState<View>(orderId ? 'checking' : 'error');
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let polls = 0;
    let timer: number | undefined;
    setView('checking');

    const check = async () => {
      try {
        const order = await fetchOrder(orderId);
        if (cancelled) return;
        if (order.state === 'paid') {
          navigate('/evaluacion', { replace: true });
        } else if (order.state === 'failed') {
          setView('failed');
        } else if (++polls >= MAX_POLLS) {
          setView('waiting');
        } else {
          timer = window.setTimeout(check, POLL_MS);
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.isNetwork && ++polls < MAX_POLLS) {
          timer = window.setTimeout(check, POLL_MS);
          return;
        }
        setView('error');
      }
    };
    void check();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [orderId, navigate, round]);

  return (
    <div className="wrap" style={{ maxWidth: 760, paddingTop: 44, paddingBottom: 80 }}>
      <Logo to="/" />
      <div className="state-center">
        {view === 'checking' && <Loading label="Confirmando tu pago…" />}
        {view !== 'checking' && (
          <div className="state" role="alert">
            <span className="eyebrow">
              {view === 'failed'
                ? 'El pago no se completó'
                : view === 'waiting'
                  ? 'Seguimos esperando'
                  : 'No pudimos confirmar el pago'}
            </span>
            <p>
              {view === 'failed' &&
                'La pasarela no aprobó el pago. No se cobró nada. Puedes intentarlo de nuevo cuando quieras.'}
              {view === 'waiting' &&
                'Aún no recibimos la confirmación de la pasarela. Si ya pagaste, vuelve a revisar en un momento.'}
              {view === 'error' &&
                'No encontramos tu pago o no pudimos consultarlo. Vuelve a tu evaluación para revisar su estado.'}
            </p>
            <div className="actions">
              {view === 'waiting' && (
                <Button variant="solid" onClick={() => setRound((n) => n + 1)}>
                  Revisar de nuevo
                </Button>
              )}
              <Button
                variant={view === 'waiting' ? 'ghost' : 'solid'}
                onClick={() => navigate('/evaluacion', { replace: true })}
              >
                Volver a mi evaluación
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
