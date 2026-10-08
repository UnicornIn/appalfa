import { useAppointmentForm } from '../../hooks/useAppointmentForm';
import { REASONS, SLOTS } from '../../utils/appointment';
import { Button } from '../ui/Button';
import { SelectField, TextField } from '../ui/Fields';

/** The "Agendar valoración" card on the landing page. */
export function AppointmentForm() {
  const { values, setField, status, error, confirmed, submit } = useAppointmentForm(true);
  const sending = status === 'sending';

  return (
    <div className="booking">
      <h3 style={{ marginBottom: 22 }}>Agendar valoración</h3>
      <TextField
        label="Cómo te llamamos"
        type="text"
        autoComplete="given-name"
        placeholder="Nombre o como prefieras"
        value={values.name}
        onChange={(e) => setField('name', e.target.value)}
      />
      <TextField
        label="WhatsApp"
        type="tel"
        autoComplete="tel"
        placeholder="+57"
        value={values.phone}
        onChange={(e) => setField('phone', e.target.value)}
      />
      <SelectField
        label="Motivo"
        options={REASONS}
        value={values.reason}
        onChange={(e) => setField('reason', e.target.value)}
      />
      <SelectField
        label="Franja preferida"
        options={SLOTS}
        value={values.slot}
        onChange={(e) => setField('slot', e.target.value)}
      />
      <Button variant="solid" block onClick={submit} disabled={sending}>
        {sending ? 'Enviando…' : 'Solicitar mi cita'}
      </Button>
      <p className="small" style={{ margin: '14px 0 0' }}>
        Al enviar aceptas que te contactemos por WhatsApp únicamente para coordinar la cita.
      </p>
      <p className="small" role="status" style={{ margin: '12px 0 0', color: 'var(--plata)' }}>
        {status === 'sent' && confirmed
          ? `Listo, ${confirmed.name}. Te escribimos a ${confirmed.phone} para confirmar tu cita.`
          : error}
      </p>
    </div>
  );
}
