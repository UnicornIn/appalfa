import { useEffect } from 'react';
import { Logo } from '../ui/Logo';

interface FlowShellProps {
  chapterLabel: string;
  counter: string;
  percent: number;
  syncError: boolean;
  onRetrySync: () => void;
  onExit: () => void;
  children: React.ReactNode;
}

/** Full-screen frame: progress header and the question body. */
export function FlowShell({
  chapterLabel,
  counter,
  percent,
  syncError,
  onRetrySync,
  onExit,
  children,
}: FlowShellProps) {
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <div className="flow" role="dialog" aria-modal="true" aria-label="Evaluación privada">
      <div className="flow-top">
        <div className="flow-top-in">
          <div className="flow-meta">
            <Logo negative style={{ fontSize: 12, letterSpacing: '.34em' }} />
            <span className="chapter">{chapterLabel}</span>
            <span aria-live="polite">{counter}</span>
            <button type="button" onClick={onExit}>
              Salir
            </button>
          </div>
          <div
            className="bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <i style={{ width: `${percent}%` }} />
          </div>
        </div>
        {syncError && (
          <div className="sync-warning" role="alert">
            <p className="small" style={{ margin: '0 0 10px' }}>
              No pudimos guardar tu última respuesta.{' '}
              <button
                type="button"
                onClick={onRetrySync}
                style={{
                  background: 'none',
                  border: 0,
                  color: 'var(--plata)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit',
                  padding: 0,
                }}
              >
                Reintentar
              </button>
            </p>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
