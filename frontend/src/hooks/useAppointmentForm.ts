import { useState } from 'react';
import { requestAppointment } from '../services/contact';
import { ApiError } from '../services/http';
import { REASONS, SLOTS } from '../utils/appointment';

interface Values {
  name: string;
  phone: string;
  reason: string;
  slot: string;
  share: boolean;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const MISSING = 'Necesitamos un nombre y un WhatsApp para coordinar.';
const INVALID_PHONE = 'Revisa el número de WhatsApp: parece incompleto.';

export function useAppointmentForm(includeReason: boolean) {
  const [values, setValues] = useState<Values>({
    name: '',
    phone: '',
    reason: REASONS[0],
    slot: SLOTS[0],
    share: false,
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ name: string; phone: string } | null>(null);

  const setField = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function submit() {
    const name = values.name.trim();
    const phone = values.phone.trim();
    if (!name || !phone) {
      setError(MISSING);
      return;
    }
    setStatus('sending');
    setError(null);
    try {
      await requestAppointment({
        name,
        phone,
        reason: includeReason ? values.reason : undefined,
        slot: values.slot,
        share_assessment: values.share,
      });
      setConfirmed({ name, phone });
      setStatus('sent');
    } catch (cause) {
      setStatus('error');
      setError(
        cause instanceof ApiError && cause.status === 422
          ? INVALID_PHONE
          : 'No pudimos enviar tu solicitud. Inténtalo de nuevo en un momento.',
      );
    }
  }

  return { values, setField, status, error, confirmed, submit };
}
