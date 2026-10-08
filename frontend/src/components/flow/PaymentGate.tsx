import { useState } from 'react';
import type { Money } from '../../types/api';
import { formatMoney } from '../../utils/format';
import { AppointmentModal } from '../appointments/AppointmentModal';
import { Button } from '../ui/Button';
import { PaymentModal } from './PaymentModal';

interface PaymentGateProps {
  price: Money;
  totalQuestions: number;
  paid: boolean;
  onBack: () => void;
  onContinue: () => void;
}

const INCLUDED = [
  'Tu grado y tu mapa de siete dimensiones',
  'La lectura de tu caso, escrita',
  'Tu puntaje en la escala validada y qué significa',
  'Todos tus factores, nombrados uno a uno',
  'Tu ruta de atención y con quién hablar',
  'Programa diario de 21 días',
  'Los exámenes que se suelen considerar',
  '7 preguntas para llevar a la consulta',
  'Tu punto cero guardado y la remedición al día 21',
  'Agendamiento con profesional',
];

/** Payment gate shown right after the first question (FR-13). */
export function PaymentGate({ price, totalQuestions, paid, onBack, onContinue }: PaymentGateProps) {
  const [modal, setModal] = useState<'pay' | 'doctor' | null>(null);

  return (
    <div className="inter">
      <span className="k">Ruta ALFA</span>
      <h2>
        Tu evaluación
        <br />
        completa
      </h2>
      <p className="lede" style={{ marginBottom: 6 }}>
        Lo que sigue son {totalQuestions} preguntas ordenadas como las haría un profesional en
        consulta. Al terminar recibes tu lectura completa: sin partes bloqueadas y sin nada que
        comprar después.
      </p>
      <div className="price">
        <b>{formatMoney(price)}</b>
        <span>{price.currency} · pago único</span>
      </div>
      <ul className="incl">
        {INCLUDED.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="note">
        <strong>Garantía de seguridad</strong>
        <p>
          Si en cualquier momento tus respuestas muestran una señal que exige atención médica, la
          evaluación se detiene ahí, esa información se entrega gratis y se devuelve el 100 % del
          pago. Nunca te vamos a vender un informe cuando lo que necesitas es un médico.
        </p>
      </div>
      <div className="flow-nav">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <div className="right">
          <Button variant="ghost" onClick={() => setModal('doctor')}>
            Prefiero un médico
          </Button>
          <Button variant="solid" onClick={paid ? onContinue : () => setModal('pay')}>
            {paid ? 'Continuar' : 'Pagar y empezar'}
          </Button>
        </div>
      </div>
      <p className="small" style={{ marginTop: 20, maxWidth: '58ch' }}>
        Pago seguro. No guardamos datos de tu tarjeta. La evaluación no es un diagnóstico médico y
        no reemplaza la consulta profesional.
      </p>

      {modal === 'pay' && <PaymentModal price={price} onClose={() => setModal(null)} />}
      {modal === 'doctor' && (
        <AppointmentModal canShareAssessment={false} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
