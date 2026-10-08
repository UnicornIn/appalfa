import { useAppointmentForm } from '../../hooks/useAppointmentForm';
import { SLOTS } from '../../utils/appointment';
import { Button } from '../ui/Button';
import { SelectField, TextField } from '../ui/Fields';
import { Modal } from '../ui/Modal';

interface AppointmentModalProps {
  onClose: () => void;
  /** Offer to share the finished evaluation (only when there is one). */
  canShareAssessment?: boolean;
}

export function AppointmentModal({ onClose, canShareAssessment = true }: AppointmentModalProps) {
  const { values, setField, status, error, confirmed, submit } = useAppointmentForm(false);
  const sending = status === 'sending';

  return (
    <Modal label="Agendar valoración" onClose={onClose}>
      <span className="eyebrow">Agendar</span>
      <h2>Valoración con profesional</h2>
      <p className="small" style={{ margin: '14px 0 22px' }}>
        Te escribimos por WhatsApp para coordinar día y hora. Si ya hiciste la evaluación, el
        profesional la recibe solo con tu autorización.
      </p>
      {status === 'sent' && confirmed ? (
        <div className="state" role="status">
          <span className="eyebrow">Solicitud enviada</span>
          <p style={{ margin: 0 }}>
            Listo, {confirmed.name}. Te escribimos a {confirmed.phone} para confirmar tu cita.
          </p>
        </div>
      ) : (
        <>
          <TextField
            label="Cómo te llamamos"
            type="text"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
          />
          <TextField
            label="WhatsApp"
            type="tel"
            placeholder="+57"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
          />
          <SelectField
            label="Franja preferida"
            options={SLOTS}
            value={values.slot}
            onChange={(e) => setField('slot', e.target.value)}
          />
          {canShareAssessment && (
            <label className="consent">
              <input
                type="checkbox"
                checked={values.share}
                onChange={(e) => setField('share', e.target.checked)}
              />
              Autorizo compartir mi evaluación con el profesional que me atienda.
            </label>
          )}
          <Button variant="solid" block onClick={submit} disabled={sending}>
            {sending ? 'Enviando…' : 'Solicitar cita'}
          </Button>
          <p className="small" role="status" style={{ marginTop: 12 }}>
            {error}
          </p>
        </>
      )}
    </Modal>
  );
}
