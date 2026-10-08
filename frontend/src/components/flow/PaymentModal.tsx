import { useState } from 'react';
import { startPayment } from '../../services/assessments';
import type { Money, PaymentMethod } from '../../types/api';
import { formatMoney } from '../../utils/format';
import { Button } from '../ui/Button';
import { errorMessage } from '../ui/Feedback';
import { Modal } from '../ui/Modal';

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'card', label: 'Tarjeta' },
  { value: 'pse', label: 'PSE' },
  { value: 'nequi', label: 'Nequi' },
];

/** Picks a method, creates the order and sends him to the gateway's own page. */
export function PaymentModal({ price, onClose }: { price: Money; onClose: () => void }) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setSending(true);
    setError(null);
    try {
      const order = await startPayment(method, `${window.location.origin}/payment/return`);
      window.location.assign(order.checkout_url);
    } catch (cause) {
      setSending(false);
      setError(errorMessage(cause instanceof Error ? cause : new Error()));
    }
  }

  return (
    <Modal label="Pago único" onClose={onClose}>
      <span className="eyebrow">Pago único</span>
      <h2>Ruta ALFA</h2>
      <div className="price">
        <b>{formatMoney(price)}</b>
        <span>{price.currency}</span>
      </div>
      <p className="small" style={{ margin: '8px 0 6px' }}>
        Elige cómo pagar. Te llevamos a la página segura de la pasarela y vuelves aquí para empezar.
      </p>
      <div className="opts" style={{ margin: '14px 0 22px' }}>
        {METHODS.map((m) => (
          <button
            type="button"
            key={m.value}
            className="opt"
            aria-pressed={method === m.value}
            disabled={sending}
            onClick={() => setMethod(m.value)}
          >
            <span className="mark" />
            <span>{m.label}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
        <Button variant="solid" onClick={pay} disabled={sending}>
          {sending ? 'Conectando…' : 'Ir a pagar'}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={sending}>
          Ahora no
        </Button>
      </div>
      {error && (
        <p className="small" role="alert" style={{ marginTop: 16, color: 'var(--plata)' }}>
          {error}
        </p>
      )}
      <p className="small" style={{ marginTop: 16 }}>
        Si aparece una señal que exige atención médica, el proceso se detiene y se devuelve el 100
        %.
      </p>
    </Modal>
  );
}
