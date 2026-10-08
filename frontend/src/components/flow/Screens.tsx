import type { Interstitial } from '../../types/api';
import { Button } from '../ui/Button';

interface NavProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  busy?: boolean;
}

function Nav({ onBack, onNext, nextLabel, busy }: NavProps) {
  return (
    <div className="flow-nav">
      <Button variant="ghost" onClick={onBack} disabled={busy}>
        Atrás
      </Button>
      <Button variant="solid" onClick={onNext} disabled={busy}>
        {nextLabel}
      </Button>
    </div>
  );
}

/** Chapter introduction. */
export function InterstitialScreen({
  content,
  onBack,
  onNext,
}: { content: Interstitial } & Omit<NavProps, 'nextLabel'>) {
  return (
    <div className="inter">
      <span className="k">{content.kicker}</span>
      <h2>{content.title}</h2>
      <p className="lede">{content.text}</p>
      <Nav onBack={onBack} onNext={onNext} nextLabel="Continuar" />
    </div>
  );
}

/** "Una pausa": reflects back what he just told us. */
export function PauseScreen({
  text,
  onBack,
  onNext,
  busy,
}: { text: string } & Omit<NavProps, 'nextLabel'>) {
  return (
    <div className="inter">
      <span className="k">Lo que llevamos</span>
      <h2>Una pausa</h2>
      <div className="note">
        <strong>De tus respuestas</strong>
        <p>{text}</p>
      </div>
      <p className="small" style={{ marginTop: 22, maxWidth: '58ch' }}>
        Esto no es un diagnóstico ni una conclusión. Es lo que tú mismo acabas de contar, ordenado.
      </p>
      <Nav onBack={onBack} onNext={onNext} nextLabel="Seguir" busy={busy} />
    </div>
  );
}
